import csv


def do_update():
    csv_file = open('c:/bench/bluestreets/data/vols.csv', 'r')
    rdr = csv.reader(csv_file)
    for row in rdr:
        pt.clear_rows()
        d = to_dict(row)
        bld_pt_row_from_csv(d)
        j = get_best_jurisdiction_match(d['jurisdiction_name'])
        jwp = '%s:%s:%s' % (jurisdictions[j[0]], d['ward'], d['pct'])
        if jwp in precincts:
            contacts = get_contact(d['last_name'], d['first_name'])
            for contact in contacts:
                bld_pt_row_from_contact(contact, precincts[jwp])
        print(pt)
        print('\n')


def to_dict(row):
    return {
        'jurisdiction_name': row[0].upper(),
        'ward': row[1].zfill(2),
        'pct': row[2].zfill(3),
        'last_name': row[3].upper(),
        'first_name': row[4].upper(),
        'group_code': row[5],
        'g': row[6],
        'h': row[7],
        'i': row[8],
        'phone': row[9],
        'old_phone': row[10],
        'email': row[11],
        'old_email': row[12],
        'text': row[13],
        'status': row[14],
        'address': row[15],
        'city': row[16],
        'state': row[17],
        'zip': row[18],
        't': row[19],
        'u': row[20],
        'v': row[21]
    }


def bld_pt_row_from_csv(d):
    a = [
        '%s, %s' % (d['last_name'], d['first_name']), '',
        d['address'], d['city'], d['zip'],
        d['jurisdiction_name'], d['ward'], d['pct'],
        d['email'], d['old_email'],
        d['phone'], d['old_phone']
    ]
    pt.add_row(a)


def bld_pt_row_from_contact(contact, pct):
    a = [
        str(contact.name), contact.name.nickname,
        str(contact.address), contact.address.city, contact.address.zipcode,
        pct['jurisdiction_name'], pct['ward'], pct['precinct'],
        contact.info.email, '',
        '%s-%s-%s' % (contact.info.phone1[0:3], contact.info.phone1[3:6], contact.info.phone1[6:]),
        '%s-%s-%s' % (contact.info.phone2[0:3], contact.info.phone2[3:6], contact.info.phone2[6:]),
    ]
    pt.add_row(a)


def get_contact(last, first):
    from models.contact import Contact

    sql = ("SELECT * FROM contacts "
           "WHERE last_name=? "
           "AND ? in (first_name, nickname)")
    vals = (last, first)
    rex = dao.execute(sql, vals)
    return [Contact(rec) for rec in rex]


def get_jurisdictions():
    sql = 'SELECT * FROM jurisdictions'
    rex = dao.execute(sql)
    return {rec['name']: rec['code'] for rec in rex}


def get_best_jurisdiction_match(csv_jurisdiction):
    from fuzzywuzzy import fuzz

    if csv_jurisdiction.startswith('AA'):
        csv_jurisdiction = 'ANN ARBOR' + csv_jurisdiction[2:]
    a = [(x, fuzz.token_set_ratio(csv_jurisdiction, x)) for x in jurisdictions]
    ch = None
    hi = 0
    for i in a:
        if i[1] > hi:
            ch = i
            hi = i[1]
    return ch


if __name__ == '__main__':
    from prettytable import PrettyTable
    from models.dao import Dao
    from models.precinct import Precinct

    pt = PrettyTable()
    pt.field_names = [
        'name', 'nickname',
        'address', 'city', 'zip',
        'juris', 'ward', 'pct',
        'email1', 'email2', 'phone1', 'phone2'
    ]
    for fn in pt.field_names:
        pt.align[fn] = 'l'

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    precincts = Precinct.get_by_jwp(dao)
    jurisdictions = get_jurisdictions()

    do_update()

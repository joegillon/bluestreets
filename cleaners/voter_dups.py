def get_dups():
    flds = name_flds + ', ' + rec_flds + ', count(*) c '
    sql = ("SELECT %s "
           "FROM voters "
           "GROUP BY (last_name || ':' || first_name || ':' || middle_name || ':' || birth_year) "
           "HAVING c > 1;") % (flds,)
    return dao.execute(sql)


def get_vrex(d):
    from models.voter import Voter

    flds = name_flds + ', ' + addr_flds + ', ' + pct_flds + ', ' + rec_flds
    sql = ("SELECT %s "
           "FROM voters "
           "WHERE last_name=? "
           "AND first_name=? "
           "AND middle_name=? "
           "ORDER BY reg_date;") % (flds,)
    vals = (d['last_name'], d['first_name'], d['middle_name'])
    rex = dao.execute(sql, vals)
    return [Voter(rec) for rec in rex]


def get_hx(voter_ids):
    sql = ("SELECT voter_id, jurisdiction_code, election_date, election_description "
           "FROM voter_history "
           "WHERE voter_id IN (%s) "
           "ORDER BY election_date") % dao.get_param_str(voter_ids)
    return dao.execute(sql, voter_ids)


def show_voter_tbl(vrex):
    vtbl.clear_rows()
    for vrec in vrex:
        pct = precincts[vrec.address.precinct_id]
        row = [
            str(vrec.name),
            vrec.birth_year,
            str(vrec.address),
            vrec.address.city,
            vrec.address.zipcode,
            pct.jurisdiction_name,
            pct.ward,
            pct.precinct,
            vrec.voter_id,
            vrec.reg_date
        ]
        vtbl.add_row(row)
    print(vtbl)


def show_hx_tbl(hrex):
    htbl.clear_rows()
    for hrec in hrex:
        row = [
            hrec['voter_id'],
            jurisdictions[hrec['jurisdiction_code']],
            hrec['election_date'],
            hrec['election_description']
        ]
        htbl.add_row(row)
    print(htbl)


def do_new_pct_movers():
    global cnt
    if len(addrs) > 1:
        pcts = set([v.address.precinct_id for v in vrex])
        if len(pcts) > 1:
            show_voter_tbl(vrex)
            hrex = get_hx([vrec.voter_id for vrec in vrex])
            show_hx_tbl(hrex)
            print('\n')
            cnt += 1


def do_same_pct_movers():
    global cnt
    if len(addrs) > 1:
        pcts = set([v.address.precinct_id for v in vrex])
        if len(pcts) == 1:
            show_voter_tbl(vrex)
            hrex = get_hx([vrec.voter_id for vrec in vrex])
            show_hx_tbl(hrex)
            print('\n')
            cnt += 1


def do_same_address():
    global cnt
    if len(addrs) == 1:
        show_voter_tbl(vrex)
        hrex = get_hx([vrec.voter_id for vrec in vrex])
        show_hx_tbl(hrex)
        print('\n')
        cnt += 1


if __name__ == '__main__':
    from prettytable import PrettyTable
    from dao.dao import Dao
    from models.precinct import Precinct

    name_flds = 'last_name, first_name, middle_name, name_suffix, birth_year'
    addr_flds = 'house_number, pre_direction, street_name, street_type, suf_direction'
    pct_flds = 'city, zipcode, precinct_id'
    rec_flds = 'voter_id, reg_date'

    vtbl = PrettyTable()
    vtbl.field_names = [
        'Name', 'Birth Yr',
        'Address', 'City', 'Zip',
        'Juris', 'Ward', 'Pct',
        'Voter ID', 'Reg Date'
    ]
    for fn in vtbl.field_names:
        vtbl.align[fn] = 'l'

    htbl = PrettyTable()
    htbl.field_names = [
        'Voter ID', 'Juris', 'Date', 'Description'
    ]
    for fn in htbl.field_names:
        htbl.align[fn] = 'l'

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    precincts = Precinct.get_dict(dao)
    jurisdictions = Precinct.get_jurisdictions(dao)
    jurisdictions = {j['code']: j['name'] for j in jurisdictions}

    dups = get_dups()

    cnt = 0
    for dup in dups:
        vrex = get_vrex(dup)
        addrs = set([str(vrec.address) for vrec in vrex])
        # do_same_pct_movers()
        do_new_pct_movers()
        # do_same_address()

    print(cnt)


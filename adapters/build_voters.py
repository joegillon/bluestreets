from metaphone import doublemetaphone as dm
from models.address import street_abbrs
from models.dao import Dao


def do_it():
    clump_cnt = 0
    total_cnt = 0
    ifile = open('C:/bench/bluestreets/data/michigan/entire_state_v.lst', 'r')
    ofile = open('voters.sql', 'w')
    ofile.write('SELECT "Starting Inserts";\n')
    ofile.write('BEGIN TRANSACTION;\n')
    for line in ifile:
        d = to_dict(line)
        if d['county_code'] != '81':
            continue
        ofile.write(insert_statement(to_dict(line)))
        clump_cnt += 1
        total_cnt += 1
        if clump_cnt == 100000:
            ofile.write('COMMIT;\n')
            ofile.write('SELECT %s;\n' % str(total_cnt))
            print(str(total_cnt))
            ofile.write('BEGIN TRANSACTION;\n')
            clump_cnt = 0
        # if total_cnt == 123:
        #     break

    ofile.write('COMMIT;\n')
    ofile.write('SELECT %s;\n' % str(total_cnt))
    print(str(total_cnt))
    print('Inserts complete!')

    ifile.close()
    ofile.close()
    print('Done!')


def to_dict(line):
    return {
        'last_name': line[0:35].replace('\\', '').strip(),
        'first_name': line[35:55].replace('\\', '').strip(),
        'middle_name': line[55:75].replace('\\', '').strip(),
        'name_suffix': line[75:78].replace('\\', '').strip(),
        'birth_year': line[78:82].replace('\\', '').strip(),
        'gender': line[82].replace('\\', '').strip(),
        'house_number': line[92:99].replace('\\', '').strip(),
        'pre_direction': line[103:105].replace('\\', '').strip(),
        'street_name': line[105:135].replace('\\', '').strip(),
        'street_type': line[135:141].replace('\\', '').strip(),
        'suf_direction': line[141:143].replace('\\', '').strip(),
        'unit': line[143:156].replace('\\', '').strip(),
        'city': line[156:191].replace('\\', '').strip(),
        'zipcode': line[193:198].replace('\\', '').strip(),
        'county_code': line[461:463].replace('\\', '').strip(),
        'jurisdiction_code': line[463:468].replace('\\', '').strip(),
        'ward': line[468:474][0:2].replace('\\', ''),
        'precinct': line[468:474][2:].replace('\\', '').strip(),
        'school_code': line[474:479].replace('\\', '').strip(),
        'state_house': line[479:484].replace('\\', '').strip(),
        'state_senate': line[484:489].replace('\\', '').strip(),
        'congress': line[489:494].replace('\\', '').strip(),
        'county_commissioner': line[494:499].replace('\\', '').strip(),
        'village_code': line[499:504].replace('\\', '').strip(),
        'village_precinct': line[504:510].replace('\\', '').strip(),
        'school_precinct': line[510:516].replace('\\', '').strip(),
        'voter_id': line[448:461].replace('\\', '').strip(),
        'reg_date': line[83:91],
        'permanent_absentee': line[516].replace('\\', '').strip(),
        'status': line[517:519].replace('\\', '').strip(),
        'uocava': line[519].replace('\\', '').strip()
    }


def insert_statement(d):
    precinct_id = str(get_precinct(d))
    t = d['street_type']
    if t in street_abbrs:
        t = street_abbrs[t]
    reg_date = '"%s-%s-%s"' % (
        d['reg_date'][4:].strip(), d['reg_date'][0:2], d['reg_date'][2:4])
    flds = [
        '"' + d['last_name'] + '"',
        '"' + d['first_name'] + '"',
        '"' + d['middle_name'] + '"',
        '"' + d['name_suffix'] + '"',
        '"' + dm(d['last_name'])[0] + '"',
        '"' + dm(d['first_name'])[0] + '"',
        d['birth_year'],
        '"' + d['gender'] + '"',
        d['house_number'] if d['house_number'] else 'null',
        '"' + d['pre_direction'] + '"',
        '"' + d['street_name'] + '"',
        '"' + d['street_type'] + '"',
        '"' + d['suf_direction'] + '"',
        '"' + d['unit'] + '"',
        '"' + dm(d['street_name'] + ' ' + t)[0] + '"',
        '"' + d['city'] + '"',
        '"' + d['zipcode'] + '"',
        precinct_id,
        '"' + d['voter_id'] + '"',
        reg_date,
        '"' + d['permanent_absentee'] + '"',
        '"' + d['status'] + '"',
        '"' + d['uocava'] + '"'
    ]
    return ("INSERT INTO voters "
            "(%s) "
            "VALUES (%s);\n") % (
        ','.join(fldnames),
        ','.join(flds)
    )


def get_precinct(d):
    jwp = '%s:%s:%s' % (
        d['jurisdiction_code'], d['ward'], d['precinct']
    )
    if jwp not in precincts:
        s = 'No precinct: %s, %s, %s @ %s, %s, %s, %s' % (
            d['last_name'], d['first_name'], d['middle_name'],
            d['county_code'], d['jurisdiction_code'],
            d['ward'], d['precinct']
        )
        print(s)
        return ''
    return precincts[jwp]['id']


if __name__ == '__main__':
    from models.precinct import Precinct

    fldnames = [
        'last_name', 'first_name', 'middle_name', 'name_suffix',
        'last_name_meta', 'first_name_meta', 'birth_year', 'gender',
        'house_number', 'pre_direction', 'street_name', 'street_type',
        'suf_direction', 'unit', 'street_name_meta', 'city', 'zipcode',
        'precinct_id', 'voter_id', 'reg_date',
        'permanent_absentee', 'status', 'uocava'
    ]

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    precincts = Precinct.get_by_jwp(dao)
    do_it()

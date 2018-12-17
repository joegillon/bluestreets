'''
This script reads a state voter history file and writes a matching SQL
file. It does not include ballot selection which is done afterwards with
add_ballots.py.
'''

from dao.dao import Dao


def do_it():
    clump_cnt = 0
    total_cnt = 0
    ifile = open('C:/bench/bluestreets/data/michigan/entire_state_h.lst', 'r')
    ofile = open('../data/voter_history.sql', 'w')
    ofile.write('BEGIN TRANSACTION;\n')
    for line in ifile:
        d = to_dict(line)
        if d['county_code'] != '81':
            continue
        d['election_date'] = elections[d['election_code']]['date']
        d['election_description'] = elections[d['election_code']]['description']
        d['ballot'] = ''
        ofile.write(insert_statement(d))
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
        'voter_id': line[0:13].replace('\\', '').strip(),
        'county_code': line[13:15].replace('\\', '').strip(),
        'jurisdiction_code': line[15:20].replace('\\', '').strip(),
        'school_code': line[20:25].replace('\\', '').strip(),
        'election_code': line[25:38].replace('\\', '').strip(),
        'absentee_flag': line[38].replace('\\', '').strip()
    }


def insert_statement(d):
    flds = [
        d['voter_id'],
        d['county_code'],
        d['jurisdiction_code'],
        d['school_code'],
        d['election_code'],
        str(d['election_date']),
        d['election_description'],
        d['absentee_flag'],
        d['ballot']
    ]
    s = '"' + '","'.join(flds) + '"'
    return ("INSERT INTO voter_history "
            "(%s) "
            "VALUES (%s);\n") % (','.join(fldnames), s)


if __name__ == '__main__':
    from models.election import Election

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    elections = Election.get_dict(dao)

    fldnames = [
        'voter_id', 'county_code', 'jurisdiction_code',
        'school_code', 'election_code', 'election_date',
        'election_description', 'absentee_flag', 'ballot'
    ]

    do_it()
    dao.close()
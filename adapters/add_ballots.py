'''
Add ballot selection to voter history. This should be done
after any primary. No need to build new ballot table.
'''

import csv


def execute():
    sql_file = open('ballots.sql', 'w')
    sql_file.write('SELECT "Starting Updates";\n')
    sql_file.write('START TRANSACTION;\n')

    do_party(sql_file, 'Democrats')
    do_party(sql_file, 'Republicans')

    sql_file.close()
    print('Done!')


def do_party(sql_file, party_name):
    csv_file = open('c:/bench/bluestreets/data/michigan/' + party_name + '.csv', 'r')
    rdr = csv.reader(csv_file)
    next(rdr, None)

    clump_cnt = 0
    total_cnt = 0
    mismatch_cnt = 0

    for inrow in rdr:
        if inrow[1] != '81':
            continue
        voter_id = inrow[0]
        party = 'DEM' if inrow[16] == 'D' else 'REP'
        if not is_in_qvf(voter_id):
            mismatch_cnt += 1
            voter_id = get_voter_id(inrow)
            if not voter_id:
                print(inrow[0], inrow[4], inrow[5], inrow[6])
                continue

        if inrow[16] not in ['D', 'R']:
            print("no ballot!")
            continue

        sql_file.write(update_statement(voter_id, party))
        clump_cnt += 1
        total_cnt += 1
        if clump_cnt == 25000:
            sql_file.write('COMMIT;\n')
            sql_file.write('SELECT %s;\n' % str(total_cnt))
            print(str(total_cnt))
            sql_file.write('START TRANSACTION;\n')
            clump_cnt = 0
        # if total_cnt == 12:
        #     break
    csv_file.close()

    sql_file.write('COMMIT;\n')
    sql_file.write('SELECT %s;\n' % str(total_cnt))
    print(str(total_cnt))
    print(str(mismatch_cnt))
    print(party_name + ' complete!')


def is_in_qvf(voter_id):
    sql = ("SELECT * FROM voters "
           "WHERE voter_id=?")
    rec = dao.execute(sql, (voter_id,))
    return rec is not None


def get_voter_id(inrow):
    sql = ("SELECT * FROM voters "
           "WHERE last_name=? "
           "AND last_name=? "
           "AND middle_name=?")
    rec = dao.execute(sql, (inrow[4], inrow[5], inrow[6]))
    if len(rec) > 1:
        print(inrow[0], inrow[4], inrow[5], inrow[6])
    return rec[0]['voter_id'] if rec else ''


def update_statement(voter_id, party):
    return ("UPDATE voter_history "
            "SET ballot='%s' "
            "WHERE voter_id='%s' AND election_code='%s';\n") % (
        party, voter_id, election_id
    )


if __name__ == '__main__':
    from dao.dao import Dao

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    election_id = '31000050'

    execute()
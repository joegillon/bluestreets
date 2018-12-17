import csv


def do_it():
    csv_file = open('c:/bench/bluestreets/data/michigan/Democrats.csv', 'r')
    rdr = csv.reader(csv_file)
    next(rdr, None)
    cnt = 0
    missing = 0

    for inrow in rdr:
        if inrow[1] != '81':
            continue
        cnt += 1
        voter_id = inrow[0]
        if voter_id not in ballots:
            missing += 1

    csv_file.close()
    print(cnt)
    print(missing)


if __name__ == '__main__':
    from dao.dao import Dao

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    sql = ("SELECT voter_id, last_name, first_name, middle_name, address "
           "FROM ballots;")
    rex = dao.execute(sql)
    ballots = {rec['voter_id']: rec for rec in rex}
    do_it()

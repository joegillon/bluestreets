def to_dict():
    return {
        'voter_id': line[0:13].replace('\\', '').strip(),
        'county_code': line[13:15].replace('\\', '').strip(),
        'jurisdiction_code': line[15:20].replace('\\', '').strip(),
        'school_code': line[20:25].replace('\\', '').strip(),
        'election_code': line[25:38].replace('\\', '').strip(),
        'absentee_flag': line[38].replace('\\', '').strip()
    }


def get_election_codes():
    from models.dao import Dao

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    sql = 'SELECT DISTINCT election_code FROM voter_history'
    rex = dao.execute(sql)
    return [rec['election_code'] for rec in rex]


if __name__ == '__main__':
    ec1 = []
    ifile = open('C:/bench/bluestreets/data/michigan/26161_h.lst', 'r')
    for line in ifile:
        d = to_dict()
        if d['election_code'] not in ec1:
            ec1.append(d['election_code'])
    ifile.close()

    ec2 = get_election_codes()

    for ec in ec2:
        if ec not in ec1:
            print(ec)
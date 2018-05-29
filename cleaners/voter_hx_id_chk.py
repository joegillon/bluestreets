def lst_file_ids():
    ifile = open('C:/bench/bluestreets/data/michigan/entire_state_h.lst', 'r')
    missing = []
    for line in ifile:
        d = to_dict(line)
        if d['county_code'] != '81':
            continue
        hx_id = d['voter_id']
        vrec = get_voter_rec(hx_id)
        if not vrec:
            if hx_id not in missing:
                missing.append(hx_id)
    print(str(len(missing)))


def to_dict(line):
    return {
        'voter_id': line[0:13].replace('\\', '').strip(),
        'county_code': line[13:15].replace('\\', '').strip(),
        'jurisdiction_code': line[15:20].replace('\\', '').strip(),
        'school_code': line[20:25].replace('\\', '').strip(),
        'election_code': line[25:38].replace('\\', '').strip(),
        'absentee_flag': line[38].replace('\\', '').strip()
    }


def get_hx_ids():
    sql = "SELECT voter_id FROM voter_history"
    return dao.execute(sql)


def compare():
    missing = []
    for hx_id_rec in hx_ids:
        hx_id = hx_id_rec['voter_id']
        vrec = get_voter_rec(hx_id)
        if not vrec:
            if hx_id not in missing:
                missing.append(hx_id)
    print(str(len(missing)))


def get_voter_rec(vid):
    sql = "SELECT voter_id FROM voters WHERE voter_id=?"
    rex = dao.execute(sql, (vid,))
    return rex[0] if rex else None


if __name__ == '__main__':
    from models.dao import Dao

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    hx_ids = get_hx_ids()
    # compare()
    lst_file_ids()

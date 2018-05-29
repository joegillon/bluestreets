def get_voter_ids():
    ifile = open('C:/bench/bluestreets/data/michigan/26161_v.lst', 'r')
    ids = []
    for line in ifile:
        d = to_vdict(line)
        ids.append(d['voter_id'])
    ifile.close()
    print(str(len(ids)))
    return ids


def to_vdict(line):
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


def get_hx_ids():
    ifile = open('C:/bench/bluestreets/data/michigan/26161_h.lst', 'r')
    ids = []
    for line in ifile:
        d = to_hdict(line)
        ids.append(d['voter_id'])
    ifile.close()
    print(str(len(ids)))
    return ids


def to_hdict(line):
    return {
        'voter_id': line[0:13].replace('\\', '').strip(),
        'county_code': line[13:15].replace('\\', '').strip(),
        'jurisdiction_code': line[15:20].replace('\\', '').strip(),
        'school_code': line[20:25].replace('\\', '').strip(),
        'election_code': line[25:38].replace('\\', '').strip(),
        'absentee_flag': line[38].replace('\\', '').strip()
    }


def compare():
    missing = set()
    for hid in hids:
        if hid not in vids:
            missing.add(hid)
    print(str(len(missing)))

if __name__ == '__main__':
    vids = sorted(get_voter_ids())
    hids = get_hx_ids()
    compare()

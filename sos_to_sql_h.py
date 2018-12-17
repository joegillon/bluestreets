def do_it():
    ifile = open('C:/bench/bluestreets/data/michigan/entire_state_h.lst', 'r')
    ofile = open('hx.sql', 'w')
    cnt = 0
    for line in ifile:
        county = line[13:15]
        if county != '81':
            continue
        vals = parse_line(line)
        sql = to_insert_statement(vals)
        ofile.write(sql + '\n')
        cnt += 1
        if cnt == 200:
            break
    ifile.close()
    ofile.close()
    print(cnt)


def parse_line(line):
    return [
        line[0:13].strip(),
        line[13:15],
        line[15:20],
        line[20:25],
        line[25:38],
        '"' + line[38] + '"'
    ]


def to_insert_statement(values):
    cols = [
        'voter_id', 'county_code', 'jurisdiction', 'school_code',
        'election_code', 'absentee_voter_indicator'
    ]
    s = "INSERT INTO voter_history (%s) VALUES (%s);" % (','.join(cols), ','.join(values))
    return s


if __name__ == '__main__':
    do_it()

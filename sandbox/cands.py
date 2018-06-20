import csv


def do_it():
    infile = open('c:/bench/bluestreets/data/candidates.csv', 'r')
    rdr = csv.reader(infile, delimiter='\t')

    outfile = open('c:/bench/bluestreets/data/cands.csv', 'w', newline='')
    wtr = csv.writer(outfile, delimiter=',', quotechar='"')
    wtr.writerow([
        'Party', 'Candidate', 'Office', 'District', 'Partial Term', 'Address',
        'File Date', 'File Method', 'Withdrawn'
    ])

    cnt = 0
    district = ''
    office = ''
    partial = ''
    for row in rdr:
        if is_skip_line(row[0]):
            continue
        if row[2].startswith('Partial'):
            row[2] = ''
        if is_hdr_line(row[0]):
            district = extract_numeric(row[0].split()[0])
            office = extract_office(row[0])
            partial = extract_partial_term(row[0])
            continue

        party = row[0]
        candidate = row[1]
        office = row[2] if row[2] else office
        district = row[3] if row[3] else district
        address = row[4].replace(chr(160), ' ')
        file_date = row[5]
        file_method = row[6].replace(chr(160), ' ')
        withdrawn = extract_withdrawn(row[1])
        if withdrawn:
            candidate = ', '.join(candidate.split()[0:2])
        wtr.writerow([
            party, candidate, office, district, partial,
            address, file_date, file_method, withdrawn
        ])
        # cnt += 1
        # if cnt == 100:
        #     break


def is_skip_line(fld1):
    return fld1 == ''


def is_hdr_line(fld1):
    return fld1[0].isdigit()


def extract_numeric(s):
    return ''.join([x for x in s if x.isnumeric()])


def extract_office(s):
    if 'Representative in Congress' in s:
        return 'US House'
    if 'State Senator' in s:
        return 'State Senate'
    if 'Representative in State' in s:
        return 'State House'


def extract_partial_term(s):
    return 'Partial Term' if 'Partial Term' in s else ''


def extract_withdrawn(s):
    return 'Withdrawn' if 'Withdrawn' in s or 'Disqualified' in s else ''


if __name__== '__main__':

    parties = [
        'Democratic', 'Republican', 'Libertarian'
    ]

    do_it()

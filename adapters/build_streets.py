import csv
from models.address import street_abbrs


flds = [
    'index_id', 'street_name_meta', 'block_low', 'block_high',
    'house_num_low', 'house_num_high', 'odd_even',
    'pre_direction', 'street_name', 'street_type', 'suf_direction',
    'ext_low', 'ext_high', 'city', 'zipcode', 'county_code',
    'jurisdiction_code', 'ward', 'precinct', 'village_code',
    'school_code', 'state_house', 'state_senate', 'congress',
    'county_commissioner', 'village_precinct', 'school_precinct'
]


def execute():
    csv_file = open('C:/bench/bluestreets/data/michigan/StreetIndex.csv', 'r')
    rdr = csv.reader(csv_file)

    # first row contains field names - skip it
    next(rdr, None)

    sql_file = open('C:/bench/bluestreets/data/streets.sql', 'w')
    sql_file.write('SELECT "Starting Inserts";\n')
    sql_file.write('BEGIN TRANSACTION;\n')

    clump_cnt = 0
    total_cnt = 0

    for inrow in rdr:
        # Skip rex with no street name!
        if not inrow[15]:
            continue
        sql_file.write(insert_statement(inrow))
        clump_cnt += 1
        total_cnt += 1
        if clump_cnt == 10000:
            sql_file.write('COMMIT;\n')
            sql_file.write('SELECT %s;\n' % str(total_cnt))
            print(str(total_cnt))
            sql_file.write('BEGIN TRANSACTION;\n')
            clump_cnt = 0
        # if total_cnt == 12:
        #     break

    sql_file.write('COMMIT;\n')
    sql_file.write('SELECT %s;\n' % str(total_cnt))
    print(str(total_cnt))
    print('Inserts complete!')

    csv_file.close()
    sql_file.close()
    print('Done!')


def insert_statement(inrow):
    from models.address import Address

    street_meta = Address.get_street_meta(inrow[15])
    block_low, block_high = get_block_params(inrow[11], inrow[12])

    vals = [
        inrow[0],
        '"' + street_meta + '"',
        str(block_low) if block_low else '0',
        str(block_high) if block_high else '0',
        inrow[11] if inrow[11] else '0',
        inrow[12] if inrow[11] else '0',
        '"' + inrow[13] + '"',
        '"' + inrow[14] + '"',
        '"' + inrow[15] + '"',
        '"' + inrow[17] + '"',
        '"' + inrow[16] + '"',
        '"' + inrow[18] + '"',
        '"' + inrow[19] + '"',
        '""',
        '"' + inrow[20] + '"',
        '"' + inrow[1] + '"',
        '"' + inrow[2] + '"',
        '"' + inrow[3][0:2] + '"',
        '"' + inrow[3][2:] + '"',
        '"' + inrow[4] + '"',
        '"' + inrow[5] + '"',
        '"' + inrow[6] + '"',
        '"' + inrow[7] + '"',
        '"' + inrow[8] + '"',
        '"' + inrow[9] + '"',
        '"' + inrow[21] + '"',
        '"' + inrow[22] + '"'
    ]
    return ("INSERT INTO streets "
            "(%s) "
           "VALUES (%s);\n") % (
        ','.join(flds), ','.join(vals))


def get_block_params(housenumlo, housenumhi):
    if not housenumlo:
        return None, None
    x = int(int(housenumlo) / 100) * 100
    y = int(int(housenumhi) / 100) * 100 + 99
    return x, y


if __name__ == '__main__':
    execute()

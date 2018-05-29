import csv


flds = ['code', 'fips', 'name']


def execute():
    csv_file = open('C:/bench/bluestreets/data/michigan/Counties.csv', 'r')
    rdr = csv.reader(csv_file)

    # first row contains field names - skip it
    next(rdr, None)

    # second row is not a county - skip it
    next(rdr, None)

    sql_file = open('C:/bench/bluestreets/data/counties.sql', 'w')
    sql_file.write('SELECT "Starting Inserts";\n')
    sql_file.write('BEGIN TRANSACTION;\n')

    for inrow in rdr:
        sql_file.write(insert_statement(inrow))

    sql_file.write('COMMIT;\n')
    print('Inserts complete!')

    csv_file.close()
    sql_file.close()
    print('Done!')


def insert_statement(inrow):
    vals = [
        '"' + inrow[1] + '"',
        '"' + inrow[2] + '"',
        '"' + inrow[3] + '"',
    ]
    return ("INSERT INTO counties "
            "(%s) "
            "VALUES (%s);\n") % (
        ','.join(flds), ','.join(vals))


if __name__ == '__main__':
    execute()

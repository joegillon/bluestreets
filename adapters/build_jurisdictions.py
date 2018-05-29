import csv


def execute():
    csv_file = open('C:/bench/bluestreets/data/voters/FOIA/Michigan/Juris.csv', 'r')
    rdr = csv.reader(csv_file)
    next(rdr, None)  # skip first row

    sql_file = open('jurisdictions.sql', 'w')
    sql_file.write('USE michigan;\n')
    sql_file.write('SET autocommit=0;\n')
    sql_file.write('SELECT "Starting Inserts";\n')
    sql_file.write('START TRANSACTION;\n')

    for row in rdr:
        sql_file.write(insert_statement(row))

    sql_file.write('COMMIT;\n')
    csv_file.close()
    sql_file.close()
    print('Done!')


def insert_statement(row):
    vals = [
        row[1], row[2], row[3]
    ]
    return ("INSERT INTO jurisdictions (%s) "
            "VALUES (%s);\n") % (
        ','.join(fldnames), '"' + '","'.join(vals) + '"'
    )

if __name__ == '__main__':
    fldnames = ['jurisdiction_code', 'county_code', 'name']
    execute()
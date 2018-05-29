from models.mysql_dao import MySqlDao
from models.location import Location


def do_it():
    counties = get_counties()
    jurisdictions = get_jurisdictions()
    rex = get_rex()

    sql_file = open('precincts.sql', 'w')
    sql_file.write('USE michigan;\n')
    sql_file.write('SET autocommit=0;\n')
    sql_file.write('SELECT "Starting Inserts";\n')
    sql_file.write('START TRANSACTION;\n')

    for rec in rex:
        vals = [
            rec['county_code'],
            counties[rec['county_code']],
            rec['jurisdiction_code'],
            jurisdictions[rec['jurisdiction_code']],
            rec['ward'],
            rec['precinct'],
            rec['state_house'],
            rec['state_senate'],
            rec['congress'],
            rec['county_commissioner']
        ]
        s = ("INSERT INTO precincts "
             "(%s) "
             "VALUES (%s);") % (
            ','.join(fldnames), '"' + '","'.join(vals) + '"'
        )
        sql_file.write(s + '\n')

    sql_file.write('COMMIT;\n')
    sql_file.close()
    print('Done!')


def get_counties():
    rex = Location.get_counties(MySqlDao())
    return {rec['county_code']: rec['name'] for rec in rex}


def get_jurisdictions():
    rex = Location.get_jurisdictions(MySqlDao())
    return {rec['jurisdiction_code']: rec['name'] for rec in rex}


def get_rex():
    sql = ("SELECT county_code, jurisdiction_code, ward, precinct, "
           "state_house, state_senate, congress, county_commissioner "
           "FROM streets "
           "GROUP BY county_code, jurisdiction_code, ward, precinct;")
    dao = MySqlDao()
    return dao.execute(sql)


if __name__ == '__main__':

    fldnames = [
        "county_code", "county_name",
        "jurisdiction_code", "jurisdiction_name",
        "ward", "precinct", "state_house", "state_senate",
        "congress", "county_commissioner"
    ]
    do_it()
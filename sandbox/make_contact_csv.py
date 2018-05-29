'''
Make a CSV of contacts
'''

import csv
from models.address import Address


def do_it():
    data = get_data()
    out = open('contact_list.csv', 'w', newline='')
    wrt = csv.writer(out)
    row = [
        'Jurisdiction', 'Ward', 'Pct',
        'Last Name', 'First Name',
        'Address', 'City', 'Zip',
        'Email', 'Phone'
    ]
    wrt.writerow(row)
    for rec in data:
        row = [
            rec['jurisdiction_name'],
            rec['ward'],
            rec['precinct'],
            rec['last_name'],
            rec['nickname'],
            str(Address(rec)),
            rec['city'],
            rec['zipcode'],
            rec['email'],
            rec['phone1']
        ]
        wrt.writerow(row)
    out.close()


def get_data():
    sql = ("SELECT p.jurisdiction_name, p.ward, p.precinct, c.* "
           "FROM contacts AS c "
           "JOIN precincts AS p ON c.precinct_id=p.id "
           "ORDER BY p.jurisdiction_name, p.ward, p.precinct, "
           "c.last_name, c.nickname;")
    return dao.execute(sql)


if __name__ == '__main__':
    from models.precinct import Precinct
    from models.dao import Dao

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    precincts = Precinct.get_by_jwp(dao)
    do_it()
    dao.close()

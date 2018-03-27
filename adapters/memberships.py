import csv
from models.precinct import Precinct
from utils.utils import Utils
from models.group import Group
from models.contact import Contact

def execute():
    precincts = Precinct.get_all(dao)
    precinct_dict = Utils.to_dict(precincts)
    groups = Group.get_all(dao)
    for group in groups:
        contacts = Contact.get_by_group(dao, group.id)
        if not contacts:
            continue
        csv_file = open(group.code + '.csv', "w", newline='')
        wrt = csv.writer(csv_file)
        wrt.writerow(first_row)
        for contact in contacts:
            row = [
                str(contact.name),
                contact.info.email,
                contact.info.phone1,
                contact.info.phone2,
                str(contact.address),
                contact.address.city,
                contact.address.zipcode,
                precinct_dict[contact.precinct_id].jurisdiction_name,
                precinct_dict[contact.precinct_id].ward,
                precinct_dict[contact.precinct_id].precinct,
                contact.gender,
                contact.birth_year
            ]
            wrt.writerow(row)
        csv_file.close()


if __name__ == '__main__':
    from models.dao import Dao

    first_row = [
        'Name', 'Email', 'Phone 1', 'Phone 2',
        'Address', 'City', 'Zip',
        'Jurisdiction', 'Ward', 'Pct',
        'Gender', 'Birth Yr'
    ]
    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    execute()
    dao.close()

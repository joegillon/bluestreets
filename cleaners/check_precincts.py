from models.voter import Voter


def do_it():
    contacts = get_contacts()
    for contact in contacts:
        print(str(contact.name))
        if not contact.voter_id:
            print('\tNo voter ID')
            continue
        voter = get_voter(contact.voter_id)
        if not voter:
            print('\t%d: no voter rec' % contact.voter_id)
            continue
        if contact.precinct_id != voter.address.precinct_id:
            print('%d: %d' % (
                contact.precinct_id, voter.address.precinct_id)
            )


def get_contacts():
    from models.contact import Contact

    sql = 'SELECT * FROM contacts ORDER BY last_name, first_name, middle_name'
    rex = dao.execute(sql)
    return [Contact(rec) for rec in rex]


def get_voter(voter_id):
    sql = "SELECT * FROM voters WHERE voter_id=?;"
    rex = dao.execute(sql, (voter_id,))
    return Voter(rex[0]) if rex else None

if __name__ == '__main__':
    from models.precinct import Precinct
    from models.dao import Dao

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    precincts = Precinct.get_by_jwp(dao)
    do_it()
    dao.close()

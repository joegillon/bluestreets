def analyze():
    from models.contact import Contact
    from models.voter import Voter

    contacts = Contact.get_all(dao)

    probs = {
        'reg': [], 'name': [], 'vrec': [],
        'addr': [], 'pct': []
    }

    for contact in contacts:
        if not contact.voter_id:
            probs['reg'].append(bld_row(contact))
            continue
        voter = Voter.get_one(dao, contact.voter_id)
        if not voter:
            matches = Voter.get_by_name(dao, contact.name)
            if len(matches) == 1:
                show('No voter registration:', contact, matches[0])
                reply = input('Copy voter?').upper()
                if reply == 'Y':
                    repair(contact, matches[0])
                else:
                    probs['vrec'].append(bld_row(contact))
                    for match in matches:
                        probs['vrec'].append(bld_row(match))
            continue
        if str(contact.name) != str(voter.name):
            show('Name mismatch:', contact, voter)
            reply = input('Copy voter?').upper()
            if reply == 'Y':
                repair(contact, voter)
            else:
                probs['name'].append((bld_row(contact), bld_row(voter)))
            continue
        if str(contact.address) != str(voter.address):
            show('Address mismatch:', contact, voter)
            reply = input('Copy voter?').upper()
            if reply == 'Y':
                repair(contact, voter)
            else:
                probs['addr'].append((bld_row(contact), bld_row(voter)))
            continue
        if contact.address.precinct_id != voter.address.precinct_id:
            show('Precinct mismatch:', contact, voter)
            reply = input('Copy voter?').upper()
            if reply == 'Y':
                repair(contact, voter)
            else:
                probs['pct'].append((bld_row(contact), bld_row(voter)))
    return probs


def bld_row(obj):
    return[
        obj.id if obj.id else '',
        str(obj.name),
        str(obj.address),
        obj.address.city,
        obj.address.zipcode,
        obj.address.precinct_id,
        obj.voter_id
    ]


def show(prob, contact, voter):
    print(prob)
    tbl.clear_rows()
    tbl.add_row(bld_row(contact))
    tbl.add_row(bld_row(voter))
    print(tbl)


def repair(contact, voter):
    contact.copy_voter(voter)
    contact.update(dao)


def report():
    print('No voter registration:')
    tbl.clear_rows()
    for problem in problems['reg']:
        tbl.add_row(problem)
    print(tbl)

    print('\nNo voter record:')
    tbl.clear_rows()
    for problem in problems['vrec']:
        tbl.add_row(problem)
    print(tbl)

    print('\nName mismatch:')
    tbl.clear_rows()
    for problem in problems['name']:
        tbl.add_row(problem[0])
        tbl.add_row(problem[1])
    print(tbl)

    print('\nAddress mismatch:')
    tbl.clear_rows()
    for problem in problems['addr']:
        tbl.add_row(problem[0])
        tbl.add_row(problem[1])
    print(tbl)

    print('\nPct mismatch:')
    tbl.clear_rows()
    for problem in problems['pct']:
        tbl.add_row(problem[0])
        tbl.add_row(problem[1])
    print(tbl)


if __name__ == '__main__':
    from prettytable import PrettyTable
    from dao.dao import Dao

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)

    tbl = PrettyTable()
    tbl.field_names = [
        'id', 'name', 'address', 'city', 'zip', 'pct', 'voter ID'
    ]
    for fn in tbl.field_names:
        tbl.align[fn] = 'l'

    problems = analyze()
    report()


from models.election import Election


def execute():
    state_file = open('C:/bench/bluestreets/data/voters/FOIA/Michigan/Documents/electionscd.lst', 'r')
    for line in state_file.readlines():
        id = line[0:13]
        date = toMySqlDate(line[13:21])
        description = line[21:]
        print('%s %s %s' % (id, date, description))
        election = Election({
            'id': id,
            'date': date,
            'description': description
        })
        election.insert()


def toMySqlDate(d):
    return d[4:] + d[0:2] + d[2:4]


if __name__ == '__main__':
    execute()
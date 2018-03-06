import csv
from models.submission import Submission
from models.address import Address
from models.voter import Voter


def run_test():
    cities = Address.get_cities()
    f = open('voter_test.csv', 'r')
    rdr = csv.reader(f)
    submissions = [Submission.from_csv(row, cities, with_contact=False) for row in rdr]
    lookups = Voter.lookup(submissions)
    for lookup in lookups:
        print(str(lookup.name), str(lookup.address))
        for match in lookup.matches:
            print(str(match), str(match.address))
        print('\n')

if __name__ == '__main__':
    run_test()

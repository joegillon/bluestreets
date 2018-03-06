import statistics
from collections import Counter
from models.dao import Dao
from models.contact import Contact
from models.person_name import PersonName
from fuzzywuzzy import fuzz, process


def run():
    contacts = get_contacts()
    for contact in contacts:
        voter_rex = get_voter_rex(contact)
        if len(voter_rex) > 1:
            target = str(contact.name)
            candidates = []
            for voter_rec in voter_rex:
                candidate_name = voter_rec.last + ', ' + voter_rec.first
                if contact.name.middle:
                    candidate_name += ' ' + voter_rec.middle
                score = fuzz.ratio(target, candidate_name)
                candidates.append((candidate_name, score))
            candidates.sort(key=lambda tup: tup[1], reverse=True)
            scores = [c[1] for c in candidates]
            mean = statistics.mean(scores)
            median = statistics.median(scores)
            try:
                mode = statistics.mode(scores)
            except statistics.StatisticsError:
                mode = 0.0
            std = statistics.stdev(scores)
            print('%s: %1.2f, %1.2f, %1.2f, %1.2f' % (
                target, mean, median, mode, std))
            c = []
            for candidate in candidates:
                sigma = ((candidate[1] - mean) / std) if std > 0 else 0.0
                t = (candidate[0], candidate[1], sigma)
                c.append(t)
                print('\t%s: %d, %1.2f' % (
                    t[0], t[1], t[2]))

            choice = choose(c, mean, median)
            if not choice:
                print("No selection\n")
            else:
                print(choice, '\n')


def choose(candidates, mean, median):
    if mean < median:
        return None
    scores = [candidate[1] for candidate in candidates if candidate[1] > 90]
    if len(scores) > 1:
        return None
    sigmas = [c for c in candidates if c[2] > 0]
    if len(sigmas) == 1:
        return sigmas[0]
    sigmas = [candidate[2] for candidate in candidates if candidate[2] >= 1]
    if not sigmas or len(sigmas) > 1:
        return None
    return [c for c in candidates if c[2] >= 1][0]


def get_voter_rex(c):
    sql = ("SELECT last_name, first_name, middle_name "
           "FROM voters "
           "WHERE last_name_meta=? "
           "AND last_name LIKE ? "
           "AND first_name_meta LIKE ? "
           "AND first_name LIKE ?;")
    vals = (
        c.name.last_meta,
        c.name.last[0] + '%',
        c.name.first_meta + '%',
        c.name.first[0] + '%'
    )
    rex = dao.execute(sql, vals)
    return [PersonName(rec) for rec in rex] if rex else []


def get_contacts():
    sql = ("SELECT last_name, first_name, middle_name "
           "FROM contacts "
           "ORDER by last_name, first_name, middle_name DESC")
    rex = dao.execute(sql)
    return [Contact(rec) for rec in rex] if rex else []

if __name__ == '__main__':
    import sys

    dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
    run()
    dao.close()
    sys.exit()

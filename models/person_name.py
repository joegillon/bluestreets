from utils.match import MatchLib


class PersonName(object):

    chars_to_remove = " '."

    def __init__(self, d=None):
        self.__last = ''
        self.__first = ''
        self.__middle = ''
        self.__suffix = ''
        self.__nickname = ''
        self.__last_meta = ''
        self.__first_meta = ''
        self.__nickname_meta = ''
        if d:
            self.__from_dict(d)

    def __from_dict(self, d):
        if 'last_name' in d:
            self.last = d['last_name']
        if 'first_name' in d:
            self.first = d['first_name']
        if 'middle_name' in d:
            self.middle = d['middle_name']
        if 'name_suffix' in d:
            self.suffix = d['name_suffix']
        if 'nickname' in d:
            self.nickname = d['nickname']

    def __str__(self):
        s = '%s, %s' % (self.last, self.first)
        if self.middle:
            s += ' %s' % self.middle
        if self.suffix:
            s += ', %s' % self.suffix
        return s

    def serialize(self):
        return {
            'last_name': self.last,
            'first_name': self.first,
            'middle_name': self.middle,
            'name_suffix': self.suffix
        }

    @property
    def last(self):
        return self.__last

    @last.setter
    def last(self, value):
        self.__last = self.__clean(value)
        self.__last_meta = MatchLib.get_single(self.__last)

    @property
    def first(self):
        return self.__first

    @first.setter
    def first(self, value):
        self.__first = self.__clean(value)
        self.__first_meta = MatchLib.get_single(self.__first)

    @property
    def middle(self):
        return self.__middle

    @middle.setter
    def middle(self, value):
        self.__middle = self.__clean(value)

    @property
    def suffix(self):
        return self.__suffix

    @suffix.setter
    def suffix(self, value):
        self.__suffix = self.__clean(value)

    @property
    def last_meta(self):
        return self.__last_meta

    @property
    def first_meta(self):
        return self.__first_meta

    @property
    def nickname(self):
        return self.__nickname

    @nickname.setter
    def nickname(self, value):
        self.__nickname = value
        self.__nickname_meta = MatchLib.get_single(value)

    @property
    def nickname_meta(self):
        return self.__nickname_meta

    def __clean(self, value):
        if not value:
            return ''
        return value.strip().translate({ord(c): None for c in self.chars_to_remove}).upper()

    @staticmethod
    def person_by_name_and_address(dao, tbl, addr, pn):
        sql = ("SELECT * FROM %s "
               "WHERE street_name_meta LIKE ? "
               "AND street_name LIKE ? "
               "AND last_name_meta = ? "
               "AND last_name LIKE ? "
               "AND house_number BETWEEN ? AND ?;") % (tbl,)
        vals = (
            addr.metaphone + '%',
            addr.street_name[0] + '%',
            pn.last_meta,
            pn.last[0] + '%',
            addr.block[0],
            addr.block[1]
        )
        return dao.execute(sql, vals)

    @staticmethod
    def person_by_name_only(dao, tbl, pn):
        # import statistics
        # from utils.match import MatchLib

        sql = ("SELECT last_name, first_name, middle_name "
               "FROM %s "
               "WHERE last_name_meta=? "
               "AND last_name LIKE ? "
               "AND first_name_meta LIKE ? "
               "AND first_name LIKE ?;")
        vals = (
            pn.last_meta,
            pn.last[0] + '%',
            pn.first_meta + '%',
            pn.first[0] + '%'
        )
        return dao.execute(sql, vals)

        # if not rex:
        #     return []
        # persons = [PersonName(rec) for rec in rex]
        # if len(persons) == 1:
        #     return persons
        # target = str(pn)
        # candidates = []
        # for person in persons:
        #     candidate_name = '%s, %s' % (person.last, person.first)
        #     if pn.middle:
        #         candidate_name += ' ' + person.middle
        #     score = MatchLib.get_score(target, candidate_name)
        #     candidates.append((candidate_name, score))
        #     candidates.sort(key=lambda tup: tup[1], reverse=True)
        #     scores = [c[1] for c in candidates]
        #     high_scores = [candidate[1] for candidate in candidates if candidate[1] > 90]
        #     if len(high_scores) > 1:
        #         return []
        #     mean = statistics.mean(scores)
        #     median = statistics.median(scores)
        #     if mean < median:
        #         return []
        #     std = statistics.stdev(scores)
        # choices = []
        # for candidate in candidates:
        #     sigma = ((candidate[1] - mean) / std) if std > 0 else 0.0
        #     t = (candidate[0], candidate[1], sigma)
        #     choices.append(t)
        # sigmas = [c for c in choices if c[2] > 0]
        # if len(sigmas) == 1:
        #     return sigmas[0]
        # sigmas = [choice[2] for choice in choices if choice[2] >= 1]
        # if not sigmas or len(sigmas) > 1:
        #     return []
        # return [c for c in choices if c[2] >= 1][0]

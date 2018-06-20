from utils.strlib import StrLib
from models.dao import get_dao


class ContactInfo(object):

    attrs = [
        'email', 'phone1', 'phone2'
    ]

    def __init__(self, d=None):
        self.email = ''
        self.__phone1 = ''
        self.__phone2 = ''
        if d:
            self.__from_dict(d)

    def __from_dict(self, d):
        for attr in self.attrs:
            if attr in d and d[attr]:
                setattr(self, attr, d[attr].strip())

    def serialize(self):
        return self.__dict__

    @property
    def phone1(self):
        return self.__phone1

    @phone1.setter
    def phone1(self, value):
        self.__phone1 = StrLib.extract_numeric(value)

    @property
    def phone2(self):
        return self.__phone2

    @phone2.setter
    def phone2(self, value):
        self.__phone2 = StrLib.extract_numeric(value)

    @staticmethod
    @get_dao
    def get_email_matches(dao, email, threshold):
        sql = ("SELECT * FROM contacts "
               "WHERE email LIKE ?")
        vals = (email[0] + '%',)
        rex = dao.execute(sql, vals)
        if not rex:
            return []
        candidates = {rec['id']: rec['email'] for rec in rex}
        choices = ContactInfo.choose_email(candidates.values(), email, threshold)
        if not choices:
            return[]
        result = []
        for choice in choices:
            for rec in rex:
                if rec['email'] == choice:
                    result.append(rec)
        return result

    @staticmethod
    def choose_email(candidates, target, threshold):
        from utils.match import MatchLib

        target = target.split('@')
        emails = [c.split('@') for c in candidates]
        best_domain = MatchLib.get_best_match(target[1], set([email[1] for email in emails]))[0]
        usernames = [email[0] for email in emails if email[1] in [target[1], best_domain]]
        matches = MatchLib.get_best_matches(target[0], usernames, threshold)
        return [match[0] + '@' + best_domain for match in matches] if matches else []

    @staticmethod
    def get_exact_phone_matches(dao, target):
        sql = ("SELECT * FROM contacts "
               "WHERE ? IN (phone1, phone2);")
        return dao.execute(sql, (target,))


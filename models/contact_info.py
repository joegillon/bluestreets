from utils.strlib import StrLib


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

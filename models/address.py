from models.dao import Dao
from utils.strlib import StrLib
from utils.utils import Utils


class Address(object):

    def __init__(self, d=None):
        self.__pre_direction = ''
        self.__house_number = ''
        self.__street_name = ''
        self.__street_type = ''
        self.__suf_direction = ''
        self.__odd_even_x = ''
        self.__unit = ''
        self.__city = ''
        self.zipcode = ''
        self.__metaphone = ''
        self.__block_x = None
        self.precinct_id = None
        if d:
            if 'address' in d:
                self.__parse(d['address'])
            for prop in [attr.replace('_Address__', '') for attr in self.__dict__]:
                if prop in d and not prop.endswith('_x'):
                    setattr(self, prop, d[prop])

    def __str__(self):
        s = str(self.house_number)
        if self.pre_direction:
            s += ' %s' % self.pre_direction
        s += ' %s' % self.street_name
        if self.street_type:
            s += ' %s' % self.street_type
        if self.suf_direction:
            s += ' %s' % self.suf_direction
        if self.unit:
            s += ' Unit %d' % self.unit
        return s

    def serialize(self):
        return {
            'house_number': self.house_number,
            'pre_direction': self.pre_direction,
            'street_name': self.street_name,
            'street_type': self.street_type,
            'suf_direction': self.suf_direction,
            'unit': self.unit,
            'city': self.city,
            'zip': self.zipcode,
            'precinct_id': self.precinct_id
        }

    @property
    def house_number(self):
        return self.__house_number

    @house_number.setter
    def house_number(self, value):
        self.__house_number = value
        if value:
            self.__set_odd_even()
            self.__set_block()

    @property
    def odd_even(self):
        return self.__odd_even_x

    @property
    def street_name(self):
        return self.__street_name

    @street_name.setter
    def street_name(self, value):
        self.__street_name = value.upper()
        self.__set_metaphone()

    @property
    def street_type(self):
        return self.__street_type

    @street_type.setter
    def street_type(self, value):
        self.__street_type = value.upper()
        self.__set_metaphone()

    def __set_street(self):
        self.__street = self.street_name
        if self.street_type:
            st = self.street_type
            if st in street_abbrs:
                st = street_abbrs[st]
            self.__street += ' ' + st

    @property
    def pre_direction(self):
        return self.__pre_direction

    @pre_direction.setter
    def pre_direction(self, value):
        if value in self.__directional_mappings.keys():
            value = self.__directional_mappings[value]
        self.__pre_direction = value

    @property
    def suf_direction(self):
        return self.__suf_direction

    @suf_direction.setter
    def suf_direction(self, value):
        if value in self.__directional_mappings.keys():
            value = self.__directional_mappings[value]
        self.__suf_direction = value

    @property
    def unit(self):
        return self.__unit

    @unit.setter
    def unit(self, val):
        if not val:
            return ''
        self.__unit = StrLib.extract_numeric(val)
        self.__unit = int(self.__unit) if self.__unit else ''

    @property
    def city(self):
        return self.__city

    @city.setter
    def city(self, value):
        self.__city = value.upper()

    @property
    def metaphone(self):
        return self.__metaphone

    @property
    def block(self):
        return self.__block_x

    def __parse(self, s):
        from usaddress import tag

        try:
            # Note that we replace . with space
            addr = tag(s.replace('.', ' ').upper())[0]
        except Exception:
            raise Exception('Unable to parse address %s' % (s,))

        if 'StreetName' not in addr:
            return

        self.street_name = addr['StreetName'].replace(' ', '')

        if 'AddressNumber' in addr:
            self.house_number = StrLib.extract_numeric(addr['AddressNumber'])
            if not self.house_number.isnumeric():
                self.street_name = '%s %s' % (addr['AddressNumber'], self.street_name)
                self.house_number = ''

        if 'StreetNamePreType' in addr:
            self.street_name = '%s%s' % (addr['StreetNamePreType'], self.street_name)
        if 'StreetNamePreDirectional' in addr:
            self.pre_direction = addr['StreetNamePreDirectional'].replace('.', '')
            if self.pre_direction not in self.__directions:
                self.street_name = '%s %s' % (self.pre_direction, self.street_name)
                self.pre_direction = ''
        if 'StreetNamePostType' in addr:
            self.street_type = addr['StreetNamePostType'].replace('.', '')
            if self.street_type not in street_abbrs and \
                    self.street_type not in street_abbrs.values():
                self.street_name = '%s%s' % (self.street_name, self.street_type)
                self.street_type = ''
        if 'StreetNamePostDirectional' in addr:
            self.suf_direction = addr['StreetNamePostDirectional'].replace('.', '')
            if self.suf_direction not in self.__directions:
                self.street_name = '%s %s' % (self.street_name, self.suf_direction)
                self.suf_direction = None
        if 'OccupancyIdentifier' in addr:
            self.unit = addr['OccupancyIdentifier']
        self.__set_metaphone()

    def __set_odd_even(self):
        self.__odd_even_x = 'E' if int(self.house_number) % 2 == 0 else 'O'

    @staticmethod
    def get_street_meta(street_name, street_type=None):
        from utils.match import MatchLib

        street = street_name.upper().strip()
        if street in ordinal_streets:
            street = ordinal_streets[street]

        n = ''
        for c in list(street):
            if c.isnumeric():
                n += Address.__digit_mappings[c]
            else:
                n += c
        if n:
            street = n

        if street_type:
            st = street_type
            if st in street_abbrs:
                st = street_abbrs[st]
            street += ' ' + st
        return MatchLib.get_single(street)

    def __set_metaphone(self):
        self.__metaphone = Address.get_street_meta(self.street_name)

    def __set_block(self):
        if type(self.house_number) == int:
            n = self.house_number
        else:
            n = StrLib.extract_numeric(self.house_number)
            if not n.isnumeric():
                return '', ''
        x = int((int(n) / 100)) * 100
        y = x + 99
        self.__block_x = (x, y)

    @staticmethod
    def get_cities():
        dao = Dao()
        sql = "SELECT * FROM cities;"
        return dao.execute(sql)

    @staticmethod
    def get_city_names(dao=None):
        if not dao:
            dao = Dao()
        sql = "SELECT DISTINCT(name) FROM cities;"
        rex = dao.execute(sql)
        return [rec['name'] for rec in rex] if rex else []

    @staticmethod
    def get_turf(dao, addr):
        sql = ("SELECT * FROM streets "
               "WHERE street_name_meta LIKE ? "
               "AND street_name LIKE ? "
               "AND ? BETWEEN block_low AND block_high "
               "AND odd_even IN (?, ?) ")
        vals = [
            addr.metaphone + '%',
            addr.street_name[0] + '%',
            addr.house_number,
            "B", addr.odd_even
        ]

        if addr.pre_direction:
            sql += "AND pre_direction=? "
            vals.append(addr.pre_direction)
        if addr.suf_direction:
            sql += "AND suf_direction=? "
            vals.append(addr.suf_direction)

        if addr.zipcode:
            sql += "AND zipcode LIKE ? "
            vals.append(addr.zipcode[0:-1] + '%')
        elif addr.city:
            sql += "AND city=? "
            vals.append(addr.city)

        return dao.execute(sql, vals)

    __directions = [
        'N', 'NE', 'NW',
        'S', 'SE', 'SW',
        'E', 'W'
    ]

    __directional_mappings = {
        'NORTH': 'N',
        'NORTHEAST': 'NE',
        'NORTHWEST': 'NW',
        'SOUTH': 'S',
        'SOUTHEAST': 'SE',
        'SOUTHWEST': 'SW',
        'EAST': 'E',
        'WEST': 'W'
    }

    __digit_mappings = {
        '0': 'ZERO',
        '1': 'ONE',
        '2': 'TWO',
        '3': 'THREE',
        '4': 'FOUR',
        '5': 'FIVE',
        '6': 'SIX',
        '7': 'SEVEN',
        '8': 'EIGHT',
        '9': 'NINE'
    }


street_abbrs = {
    'AV': 'AVENUE',
    'AVE': 'AVENUE',
    'BCH': 'BEACH',
    'BLF': 'BLUFF',
    'BLVD': 'BOULEVARD',
    'BND': 'BEND',
    'CIR': 'CIRCLE',
    'CRES': 'CRESCENT',
    'CT': 'COURT',
    'CV': 'COVE',
    'DR': 'DRIVE',
    'GLN': 'GLEN',
    'HL': 'HILL',
    'HOLW': 'HOLLOW',
    'HTS': 'HEIGHTS',
    'HWY': 'HIGHWAY',
    'LN': 'LANE',
    'LNDG': 'LANDING',
    'PKWY': 'PARKWAY',
    'PKY': 'PARKWAY',
    'PL': 'PLACE',
    'PT': 'POINT',
    'RD': 'ROAD',
    'RDG': 'RIDGE',
    'SQ': 'SQUARE',
    'ST': 'STREET',
    'TER': 'TERRACE',
    'TERR': 'TERRACE',
    'TRCE': 'TRACE',
    'TRL': 'TRAIL',
    'VW': 'VIEW',
    'WAY': 'WAY',
    'XING': 'CROSSING'
}

ordinal_streets = {
    'FIRST': '1ST', 'SECOND': '2ND', 'THIRD': '3RD',
    'FOURTH': '4TH', 'FIFTH': '5TH', 'SIXTH': '6TH',
    'SEVENTH': '7TH', 'EIGHTH': '8TH', 'NINTH': '9TH',
    'TENTH': '10TH', 'ELEVENTH': '11TH', 'TWELFTH': '12TH'
}
from models.mysql_dao import MySqlDao


class StreetIndex(object):

    def __init__(self, d=None):
        self.county = None
        self.jurisdiction = None
        self.ward_precinct = None
        self.village = None
        self.school_district = None
        self.state_house = None
        self.state_senate = None
        self.congress = None
        self.county_commissioner = None
        self.house_num_low = None
        self.house_num_high = None
        self.odd_even = None
        self.pre_direction = None
        self.street_name = None
        self.street_type = ''
        self.suf_direction = None
        self.extension_low = None
        self.extension_high = None
        self.zipcode = None
        self.village_precinct = None
        self.school_precinct = None
        self.street_name_meta = None
        if d:
            self._from_dict(d)

    def _from_dict(self, d):
        if 'DLCOUNTYCO' in d:
            self.county = d['DLCOUNTYCO']
        if 'JURISDCODE' in d:
            self.jurisdiction = d['JURISDCODE']
        if 'WARDPRECIN' in d:
            self.ward_precinct = d['WARDPRECIN']
        if 'VILLAGECOD' in d:
            self.village = d['VILLAGECOD']
        if 'SCHOOLDCOD' in d:
            self.school_district = d['SCHOOLDCOD']
        if 'STATEHOUSE' in d:
            self.state_house = d['STATEHOUSE']
        if 'STATESENAT' in d:
            self.state_senate = d['STATESENAT']
        if 'USCONGRESS' in d:
            self.congress = d['USCONGRESS']
        if 'COUNTYCOMD' in d:
            self.county_commissioner = d['COUNTYCOMD']
        if 'HOUSENUMLO' in d:
            self.house_num_low = d['HOUSENUMLO']
        if 'HOUSENUMHI' in d:
            self.house_num_high = d['HOUSENUMHI']
        if 'ODDEVENFLA' in d:
            self.odd_even = d['ODDEVENFLA']
        if 'PREDIRECTI' in d:
            self.pre_direction = d['PREDIRECTI']
        if 'STREETNAME' in d:
            self.street_name = d['STREETNAME']
        if 'STREETTYPE' in d and d['STREETTYPE'] is not None:
            self.street_type = d['STREETTYPE']
        if 'SUFDIRECTI' in d:
            self.suf_direction = d['SUFDIRECTI']
        if 'EXTLOW' in d:
            self.extension_low = d['EXTLOW']
        if 'EXTHIGH' in d:
            self.extension_high = d['EXTHIGH']
        if 'ZIPCODE' in d:
            self.zipcode = d['ZIPCODE']
        if 'VILLAGEPRE' in d:
            self.village_precinct = d['VILLAGEPRE']
        if 'SCHOOLPRE' in d:
            self.school_precinct = d['SCHOOLPRE']
        if 'street_name_meta' in d:
            self.street_name_meta = d['street_name_meta']

    def __str__(self):
        return '%s: %s: %s' % (self.zipcode, self.jurisdiction, self.ward_precinct)

    @staticmethod
    def get_by_address(addr):
        if not addr.metaphone:
            return False
        sql = ("SELECT * "
               "FROM streets "
               "WHERE street_name_meta LIKE %s "
               "AND street_name LIKE %s "
               "AND block_low >= %s "
               "AND block_high <= %s;")
        vals = (
            addr.metaphone + '%',
            addr.street[0] + '%',
            addr.block[0],
            addr.block[1]
        )
        dao = MySqlDao()
        return dao.execute(sql, vals)

    @staticmethod
    def get_by_address2(addr):
        if not addr.metaphone:
            return False
        sql = ("SELECT * "
               "FROM streets "
               "WHERE street_name_meta LIKE %s "
               "AND street_name LIKE %s "
               "AND block_low <= %s "
               "AND block_high >= %s "
               "AND odd_even = %s;")
        vals = (
            addr.metaphone + '%',
            addr.street[0] + '%',
            addr.house_number,
            addr.house_number,
            addr.odd_even
        )
        dao = MySqlDao()
        return dao.execute(sql, vals)

    @staticmethod
    def is_valid_address(addr):
        from utils.match import MatchLib

        rex = StreetIndex.get_by_address(addr)
        if not rex:
            return False
        streets = [rec['street_name'] + ' ' + expanded_street_type(rec['street_type']) for rec in rex]
        best_match = MatchLib.get_best_partial(addr.street, streets, 90)
        return True if best_match else False


def expanded_street_type(s):
    from models.address import street_abbrs

    if s in street_abbrs:
        return street_abbrs[s]
    return s

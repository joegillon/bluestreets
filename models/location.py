class Location(object):

    def __init__(self, d=None):
        self.county_code = ''
        self.county_name = ''
        self.precinct = None
        self.address = None
        self.city = ''
        self.zipcode = ''

    @staticmethod
    def get_counties(dao):
        sql = "SELECT * FROM counties;"
        return dao.execute(sql)

    @staticmethod
    def get_jurisdictions(dao):
        sql = "SELECT * FROM jurisdictions;"
        return dao.execute(sql)

    @staticmethod
    def get_precincts(dao, jurisdiction_code=None):
        sql = "SELECT * FROM precincts"
        vals = None
        if jurisdiction_code:
            sql += " WHERE jurisdiction_code=?"
            vals = (jurisdiction_code,)
        sql += ';'
        return dao.execute(sql, vals)

    @staticmethod
    def get_streets(dao, jurisdiction_code, ward, precinct):
        sql = ("SELECT street_name, street_type "
               "FROM streets "
               "WHERE jurisdiction_code=? "
               "AND ward=? "
               "AND precinct=? "
               "GROUP BY street_name, street_type;")
        vals = [jurisdiction_code, ward, precinct]
        return dao.execute(sql, vals)

    @staticmethod
    def get_house_nums(dao, county_code, jurisdiction, street_name, street_type):
        sql = ("SELECT * "
               "FROM streets "
               "WHERE county_code=? "
               "AND jurisdiction_code=? "
               "AND street_name=? "
               "AND street_type=? "
               "GROUP BY house_num_low, house_num_high;")
        vals = [
            county_code, jurisdiction, street_name, street_type
        ]
        return dao.execute(sql, vals)

    @staticmethod
    def get_block(dao, contact):
        sql = ("SELECT * FROM streets "
               "WHERE street_name_meta LIKE ? "
               "AND street_name LIKE ? "
               "AND ? BETWEEN block_low AND block_high "
               "AND odd_even IN (?, ?) ")
        vals = [
            contact.address.metaphone + '%',
            contact.address.street_name[0] + '%',
            contact.address.house_number,
            "B", contact.address.odd_even
        ]

        if contact.address.pre_direction:
            sql += "AND pre_direction=? "
            vals.append(contact.address.pre_direction)
        if contact.address.suf_direction:
            sql += "AND suf_direction=? "
            vals.append(contact.address.suf_direction)

        if contact.zipcode:
            sql += "AND zipcode LIKE ? "
            vals.append(contact.zipcode[0:-1] + '%')
        elif contact.city:
            sql += "AND city=? "
            vals.append(contact.city)
        # elif contact.address.county_code:
        #     sql += "AND county_code=%s "
        #     vals.append(contact.address.county_code)

        return dao.execute(sql, vals)

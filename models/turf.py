from models.dao import get_dao


class Turf(object):

    @staticmethod
    @get_dao
    def get_county_name(dao, county_code):
        sql = "SELECT name FROM counties WHERE code=?"
        return dao.execute(sql, (county_code, ))

    @staticmethod
    @get_dao
    def get_cities(dao):
        sql = "SELECT * FROM cities;"
        return dao.execute(sql)

    @staticmethod
    @get_dao
    def get_city_names(dao):
        sql = "SELECT DISTINCT(name) FROM cities;"
        rex = dao.execute(sql)
        return [rec['name'] for rec in rex] if rex else []

    @staticmethod
    @get_dao
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

    @staticmethod
    @get_dao
    def get_jurisdictions(dao):
        sql = "SELECT * FROM jurisdictions;"
        return dao.execute(sql)

    @staticmethod
    def get_wards(dao, jurisdiction_code):
        sql = ("SELECT DISTINCT(ward) FROM precincts "
               "WHERE jurisdiction_code=?;")
        vals = (jurisdiction_code,)
        return dao.execute(sql, vals)

    @staticmethod
    def get_precincts(dao, jurisdiction_code=None, ward_no=None):
        sql = "SELECT * FROM precincts"
        vals = None
        if jurisdiction_code:
            sql += " WHERE jurisdiction_code=?"
            vals = (jurisdiction_code,)
        if ward_no:
            sql += " AND ward=?"
            vals = (jurisdiction_code, ward_no)
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


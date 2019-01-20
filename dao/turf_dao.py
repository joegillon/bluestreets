def get_precincts(dao, jurisdiction_code=None, ward_no=None):
    sql = "SELECT * FROM precincts "
    vals = None
    if jurisdiction_code:
        sql += " WHERE jurisdiction_code=?"
        vals = (jurisdiction_code,)
    if ward_no:
        sql += " AND ward=?"
        vals = (jurisdiction_code, ward_no)
    sql += 'ORDER BY jurisdiction_name, ward, precinct;'
    return dao.execute(sql, vals)


def get_cities_for_county(dao, county_code):
    sql = ("SELECT * "
           "FROM cities "
           "WHERE zipcode IN "
           "(SELECT DISTINCT(zipcode) "
           "FROM streets "
           "WHERE county_code=?)")
    return dao.execute(sql, (county_code,))


def get_streets_for_zip(dao, zipcode):
    sql = ("SELECT * "
           "FROM streets "
           "WHERE zipcode = ?;")
    return dao.execute(sql, (zipcode,))


def get_streets_for_county(dao, county_code):
    sql = ("SELECT streets.*, jurisdictions.name AS jurisdiction_name "
           "FROM streets "
           "JOIN jurisdictions ON streets.jurisdiction_code=jurisdictions.code "
           "WHERE streets.county_code = ?;")
    return dao.execute(sql, (county_code,))


def street_fuzzy_lookup(dao, d):
    sql = "SELECT * FROM streets " \
          "WHERE county_code=? " \
          "AND street_name_meta LIKE ? " \
          "AND street_name LIKE ? "
    vals = [
        d['county_code'],
        d['meta'] + '%',
        d['street_name'][0] + '%'
    ]
    if 'house_number' in d:
        sql += "AND ?  BETWEEN house_num_low AND house_num_high "
        vals.append(d['house_number'])
    if 'city' in d:
        sql += "AND city=? "
        vals.append(d['city'])
    if 'zipcode' in d:
        sql += "AND zipcode=? "
        vals.append(d['zipcode'])
    return dao.execute(sql, vals)


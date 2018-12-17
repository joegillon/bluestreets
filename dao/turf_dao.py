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

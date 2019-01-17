from models.contact import Contact


def get_all(dao):
    sql = ("SELECT * FROM contacts "
           "ORDER BY last_name, first_name, middle_name")
    return dao.execute(sql)


def add(dao, params):
    sql = "INSERT INTO contacts (%s) VALUES (%s)" % (
        ','.join(Contact.db_cols), dao.get_param_str(Contact.db_cols)
    )
    vals = self.get_values()
    return dao.execute(sql, vals)

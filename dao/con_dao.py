from models.contact import Contact


def get_all(dao):
    sql = ("SELECT * FROM contacts "
           "ORDER BY last_name, first_name, middle_name")
    rex = dao.execute(sql)
    return [Contact(rec) for rec in rex] if rex else []

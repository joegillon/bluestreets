def get_all(dao):
    sql = "SELECT * FROM groups ORDER BY name"
    return dao.execute(sql)


def get_all_members(dao):
    sql = "SELECT * FROM group_members"
    return dao.execute(sql)
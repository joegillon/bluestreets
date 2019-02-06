def add(dao, membership):
    sql = ("INSERT INTO group_members "
           "(group_id, contact_id, role, comment) "
           "VALUES (?,?,?,?);")
    vals = [
        membership['group_id'],
        membership['contact_id'],
        membership['role'],
        membership['comment']
    ]
    return dao.execute(sql, vals)


def update(dao, membership):
    sql = ("UPDATE group_members "
           "SET group_id=?, contact_id=?, role=?, comment=? "
           "WHERE id=?;")
    vals = [
        membership['group_id'],
        membership['contact_id'],
        membership['role'],
        membership['comment'],
        membership['id']
    ]
    return dao.execute(sql, vals)


def drop(dao, membership_id):
    sql = "DELETE FROM group_members WHERE id=?;"
    return dao.execute(sql, (membership_id,))

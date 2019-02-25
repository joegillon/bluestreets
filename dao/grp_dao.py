from dao.dao import get_param_str


def get_all(dao):
    sql = "SELECT id, name, code, description FROM groups ORDER BY name"
    return dao.execute(sql)


def add(dao, group):
    sql = "INSERT INTO groups (%s) VALUES (%s);" % (
        ','.join(group.keys()), get_param_str(group)
    )
    vals = list(group.values())
    return dao.execute(sql, vals)


def update(dao, group):
    grp_id = group['id']
    del group['id']
    sql = ("UPDATE groups "
           "SET %s "
           "WHERE id=?;") % (
        ','.join(f + '=?' for f in group.keys()))
    vals = list(group.values())
    vals.append(grp_id)
    return dao.execute(sql, vals)


def drop(dao, group_id):
    statements = [
        {
            'sql': "DELETE FROM group_members WHERE group_id=?;",
            'vals': (group_id,)
        },
        {
            'sql': "DELETE FROM groups WHERE id=?;",
            'vals': (group_id,)
        }
    ]
    return dao.transaction(statements)

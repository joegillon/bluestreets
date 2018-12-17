from dao.dao import get_dao


class Group(object):

    def __init__(self, d=None):
        self.id = None
        self.name = ''
        self.code = ''
        self.description = ''
        if d:
            self.__from_dict(d)

    def __from_dict(self, d):
        if 'id' in d:
            self.id = d['id']
        self.name = d['name']
        self.code = d['code']
        self.description = d['description']

    def __str__(self):
        return str(self.name)

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'code': self.code,
            'description': self.description
        }

    @staticmethod
    @get_dao
    def get_all(dao):
        sql = "SELECT * FROM groups ORDER BY name;"
        rex = dao.execute(sql)
        return [Group(rec) for rec in rex] if rex else []

    @staticmethod
    def get_all_by_code(dao):
        sql = "SELECT * FROM groups ORDER BY name;"
        rex = dao.execute(sql)
        return {rec['code']: rec for rec in rex}

    @staticmethod
    def add(d):
        del d['id']
        sql = "INSERT INTO groups (%s) VALUES (%s);" % (
            ','.join(d.keys()), '%s' + ',%s' * (len(d) - 1)
        )
        vals = list(d.values())
        dao = MySqlDao()
        return dao.execute(sql, vals)

    @staticmethod
    def update(d):
        grpid = d['id']
        del d['id']
        sql = ("UPDATE groups "
               "SET %s "
               "WHERE id=%s;") % (
            ','.join(f + '=%s' for f in d.keys()), grpid)
        vals = list(d.values())
        dao = MySqlDao()
        dao.execute(sql, vals)

    @staticmethod
    def delete(grpid):
        sql = "DELETE FROM groups WHERE id=%s;" % (grpid,)
        dao = MySqlDao()
        return dao.execute(sql)

    @staticmethod
    def get_members(grpid):
        sql = ("SELECT m.id AS id, m.group_id AS group_id, "
               "m.contact_id AS contact_id, m.role AS role, "
               "g.name AS \"group\", "
               "concat(c.last_name, ', ', c.first_name) AS member "
               "FROM group_members AS m "
               "INNER JOIN groups AS g ON m.group_id=g.id "
               "INNER JOIN contacts AS c ON m.contact_id=c.id "
               "WHERE m.group_id=%s "
               "ORDER BY member;")
        vals = (grpid,)
        dao = MySqlDao()
        return dao.execute(sql, vals)


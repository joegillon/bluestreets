from dao.dao import Dao, get_dao


class GroupMember(object):

    db_cols = ['group_id', 'contact_id', 'role', 'comment']

    def __init__(self, d=None):
        self.id = None
        self.group_id = None
        self.group_name = ''
        self.contact_id = None
        self.contact_name = ''
        self.role = ''
        self.comment = ''
        if d:
            for attr in self.__dict__:
                if attr in d:
                    setattr(self, attr, d[attr])

    def __str__(self):
        return str(self.contact_name)

    def serialize(self):
        return {
            'id': self.id,
            'group_id': self.group_id,
            'contact_id': self.contact_id,
            'role': self.role,
            'comment': self.comment
        }

    def get_values(self):
        return (
            self.group_id, self.contact_id, self.role, self.comment
        )

    @staticmethod
    @get_dao
    def get_code_lists(dao):
        sql = ("SELECT m.*, g.code "
               "FROM group_members AS m "
               "JOIN groups AS g ON m.group_id=g.id;")
        rex = dao.execute(sql)
        memberships = {}
        for rec in rex:
            if rec['contact_id'] not in memberships:
                memberships[rec['contact_id']] = []
            memberships[rec['contact_id']].append(rec['code'])
        return memberships

    @staticmethod
    def get_all_for_contact(conid):
        sql = ("SELECT m.id AS id, m.group_id AS group_id, "
               "m.contact_id AS contact_id, m.role AS role "
               "g.name AS group, c.name AS member "
               "FROM group_members AS m "
               "JOIN groups AS g ON m.group_id=g.id "
               "JOIN contacts AS c ON m.contact_id=c.id "
               "WHERE m.contact_id=%s "
               "ORDER BY c.name;")
        vals = (conid,)
        dao = MySqlDao()
        return dao.execute(sql, vals)

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
    def add_many(data, dao=None):
        members = [GroupMember(d) for d in data]
        values = [member.get_values() for member in members]
        if not dao:
            dao = Dao()
        dao.add_many('group_members', GroupMember.db_cols, values)

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

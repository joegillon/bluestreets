from functools import wraps

from flask import session, abort
from passlib.apps import custom_app_context as pw_ctx

from dao.dao import Dao, get_dao


class User(object):

    @staticmethod
    @get_dao
    def login(dao, username, password):
        sql = "SELECT * FROM users WHERE username=?;"
        vals = (username, )
        rex = dao.execute(sql, vals)
        if not rex or len(rex) != 1:
            raise Exception('Invalid login!')
        if not User.__verify_pw(password, rex[0]['password']):
            raise Exception('Invalid login!')
        return rex[0]

    @staticmethod
    def __hash_pw(pw):
        return pw_ctx.encrypt(pw)

    @staticmethod
    def __verify_pw(pw, pw_hash):
        return pw_ctx.verify(pw, pw_hash)

    @staticmethod
    @get_dao
    def get_users(dao):
        sql = "SELECT * FROM users;"
        return dao.execute(sql)

    @staticmethod
    @get_dao
    def add_user(dao, d):
        sql = ("INSERT INTO users "
               "(username, password, role_id) "
               "VALUES (?,?, ?);")
        vals = (d['username'], User.__hash_pw(d['password']), d['role_id'])
        return dao.execute(sql, vals)

    @staticmethod
    @get_dao
    def update_user(dao, d):
        vals = [d['username'], d['role_id']]
        sql = ("UPDATE users "
               "SET username=?, role_id=?")
        if 'password' in d:
            sql += ", password=?"
            vals.append(User.__hash_pw(d['password']))
        sql += " WHERE id=?;"
        vals.append(d['id'])
        return dao.execute(sql, vals)

    @staticmethod
    @get_dao
    def delete_user(dao, user_id):
        User.delete_precinct_admins_for_user(dao, user_id)
        sql = "DELETE FROM users WHERE id=?;"
        vals = (user_id,)
        return Dao.execute(dao, sql, vals)

    @staticmethod
    def change_password(user_id, new_password):
        sql = ("UPDATE users "
               "SET password=? "
               "WHERE id=?")
        vals = (User.__hash_pw(new_password), user_id)
        return Dao.execute(sql, vals)

    @staticmethod
    def get_roles(dao):
        sql = 'SELECT id, name AS value, description FROM roles;'
        return dao.execute(sql)

    @staticmethod
    def add_role(d):
        sql = ("INSERT INTO roles "
               "(name, description) "
               "VALUES (?,?);")
        vals = (d['name'], d['description'])
        return Dao.execute(sql, vals)

    @staticmethod
    def update_role(d):
        sql = ("UPDATE roles "
               "SET name=?, description=? "
               "WHERE id=?;")
        vals = (d['name'], d['description'], d['id'])
        return Dao.execute(sql, vals)

    @staticmethod
    def delete_role(role_id):
        sql = "DELETE FROM roles WHERE id=?;"
        vals = (role_id,)
        return Dao.execute(sql, vals)

    @staticmethod
    @get_dao
    def get_user_roles(dao):
        sql = ("SELECT ur.user_id, ur.role_id, u.username, r.name "
               "FROM user_roles AS ur "
               "JOIN users AS u ON ur.user_id=u.id "
               "JOIN roles AS r ON ur.role_id=r.id;")
        return dao.execute(sql)

    @staticmethod
    def add_user_role(d):
        sql = ("INSERT INTO user_roles "
               "(user_id, role_id) "
               "VALUES (?,?);")
        vals = (d['user_id'], d['role_id'])
        return Dao.execute(sql, vals)

    @staticmethod
    def delete_user_role(user_role_id):
        sql = "DELETE FROM user_roles WHERE id=?;"
        vals = (user_role_id,)
        return Dao.execute(sql, vals)

    @staticmethod
    @get_dao
    def get_precinct_admins(dao, user_id=None):
        sql = ("SELECT * "
               "FROM precinct_admins")
        vals = []
        if user_id:
            sql += " WHERE user_id=?"
            vals = (user_id,)
        return dao.execute(sql, vals)

    @staticmethod
    @get_dao
    def add_precinct_ids(dao, user_id, precinct_ids):
        return dao.add_many(
            'precinct_admins',
            ['user_id', 'precinct_id'],
            [(user_id, precinct_id) for precinct_id in precinct_ids]
        )

    @staticmethod
    @get_dao
    def delete_precinct_admins_for_user(dao, user_id, precinct_ids=None):
        sql = "DELETE FROM precinct_admins WHERE user_id=?"
        vals = [user_id]
        if precinct_ids:
            sql += " AND precinct_id IN (%s)" % dao.get_param_str(precinct_ids)
            vals = [user_id] + precinct_ids
        return dao.execute(sql, vals)

    @staticmethod
    @get_dao
    def delete_precinct_admins(dao, ids):
        sql = "DELETE FROM precinct_admins WHERE id in (%s);" % dao.get_param_str(ids)
        return dao.execute(sql, ids)


def admin_only(f):
    @wraps(f)
    def admin_view(*args, **kwargs):
        if 'user' not in session or session['user']['name'] != 'sys_admin':
            abort(401)
        return f(*args, **kwargs)
    return admin_view


def login_required(f):
    @wraps(f)
    def requested_view(*args, **kwargs):
        is_authenticated = session['is_authenticated']
        if is_authenticated:
            return f(*args, **kwargs)
        abort(401)
    return requested_view

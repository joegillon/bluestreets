from functools import wraps
from passlib.apps import custom_app_context as pw_ctx
from flask import session, abort
from models.dao import Dao, get_dao


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
               "VALUES (?,?,?);")
        vals = (d['username'], User.__hash_pw(d['password']), d['role_id'])
        return dao.execute(sql, vals)

    @staticmethod
    def update_user(d):
        sql = ("UPDATE users "
               "SET username=?, password=?, role_id=? "
               "WHERE id=?;")
        vals = (d['username'], User.__hash_pw(d['password']), d['role_id'], d['id'])
        return Dao.execute(sql, vals)

    @staticmethod
    def delete_user(user_id):
        sql = "DELETE FROM users WHERE id=?;"
        vals = (user_id,)
        return Dao.execute(sql, vals)

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
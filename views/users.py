from flask import Blueprint, request, jsonify, render_template, session, redirect, url_for
import json
from models.user import User, admin_only, login_required
from models.dao import Dao


usr = Blueprint('usr', __name__, url_prefix='/usr')


@usr.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        return render_template(
            'login.html',
            title='Bluestreets login'
        )

    values = json.loads(request.form['params'])
    dao = Dao(stateful=True)
    try:
        rec = User.login(dao, values['username'], values['password'])
        session['user'] = rec
        return jsonify(msg='Hello %s!' % rec['first_name'])
    except Exception as ex:
        return jsonify(error=str(ex))
    finally:
        dao.close()


@usr.route('/logoff', methods=['GET'])
def logoff():
    session['is_authenticated'] = False
    return render_template('home.html', title='Bluestreets')


@usr.route('/change_pw', methods=['GET', 'POST'])
@login_required
def change_pw():
    if request.method == 'GET':
        return render_template(
            'change_password.html',
            title='Bluestreets password'
        )

    values = json.loads(request.form['params'])
    user_id = session['user_id']
    try:
        User.change_password(user_id, values['new_password'])
        return jsonify(msg='Password changed!')
    except Exception as ex:
        return jsonify(error=str(ex))


@usr.route('/mgt', methods=['GET'])
# @admin_only
def user_mgt():
    from models.precinct import Precinct

    dao = Dao(stateful=True)
    jurisdictions = Precinct.get_jurisdictions(dao)
    precincts = Precinct.get_all(dao)
    roles = User.get_roles(dao)
    users = User.get_users(dao)
    precinct_admins = User.get_precinct_admins(dao)
    dao.close()
    return render_template(
        'users.html',
        title='Bluestreets users',
        jurisdictions=jurisdictions,
        precincts=[precinct.serialize() for precinct in precincts],
        roles=roles,
        users=users,
        precinct_admins=precinct_admins
    )


@usr.route('/add_user', methods=['POST'])
def user_add():
    values = json.loads(request.form['params'])
    dao = Dao(stateful=True)
    try:
        user_id = User.add_user(dao, values)
        if 'precinct_ids' in values:
            ids = [int(pid) for pid in values['precinct_ids'].split(',') if pid]
            User.add_precinct_ids(dao, user_id, ids)
        users = User.get_users()
        return jsonify(users=users)
    except Exception as ex:
        return jsonify(error=str(ex))
    finally:
        dao.close()


@usr.route('/update_user', methods=['POST'])
def user_update():
    values = json.loads(request.form['params'])
    dao = Dao(stateful=True)
    try:
        if 'fromPrecinctAdmin' in values:
            numrows = User.delete_precinct_admins_for_user(values['id'])
        numrows = User.update_user(dao, values)
        if numrows != 1:
            msg = 'Record not updated for unknown reason. Contact admin.'
            return jsonify(error=msg)
        if 'precinct_ids' in values:
            ids = [int(pid) for pid in values['precinct_ids'].split(',') if pid]
            del_ids = list(set(values['prev_precincts']) - set(ids))
            add_ids = list(set(ids) - set(values['prev_precincts']))
            User.delete_precinct_admins_for_user(dao, values['id'], del_ids)
            User.add_precinct_ids(dao, values['id'], add_ids)
        users = User.get_users()
        return jsonify(users=users)
    except Exception as ex:
        return jsonify(error=str(ex))
    finally:
        dao.close()


@usr.route('/remove_user', methods=['GET'])
def user_drop():
    user_id = json.loads(request.args['id'])
    dao = Dao(stateful=True)
    try:
        success = User.delete_user(dao, user_id)
        if not success:
            msg = 'Record not deleted for unknown reason. Contact admin.'
            return jsonify(error=msg)
        users = User.get_users()
        return jsonify(users=users)
    except Exception as ex:
        return jsonify(error=str(ex))
    finally:
        dao.close()


@usr.route('/add_role', methods=['POST'])
def role_add():
    values = json.loads(request.form['params'])
    try:
        role_id = User.add_role(values)
        return jsonify(id=role_id, roles=User.get_roles())
    except Exception as ex:
        return jsonify(error=str(ex))


@usr.route('/update_role', methods=['POST'])
def role_update():
    values = json.loads(request.form['params'])
    try:
        numrows = User.update_role(values)
        if numrows != 1:
            msg = 'Record not updated for unknown reason. Contact admin.'
            return jsonify(error=msg)
        return jsonify(id=values['id'], roles=User.get_roles())
    except Exception as ex:
        return jsonify(error=str(ex))


@usr.route('/remove_role', methods=['GET'])
def role_drop():
    role_id = json.loads(request.args['id'])
    success = User.delete_role(role_id)
    if not success:
        msg = 'Record not deleted for unknown reason. Contact admin.'
        return jsonify(error=msg)
    roles = User.get_roles()
    return jsonify(roles=roles)


@usr.route('/add_user_role', methods=['POST'])
def user_role_add():
    values = json.loads(request.form['params'])
    try:
        user_role_id = User.add_user_role(values)
        return jsonify(id=user_role_id, roles=User.get_user_roles())
    except Exception as ex:
        return jsonify(error=str(ex))


@usr.route('/update_user_role', methods=['POST'])
def user_role_update():
    values = json.loads(request.form['params'])
    try:
        numrows = User.update_user_role(values)
        if numrows != 1:
            msg = 'Record not updated for unknown reason. Contact admin.'
            return jsonify(error=msg)
        return jsonify(id=values['id'], roles=User.get_user_roles())
    except Exception as ex:
        return jsonify(error=str(ex))


@usr.route('/remove_user_role', methods=['GET'])
def user_role_drop():
    user_role_id = json.loads(request.args['id'])
    success = User.delete_user_role(user_role_id)
    if not success:
        msg = 'Record not deleted for unknown reason. Contact admin.'
        return jsonify(error=msg)
    roles = User.get_user_roles()
    return jsonify(roles=roles)

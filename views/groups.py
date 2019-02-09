from flask import Blueprint, request, jsonify, render_template
import json
from dao.dao import Dao
import dao.grp_dao as grp_dao
import dao.con_dao as con_dao


grp = Blueprint('grp', __name__, url_prefix='/grp')


@grp.route('/groups', methods=['GET', 'POST'])
def groups():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        rex = con_dao.get_all(dao)
        contacts = [{
            'id': rec['id'],
            'name': {
                'last': rec['last_name'],
                'first': rec['first_name'],
                'middle': rec['middle_name'],
                'suffix': rec['name_suffix'],
                'nickname': rec['nickname'],
            },
            'contact_info': {
                'email': rec['email'],
                'phone1': rec['phone1'],
                'phone2': rec['phone2'],
            },
        } for rec in rex]

        grps = grp_dao.get_all(dao)
        members = grp_dao.get_all_members(dao)

        dao.close()

        return render_template(
            'groups/groups.html',
            title='Groups',
            contacts=contacts,
            groups=grps,
            members=members
        )


@grp.route('/add', methods=['POST'])
def grp_add():
    values = json.loads(request.form['params'])
    try:
        grpid = Group.add(values)
        return jsonify(grpid=grpid, groups=Group.get_all())
    except Exception as ex:
        return jsonify(error=str(ex))


@grp.route('/update', methods=['POST'])
def grp_update():
    values = json.loads(request.form['params'])
    grpid = values['id']
    try:
        Group.update(values)
        return jsonify(grpid=grpid, groups=Group.get_all())
    except Exception as ex:
        return jsonify(error=str(ex))


@grp.route('/remove', methods=['GET'])
def grp_drop():
    grpid = json.loads(request.args['grpid'])
    try:
        Group.delete(grpid)
        return jsonify(groups=Group.get_all())
    except Exception as ex:
        return jsonify(error=str(ex))


@grp.route('/members', methods=['GET'])
def grp_members():
    grpid = json.loads(request.args['grpid'])
    try:
        data = Group.get_members(grpid)
        return jsonify(members=data)
    except Exception as ex:
        return jsonify(error=str(ex))

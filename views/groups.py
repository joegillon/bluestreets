from flask import Blueprint, request, jsonify, render_template
import json
from models.group import Group


grp = Blueprint('grp', __name__, url_prefix='/grp')


@grp.route('/groups', methods=['GET', 'POST'])
def groups():
    if request.method == 'GET':
        data = Group.get_all()

        return render_template(
            'groups.html',
            title='Groups',
            groups=data
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

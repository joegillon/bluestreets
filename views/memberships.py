import json

from flask import Blueprint, request, jsonify, render_template

from dao.dao import Dao
import dao.mem_dao as mem_dao

mem = Blueprint('mem', __name__, url_prefix='/mem')


@mem.route('/save', methods=['POST'])
def save():
    params = json.loads(request.form['params'])
    if params['id']:
        mem_dao.update(Dao(), params)
        mem_id = params['id']
    else:
        mem_id = mem_dao.add(Dao(), params)
    return jsonify({'mem_id': mem_id})


@mem.route('/drop', methods=['GET'])
def drop():
    mem_id = json.loads(request.args['mem_id'])
    mem_dao.drop(Dao(), mem_id)
    return jsonify({'mem_id': mem_id})


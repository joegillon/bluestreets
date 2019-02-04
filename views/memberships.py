import json

from flask import Blueprint, request, jsonify, render_template

from dao.dao import Dao
import dao.mem_dao as mem_dao

mem = Blueprint('mem', __name__, url_prefix='/mem')


@mem.route('/add', methods=['POST'])
def add():
    pass


@mem.route('/update', methods=['POST'])
def update():
    pass


@mem.route('/drop', methods=['GET'])
def drop():
    pass


#!/usr/bin/python3.4

from flask import Flask, render_template, session
from flask_api import FlaskAPI
from flask_jsglue import JSGlue
from views.voters import vtr
from views.contacts import con
from views.groups import grp
from views.users import usr
from views.turfs import trf
from api.con_api import con_api

app = FlaskAPI(__name__)

jsglue = JSGlue(app)

app.register_blueprint(vtr)
app.register_blueprint(con)
app.register_blueprint(grp)
app.register_blueprint(usr)
app.register_blueprint(trf)
app.register_blueprint(con_api)


@app.before_first_request
def set_user():
    session['user_id'] = None
    session['user_roles'] = None


@app.route('/')
def homepage():
    return render_template(
        'home.html',
        title='Blue Streets'
    )


@app.route('/goodbye')
def goodbye():
    return render_template(
        'layout.html',
        title='Adlai Goodbye'
    )


@app.errorhandler(401)
def unauthorized_access():
    return render_template('401.html'), 401


@app.errorhandler(404)
def not_found():
    return render_template('404.html'), 404


if __name__ == '__main__':
    import configparser
    import os

    app_path = os.path.dirname(__file__)

    config = configparser.ConfigParser()
    config.read(app_path + '/bluestreets.cfg')
    app.secret_key = config['USER_MGT']['key']
    app.config['DB_PATH'] = config['DATABASE']['db_path'][1:-1]

    app.run(host='0.0.0.0', debug=True)

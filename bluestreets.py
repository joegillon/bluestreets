#!/usr/bin/python3.4

from flask import Flask, render_template
from flask_jsglue import JSGlue
from views.voters import vtr
from views.contacts import con
from views.groups import grp
from views.cleaners import dta

app = Flask(__name__)

# app.config['DEBUG'] = False
# app.config['SECRET_KEY'] = 'super-secret'
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bluestreets.db'
# app.config['SECURITY_REGISTERABLE'] = True
# app.config['SECURITY_PASSWORD_HASH'] = 'sha512_crypt'
# app.config['SECURITY_PASSWORD_SALT'] = 'fhasdgihwntlgy8f'
# app.config['SECURITY_CHANGEABLE'] = True
# app.config['DB_FILE'] = 'c:/bench/bluestreets/data/bluestreets.db'

jsglue = JSGlue(app)

app.register_blueprint(vtr)
app.register_blueprint(con)
app.register_blueprint(grp)
app.register_blueprint(dta)


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


@app.errorhandler(404)
def not_found(error):
    return render_template('404.html'), 404


# jurisdictions = Jurisdiction.get_dict(mydb)

if __name__ == '__main__':
    import configparser
    import os

    app_path = os.path.dirname(__file__)

    config = configparser.ConfigParser()
    config.read(app_path + '/bluestreets.cfg')
    app.config['DB_PATH'] = config['DATABASE']['db_path'][1:-1]

    app.run(host='0.0.0.0', debug=True)

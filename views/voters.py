from flask import Blueprint, request, jsonify, render_template
import json
from models.turf import Turf
from models.dao import Dao
from models.voter import Voter


vtr = Blueprint('vtr', __name__, url_prefix='/vtr')


@vtr.route('/import', methods=['GET', 'POST'])
def csv_import():
    from models.turf import Turf
    from models.submission import Submission

    if request.method == 'GET':
        return render_template(
            'voter_import.html',
            title='Voter Import'
        )

    data = json.loads(request.form['params'])['data']
    cities = Turf.get_cities()
    submissions = [Submission.from_web(rec, cities) for rec in data if rec['data0']]
    Voter.batch_lookup(submissions)
    return jsonify(lookups=[submission.serialize() for submission in submissions])


@vtr.route('/worksheet', methods=['GET', 'POST'])
def worksheet():
    from models.address import Address
    from models.election import Election

    if request.method == 'GET':
        dao = Dao()
        jurisdictions = Turf.get_jurisdictions(dao)
        return render_template(
            'worksheet.html',
            title='Voter Worksheet',
            jurisdictions=jurisdictions
        )

    blocks = json.loads(request.form['params'])['blocks']
    dao = Dao(stateful=True)
    elections = Election.get(dao)

    data = []

    for block in blocks:
        data += Voter.get_by_block(dao, block, elections)
    voters = []

    dao.close()

    for voter in data:
        v = [
            voter['last_name'],
            voter['first_name'],
            voter['middle_name'],
            voter['name_suffix'],
            str(Address(voter)),
            voter['city'],
            voter['zipcode'],
            voter['gender'],
            str(voter['birth_year']),
            voter['party'] if voter['party'] else 'N',
            voter['voter_id'],
            voter['reg_date'],
            voter['permanent_absentee'] if voter['permanent_absentee'] else 'N',
            voter['status'],
            voter['uocava']
        ]
        for election in elections:
            v.append(voter[election['date']])
        voters.append(v)

    return jsonify(
        elections=[election['date'] + ":" + election['description'] for election in elections],
        voters=voters
    )


@vtr.route('/lookup', methods=['GET'])
def lookup():
    dao = Dao()
    matches = Voter.lookup(dao, request.args)
    result = [{
        'name': str(match.name),
        'address': str(match.address),
        'city': match.address.city,
        'zipcode': match.address.zipcode,
        'gender': match.gender,
        'birth_year': match.birth_year,
        'voter_id': match.id} for match in matches]
    return jsonify(matches=result)


@vtr.route('/get_voter', methods=['GET'])
def get_voter():
    dao = Dao(stateful=True)
    voter = Voter.get_voter(dao, request.args['voter_id'])
    dao.close()
    return jsonify(voter=voter)

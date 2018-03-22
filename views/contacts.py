from flask import Blueprint, request, jsonify, render_template
import json
from models.contact import Contact
from models.dao import Dao
from models.address import Address
from models.turf import Turf
from models.person_name import PersonName
from models.precinct import Precinct
from models.group import Group
from models.group_member import GroupMember
from models.voter import Voter


con = Blueprint('con', __name__, url_prefix='/con')


@con.route('/import', methods=['GET', 'POST'])
def csv_import():
    if request.method == 'GET':
        return render_template(
            'con_import.html',
            title='Contact Import'
        )

    data = json.loads(request.form['params'])
    dao = Dao(stateful=True)
    precincts = Precinct.get_by_jwp(dao)
    groups = Group.get_all_by_code(dao)
    memberships = []
    next_id = dao.get_max_id('contacts', 'id')
    for rec in data:
        rec['precinct_id'] = None
        next_id += 1
        if rec['jurisdiction'] and rec['ward'] and rec['precinct']:
            jwp = '%s:%s:%s' % (
                rec['jurisdiction'].upper(),
                rec['ward'].zfill(2),
                rec['precinct'].zfill(3)
            )
            rec['precinct_id'] = precincts[jwp]['id']
        if rec['groups']:
            for code in rec['groups'].split('/'):
                if code in groups:
                    memberships.append({
                        'group_id': groups[code]['id'],
                        'contact_id': next_id,
                        'role': '',
                        'comment': ''
                    })

    try:
        Contact.add_many(data)
        GroupMember.add_many(memberships)
        return jsonify(msg='Successful!')
    except Exception as ex:
        return jsonify(error=str(ex))
    finally:
        dao.close()


@con.route('/entry', methods=['GET', 'POST'])
def entry():
    if request.method == 'GET':
        return render_template(
            'con_entry.html',
            title='Contacts'
        )


@con.route('/export', methods=['GET'])
def csv_export():
    from models.turf import Turf

    dao = Dao()
    jurisdictions = Turf.get_jurisdictions(dao)
    return render_template(
        'con_export.html',
        title='Contact Export',
        jurisdictions=jurisdictions
    )


@con.route('/get', methods=['GET'])
def con_get():
    from utils.utils import Utils

    dao = Dao(stateful=True)
    jurisdiction_code = request.args['jurisdiction_code']
    try:
        memberships = GroupMember.get_code_lists(dao)
        precincts = Precinct.get_by_jurisdiction(dao, jurisdiction_code)
        precinct_dict = Utils.to_dict(precincts)

        if 'ward_no' in request.args:
            precincts = [p for p in precincts if p.ward == request.args['ward_no']]

        if 'precinct_no' in request.args:
            precincts = [p for p in precincts if p.precinct == request.args['precinct_no']]

        precinct_ids = [p.id for p in precincts]
        contacts = Contact.get_by_precinct_list(precinct_ids)
    except Exception as ex:
        return jsonify(error=str(ex))
    finally:
        dao.close()

    if not contacts:
        return jsonify(error='No contacts!')

    if 'blocks' in request.args:
        blocks = json.loads(request.args['blocks'])
        result = []
        for contact in contacts:
            for block in blocks:
                if contact.address.get_street() == block['str']:
                    if contact.address.is_on_block(
                            block['odd_even'], block['low_addr'], block['high_addr']):
                        result.append(contact)
        contacts = result

    contacts = [{
        'Name': str(contact.name),
        'Email': contact.info.email,
        'Phone 1': contact.info.phone1,
        'Phone 2': contact.info.phone2,
        'Address': str(contact.address),
        'City': contact.address.city,
        'Zip': contact.address.zipcode,
        'Jurisdiction': precinct_dict[contact.precinct_id].jurisdiction_name,
        'Ward': precinct_dict[contact.precinct_id].ward,
        'Precinct': precinct_dict[contact.precinct_id].precinct,
        'Groups': ':'.join(memberships[contact.id]) if contact.id in memberships else '',
        'Gender': contact.gender,
        'Birth Yr': contact.birth_year
    } for contact in contacts]

    return jsonify(contacts=contacts)


@con.route('/precinct', methods=['GET', 'POST'])
def assign_precinct():
    from models.precinct import Precinct

    if request.method == 'GET':
        precincts = Precinct.get_all()
        contacts = Contact.get_with_missing_precinct()
        return render_template(
            'con_precinct.html',
            title='Unassigned Precinct',
            precincts=precincts,
            contacts=contacts
        )

    params = json.loads(request.form['params'])
    contact = Contact(params)
    dao = Dao(stateful=True)
    if 'voter_id' in params and params['voter_id']:
        voter = Voter.get_one(dao, params['voter_id'])
        nickname = contact.name.first
        contact.name = voter.name
        contact.name.nickname = nickname
        contact.address = voter.address
        contact.reg_date = voter.reg_date
    try:
        contact.update(dao)
        return jsonify(msg="Update successful!")
    except Exception as ex:
        return jsonify(error=str(ex))
    finally:
        dao.close()


@con.route('/contact_matches', methods=['POST'])
def contact_matches():
    contact = Contact(json.loads(request.form['params']))
    dao = Dao(stateful=True)
    try:
        matches = contact.get_matches(dao)
        for match in matches:
            match['name'] = str(PersonName(match))
            match['address'] = str(Address(match))
        return jsonify(matches=matches)
    except Exception as ex:
        return jsonify(error=str(ex))


@con.route('/voter_lookup', methods=['POST'])
def voter_lookup():
    from models.voter import Voter

    contact = json.loads(request.form['params'])
    dao = Dao()
    try:
        voters = Voter.lookup(dao, contact)
        candidates = []
        for voter in voters:
            candidates.append({
                'name': str(voter.name),
                'address': str(voter.address),
                'city': voter.address.city,
                'zipcode': voter.address.zipcode,
                'birth_year': voter.birth_year,
                'gender': voter.gender,
                'voter_id': voter.voter_id,
                'precinct_id': voter.address.precinct_id
            })
        return jsonify(candidates=candidates)
    except Exception as ex:
        return jsonify(error=str(ex))


@con.route('/street_lookup', methods=['POST'])
def street_lookup():
    params = json.loads(request.form['params'])
    addr = Address(params)
    try:
        streets = Turf.get_turf(addr)
        candidates = []
        for street in streets:
            candidates.append({
                'address': str(Address(street)),
                'city': street['city'],
                'zipcode': street['zipcode'],
                'house_num_low': street['house_num_low'],
                'house_num_high': street['house_num_high'],
                'odd_even': street['odd_even'],
                'precinct_id': street['precinct_id']
            })
        return jsonify(candidates=candidates)
    except Exception as ex:
        return jsonify(error=str(ex))


@con.route('/duplicates', methods=['GET', 'POST'])
def duplicates():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        cities = Turf.get_city_names(dao)
        dups = Contact.get_name_dups(dao)
        dao.close()
        for dup in dups:
            dup['name'] = str(PersonName(dup))
            dup['address'] = str(Address(dup))

        return render_template(
            'con_dups.html',
            title='Clean Duplicates',
            dups=dups,
            cities=cities
        )


@con.route('/dup_emails', methods=['GET'])
def dup_emails():
    contacts = Contact.get_email_dups()
    for contact in contacts:
        contact['name'] = str(contact.name)
        contact['address'] = str(contact.address)
    return jsonify(dups=contacts)


# @con.route('/add_dups', methods=['POST'])
# def add_dups():
#     data = json.loads(request.form['params'])
#     try:
#         data = Contact.add_dups(data)
#         return jsonify(data=data)
#     except Exception as ex:
#         return jsonify(error=str(ex))


@con.route('/add_list', methods=['POST'])
def add_list():
    data = json.loads(request.form['params'])
    try:
        Contact.add_list(data)
        return jsonify(msg='Records saved!')
    except Exception as ex:
        return jsonify(error=str(ex))


@con.route('/crewboard', methods=['GET', 'POST'])
def crewboard():
    if request.method == 'GET':
        contacts = Contact.get_activists()
        return render_template(
            'con_crewboard.html',
            title='Battle Stations',
            contacts=[contact.serialize() for contact in contacts]
        )

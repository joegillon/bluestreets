import json

from flask import Blueprint, request, jsonify, render_template

from dao.dao import Dao
import dao.con_dao as con_dao
import dao.turf_dao as turf_dao
import dao.grp_dao as grp_dao

from models.address import Address
from models.contact import Contact
from models.group import Group
from models.group_member import GroupMember
from models.person_name import PersonName
from models.precinct import Precinct
from models.turf import Turf
from models.voter import Voter

con = Blueprint('con', __name__, url_prefix='/con')


@con.route('/grid', methods=['GET', 'POST'])
def grid():
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
                'last_meta': rec['last_name_meta'],
                'first_meta': rec['first_name_meta'],
            },
            'address': {
                'house_number': rec['house_number'],
                'pre_direction': rec['pre_direction'],
                'street_name': rec['street_name'],
                'street_type': rec['street_type'],
                'suf_direction': rec['suf_direction'],
                'unit': rec['unit'],
                'street_meta': rec['street_name_meta'],
                'city': rec['city'],
                'zipcode': rec['zipcode']
            },
            'contact_info': {
                'email': rec['email'],
                'phone1': rec['phone1'],
                'phone2': rec['phone2'],
            },
            'voter_info': {
                'voter_id': rec['voter_id'],
                'precinct_id': rec['precinct_id'],
                'birth_year': rec['birth_year'],
                'gender': rec['gender'],
                'reg_date': rec['reg_date']
            }
        } for rec in rex]

        grps = grp_dao.get_all(dao)
        members = grp_dao.get_all_members(dao)

        streets = turf_dao.get_streets_for_county(dao, 81)
        for street in streets:
            street['display_name'] = get_street_name(street)
            street['pct_name'] = '%s, %s, %s' % (
                street['jurisdiction_name'], street['ward'], street['precinct']
            )
            for fld in ['index_id', 'block_low', 'block_high',
                        'county_code', 'county_commissioner', 'village_precinct',
                        'school_precinct']:
                del street[fld]

        dao.close()

        return render_template(
            'contacts/grid.html',
            contacts=contacts,
            groups=grps,
            members=members,
            streets=streets,
            title='Contacts'
        )

    params = json.loads(request.form['params'])
    if params['id'] == -1:
        contact_id = con_dao.add(Dao(), params)
    else:
        con_dao.update(Dao(), params)
        contact_id = params['id']

    return jsonify({'contact_id': contact_id})


@con.route('/drop', methods=['GET'])
def drop():
    contact_id = json.loads(request.args['contact_id'])
    dao = Dao(stateful=True)
    success = con_dao.drop(dao, contact_id)
    dao.close()
    if not success:
        msg = 'Contact not deleted. Please report.'
        return jsonify(error=msg)
    return jsonify(dropped='Contact dropped!')


def get_street_name(street_rec):
    s = ''
    if street_rec['pre_direction']:
        s += ' %s' % street_rec['pre_direction']
    s += ' %s' % street_rec['street_name']
    if ['street_type']:
        s += ' %s' % street_rec['street_type']
    if street_rec['suf_direction']:
        s += ' %s' % street_rec['suf_direction']
    return s.strip()


    params = json.loads(request.form['params'])
    pass
    # if not blocks:
    #     contacts = con_dao.get_all()
    # elif len(blocks[0]) == 1 and 'precinct_id' in blocks[0]:
    #     contacts = con_dao.get_by_precinct(blocks[0]['precinct_id'])
    # else:
    #     dao = Dao(stateful=True)
    #     contacts = []
    #     for block in blocks:
    #         contacts += con_dao.get_by_block(dao, block)
    #     dao.close()
    # return jsonify(contacts=to_local_format(contacts))


@con.route('/import', methods=['GET', 'POST'])
def csv_import():
    if request.method == 'GET':
        return render_template(
            'contacts/con_import.html',
            title='Contact Import'
        )

    data = json.loads(request.form['params'])
    dao = Dao(stateful=True)
    # precincts = Precinct.get_by_jwp(dao)
    groups = Group.get_all_by_code(dao)
    memberships = []
    next_id = dao.get_max_id('contacts', 'id')
    for rec in data:
        rec['precinct_id'] = None
        next_id += 1
        # if rec['jurisdiction'] and rec['ward'] and rec['precinct']:
        #     jwp = '%s:%s:%s' % (
        #         rec['jurisdiction'].upper(),
        #         rec['ward'].zfill(2),
        #         rec['precinct'].zfill(3)
        #     )
        #     rec['precinct_id'] = precincts[jwp]['id']
        if 'groups' in rec:
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
            'contacts/con_entry.html',
            title='Contacts'
        )


@con.route('/export', methods=['GET'])
def csv_export():
    from models.turf import Turf

    dao = Dao()
    jurisdictions = Turf.get_jurisdictions(dao)
    return render_template(
        'contacts/con_export.html',
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


@con.route('/synchronize', methods=['GET', 'POST'])
def synchronize():
    from models.contact import Contact

    if request.method == 'GET':
        problems = Contact.synchronize()
        return render_template(
            'contacts/con_problems.html',
            title='Unsynched Contacts',
            problems=problems
        )


@con.route('/precinct', methods=['GET', 'POST'])
def assign_precinct():
    from models.precinct import Precinct

    if request.method == 'GET':
        precincts = Precinct.get_all()
        contacts = Contact.get_with_missing_precinct()
        return render_template(
            'contacts/con_precinct.html',
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
    dao = Dao(stateful=True)
    try:
        voters = Voter.lookup(dao, contact)
        candidates = [{
            'name': {
                'last': voter.name.last,
                'first': voter.name.first,
                'middle': voter.name.middle,
                'suffix': voter.name.suffix
            },
            'address': {
                'house_number': voter.address.house_number,
                'pre_direction': voter.address.pre_direction,
                'street_name': voter.address.street_name,
                'street_type': voter.address.street_type,
                'suf_direction': voter.address.suf_direction,
                'unit': voter.address.unit,
                'city': voter.address.city,
                'zipcode': voter.address.zipcode
            },
            'voter_info': {
                'voter_id': voter.voter_id,
                'precinct_id': voter.precinct_id,
                'birth_year': voter.birth_year,
                'gender': voter.gender,
                'reg_date': voter.reg_date
            }
        } for voter in voters]
        return jsonify(candidates=candidates)
    except Exception as ex:
        return jsonify(error=str(ex))
    finally:
        dao.close()


@con.route('/street_lookup', methods=['POST'])
def street_lookup():
    from models.address import str_parse
    from utils.match import MatchLib

    params = json.loads(request.form['params'])
    addr = str_parse(params['address'])
    addr['county_code'] = '81'  # TODO: get from cfg
    addr['meta'] = Address.get_street_meta(addr['street_name'])
    if params['city']:
        addr['city'] = params['city']
    if params['zipcode']:
        addr['zipcode'] = params['zipcode']

    dao = Dao()

    try:
        candidates = turf_dao.street_fuzzy_lookup(dao, addr)
        matches = MatchLib.get_best_matches(addr['street_name'], [c['street_name'] for c in candidates], 80)
        matches = [match[0] for match in matches]
        candidates = [candidate for candidate in candidates if candidate['street_name'] in matches]
        candidates = [{
            'address': {
                'house_num_low': candidate['house_num_low'],
                'house_num_high': candidate['house_num_high'],
                'odd_even': candidate['odd_even'],
                'pre_direction': candidate['pre_direction'],
                'street_name': candidate['street_name'],
                'street_type': candidate['street_type'],
                'suf_direction': candidate['suf_direction'],
                'unit_low': candidate['ext_low'],
                'unit_high': candidate['ext_high'],
                'city': candidate['city'],
                'zipcode': candidate['zipcode']
            },
            'voter_info': {
                'precinct_id': candidate['precinct_id']
            }
        } for candidate in candidates]

        return jsonify(candidates=candidates)
    except Exception as ex:
        return jsonify(error=str(ex))


@con.route('/email_duplicates', methods=['GET', 'POST'])
def email_duplicates():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        cities = Turf.get_city_names(dao)
        dups = Contact.get_email_dups(dao)
        dao.close()
        for dup in dups:
            dup['name'] = str(PersonName(dup))
            dup['address'] = str(Address(dup))

        return render_template(
            'contacts/con_dups.html',
            title='Email Duplicates',
            dups=dups,
            cities=cities
        )


@con.route('/phone_duplicates', methods=['GET', 'POST'])
def phone_duplicates():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        cities = Turf.get_city_names(dao)
        dups = Contact.get_phone_dups(dao)
        dao.close()
        for dup in dups:
            dup['name'] = str(PersonName(dup))
            dup['address'] = str(Address(dup))

        return render_template(
            'contacts/con_dups.html',
            title='Phone Duplicates',
            dups=dups,
            cities=cities
        )


@con.route('/name_addr_duplicates', methods=['GET', 'POST'])
def name_addr_duplicates():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        cities = Turf.get_city_names(dao)
        dups = Contact.get_name_addr_dups(dao)
        dao.close()
        for dup in dups:
            dup['name'] = str(PersonName(dup))
            dup['address'] = str(Address(dup))

        return render_template(
            'contacts/con_dups.html',
            title='Name + Address Duplicates',
            dups=dups,
            cities=cities
        )


@con.route('/name_duplicates', methods=['GET', 'POST'])
def name_duplicates():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        cities = Turf.get_city_names(dao)
        dups = Contact.get_name_dups(dao)
        dao.close()
        for dup in dups:
            dup['name'] = str(PersonName(dup))
            dup['address'] = str(Address(dup))

        return render_template(
            'contacts/con_dups.html',
            title='Name Duplicates',
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


@con.route('/drop_many', methods=['POST'])
def drop_many():
    data = json.loads(request.form['params'])
    try:
        Contact.drop_many(data['ids'])
        return jsonify(msg='Records removed!')
    except Exception as ex:
        return jsonify(error=str(ex))


@con.route('/update_many', methods=['POST'])
def update_many():
    data = json.loads(request.form['params'])
    contacts = [Contact(item) for item in data['data']]
    try:
        Contact.update_many(contacts)
        return jsonify(msg='Records updated!')
    except Exception as ex:
        return jsonify(error=str(ex))


@con.route('/crewboard', methods=['GET', 'POST'])
def crewboard():
    if request.method == 'GET':
        dao = Dao(stateful=True)
        contacts = Contact.get_activists(dao)
        precincts = Precinct.get_all(dao)
        return render_template(
            'contacts/con_crewboard.html',
            title='Battle Stations',
            contacts=[contact.serialize() for contact in contacts],
            precincts=[precinct.serialize() for precinct in precincts]
        )

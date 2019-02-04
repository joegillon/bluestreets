from metaphone import doublemetaphone as dm
from models.contact import Contact


def get_all(dao):
    sql = ("SELECT * FROM contacts "
           "ORDER BY last_name, first_name, middle_name")
    return dao.execute(sql)


def add(dao, params):
    sql = "INSERT INTO contacts (%s) VALUES (%s)" % (
        ','.join(Contact.db_cols), dao.get_param_str(Contact.db_cols)
    )
    return dao.execute(sql, __get_values(params))


def update(dao, params):
    sql = "UPDATE contacts SET %s WHERE id=?;" % (
        '=?,'.join(Contact.db_cols) + '=?',
    )
    vals = __get_values(params)
    vals.append(params['id'])
    dao.execute(sql, vals)


def __get_values(params):
    return [
        params['name']['last'],
        params['name']['first'],
        params['name']['middle'],
        params['name']['suffix'],
        params['name']['nickname'],
        dm(params['name']['last'])[0],
        dm(params['name']['first'])[0],
        dm(params['name']['nickname'])[0],
        params['voter_info']['birth_year'],
        params['voter_info']['gender'],
        params['contact_info']['email'],
        params['contact_info']['phone1'],
        params['contact_info']['phone2'],
        params['address']['house_number'],
        params['address']['pre_direction'],
        params['address']['street_name'],
        params['address']['street_type'],
        params['address']['suf_direction'],
        params['address']['unit'],
        dm(params['address']['street_name'])[0],
        params['address']['city'],
        params['address']['zipcode'],
        params['voter_info']['precinct_id'],
        params['voter_info']['voter_id'],
        params['voter_info']['reg_date']
    ]


def drop(dao, contact_id):
    # TODO: delete memberships
    sql = "DELETE FROM contacts WHERE id=?"
    dao.execute(sql, (contact_id,))


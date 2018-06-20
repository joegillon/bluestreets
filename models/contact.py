from models.dao import Dao, get_dao
from models.person_name import PersonName
from models.address import Address
from models.contact_info import ContactInfo
from utils.match import MatchLib


class Contact(object):

    db_cols = [
        'last_name', 'first_name', 'middle_name', 'name_suffix',
        'nickname', 'last_name_meta', 'first_name_meta', 'nickname_meta',
        'birth_year', 'gender', 'email', 'phone1', 'phone2',
        'house_number', 'pre_direction', 'street_name', 'street_type',
        'suf_direction', 'unit', 'street_name_meta', 'city', 'zipcode',
        'precinct_id', 'voter_id', 'reg_date'
    ]

    def __init__(self, d=None):
        self.id = None
        self.name = None
        self.birth_year = None
        self.gender = ''
        self.info = None
        self.address = None
        self.voter_id = None
        self.reg_date = ''
        if d:
            for attr in self.__dict__:
                if attr in d:
                    setattr(self, attr, d[attr])
            self.name = PersonName(d)
            self.address = Address(d)
            self.info = ContactInfo(d)

    def __str__(self):
        return str(self.name)

    def serialize(self):
        return {
            'name': self.name.serialize(),
            'whole_name': str(self.name),
            'birth_year': self.birth_year,
            'gender': self.gender,
            'contact': self.info.serialize(),
            'address': self.address.serialize(),
            'voter_id': self.voter_id,
            'reg_date': self.reg_date,
            'id': self.id,
        }

    def get_values(self):
        return (
            self.name.last,
            self.name.first,
            self.name.middle,
            self.name.suffix,
            self.name.nickname,
            self.name.last_meta,
            self.name.first_meta,
            self.name.nickname_meta,
            self.birth_year,
            self.gender,
            self.info.email,
            self.info.phone1,
            self.info.phone2,
            self.address.house_number,
            self.address.pre_direction,
            self.address.street_name,
            self.address.street_type,
            self.address.suf_direction,
            self.address.unit,
            self.address.metaphone,
            self.address.city,
            self.address.zipcode,
            self.address.precinct_id,
            self.voter_id,
            self.reg_date
        )

    @staticmethod
    @get_dao
    def get_all(dao):
        sql = ("SELECT * FROM contacts "
               "ORDER BY last_name, first_name, middle_name")
        rex = dao.execute(sql)
        return [Contact(rec) for rec in rex]

    def get_matches(self, dao=None):
        if not dao:
            dao = Dao(stateful=True)
        if self.info and (self.info.phone1 or self.info.phone2):
            matches = self.get_phone_matches(dao)
            if matches:
                return matches
        if self.info and self.info.email:
            matches = self.get_email_matches(dao)
            if matches:
                return matches
        if self.address:
            matches = self.get_name_addr_matches(dao)
            if matches:
                return matches
        return self.get_name_only_matches(dao)

    def get_email_matches(self, dao):
        sql = ("SELECT * FROM contacts "
               "WHERE email LIKE ? "
               "AND id<>?;")
        vals = (self.info.email[0], self.id)
        rex = dao.execute(sql, vals)
        if not rex:
            return []
        candidates = {rec['id']: rec['email'] for rec in rex}
        choices = self.choose_email(candidates.values())
        if not choices:
            return[]
        result = []
        for choice in choices:
            for rec in rex:
                if rec['email'] == choice:
                    result.append(Contact(rec))
        return result

    def choose_email(self, candidates):
        target = self.info.email.split('@')
        emails = [c.split('@') for c in candidates]
        best_domain = MatchLib.get_best_match(target[1], set([email[1] for email in emails]))[0]
        usernames = [email[0] for email in emails if email[1] in [target[1], best_domain]]
        matches = MatchLib.get_best_matches(target[0], usernames, 80)
        return [match[0] + '@' + best_domain for match in matches] if matches else []

    def get_phone_matches(self, dao):
        if not self.info:
            return []
        if not self.info.phone1 and not self.info.phone2:
            return []
        rex = []
        sql = ("SELECT * FROM contacts "
               "WHERE (phone1=? OR phone2=?) "
               "AND id<>?;")
        if self.info.phone1:
            vals = (self.info.phone1, self.info.phone1, self.id)
            rex = dao.execute(sql, vals)
        if self.info.phone2:
            vals = (self.info.phone2, self.info.phone2, self.id)
            rex += dao.execute(sql, vals)
        d = {}
        for rec in rex:
            if rec['id'] in d:
                continue
            d[rec['id']] = rec
        return list(d.values())

    def get_name_addr_matches(self, dao):
        rex = PersonName.person_by_name_and_address(dao, 'contacts', self.address, self.name)
        return [Contact[rec] for rec in rex if rec['id'] != self.id] if rex else []

    def get_name_only_matches(self, dao):
        rex = PersonName.person_by_name_only(dao, 'contacts', self.name)
        return [Contact[rec] for rec in rex if rec['id'] != self.id] if rex else []

    def add(self, dao):
        sql = ("INSERT INTO contacts (%s) VALUES (%s)") % (
            ','.join(self.db_cols), dao.get_param_str(self.db_cols)
        )
        vals = self.get_values()
        return dao.execute(sql, vals)

    def update(self, dao):
        sql = "UPDATE contacts SET %s WHERE id=?;" % (
            '=?,'.join(self.db_cols) + '=?',
        )
        vals = self.get_values() + (self.id,)
        dao.execute(sql, vals)

    @staticmethod
    def add_many(data, dao=None):
        contacts = [Contact(d) for d in data]
        values = [contact.get_values() for contact in contacts]

        if not dao:
            dao = Dao()
        dao.add_many('contacts', Contact.db_cols, values)

    @staticmethod
    @get_dao
    def update_many(dao, contacts):
        values = [contact.get_values() + (contact.id,) for contact in contacts]
        dao.update_many('contacts', Contact.db_cols, values)

    @staticmethod
    @get_dao
    def drop_many(dao, ids):
        dao.drop_many('contacts', ids)

    @staticmethod
    def get_best_voter_rec(dao, contact):
        from models.voter import Voter

        candidates = Voter.voters_by_name_and_address(dao, contact.address, contact.name)
        if not candidates:
            return None
        streets = set([candidate.address.street_name for candidate in candidates])
        best_street = MatchLib.get_best_match(
            contact.address.street_name, streets, 85
        )
        if not best_street:
            return None
        candidates = [candidate for candidate in candidates
                      if candidate.address.street_name == best_street]
        best_name = MatchLib.get_best_match(
            str(contact), [str(candidate.name) for candidate in candidates], 85
        )
        if not best_name:
            return None
        return [candidate for candidate in candidates
                if str(candidate.name) == best_name][0]

    @staticmethod
    def get_best_turf(dao, contact):
        turfs = Address.get_turf(dao, contact.address)
        if not turfs:
            return None
        if len(set([turf['precinct_id'] for turf in turfs])) == 1:
            return turfs[0]
        d = {
            (t['pre_direction'] + ' ' + t['street_name'] + ' ' + t['street_type'] + ' ' + t['suf_direction']).strip(): t for t in turfs
        }
        match = MatchLib.get_best_match(str(contact.address), d.keys(), 85)
        return d[match] if match else None

    @staticmethod
    def synchronize(dao):
        # from models.dao import Dao
        from models.voter import Voter

        # dao = Dao(stateful=True)
        contacts = Contact.get_all(dao)
        problems = {
            'reg': [], 'name': [], 'vrec': [],
            'addr': [], 'pct': []
        }
        for contact in contacts:
            if not contact.voter_id:
                problems['reg'].append(contact)
                continue
            voter = Voter.get_one(dao, contact.voter_id)
            if not voter:
                problems['vrec'].append([
                    contact.id,
                    str(contact.name),
                    str(contact.address),
                    contact.address.city,
                    contact.address.zipcode,
                    contact.address.precinct_id,
                    None
                ])
                continue
            if str(contact.name) != str(voter.name):
                problems['name'].append((str(contact.name), str(voter.name)))
                continue
            if str(contact.address) != str(voter.address):
                problems['addr'].append(contact)
                continue
            if contact.address.precinct_id != voter.address.precinct_id:
                problems['pct'].append(contact)
            # contact.copy_voter(voter)
            # contact.update(dao)
        return problems

    def copy_voter(self, voter):
        if not self.name.nickname:
            self.name.nickname = self.name.first
        self.name.last = voter.name.last
        self.name.first = voter.name.first
        self.name.middle = voter.name.middle
        self.name.suffix = voter.name.suffix
        self.address.house_number = voter.address.house_number
        self.address.pre_direction = voter.address.pre_direction
        self.address.street_name = voter.address.street_name
        self.address.street_type = voter.address.street_type
        self.address.suf_direction = voter.address.suf_direction
        self.address.unit = voter.address.unit
        self.address.city = voter.address.city
        self.address.zipcode = voter.address.zipcode
        self.address.precinct_id = voter.address.precinct_id
        self.gender = voter.gender
        self.birth_year = voter.birth_year
        self.reg_date = voter.reg_date
        self.voter_id = voter.voter_id

    @staticmethod
    def assign_precinct(contacts, dao=None):
        if not dao:
            dao = Dao(stateful=True)
        updates = []
        for contact in contacts:
            # get voter rex by name + address
            voter = Contact.get_best_voter_rec(dao, contact)
            if voter:
                nn = (contact.name.nickname, contact.name.nickname_meta)
                contact.name = voter.name
                contact.nickname = nn[0]
                contact.nickname_meta = nn[1]
                contact.address = voter.address
                contact.birth_year = voter.birth_year
                contact.gender = voter.gender
                contact.voter_id = voter.voter_id
                contact.reg_date = voter.reg_date
                updates.append(contact)
                continue
            turf = Contact.get_best_turf(dao, contact)
            if turf:
                contact.address.pre_direction = turf['pre_direction']
                contact.address.street_name = turf['street_name']
                contact.address.street_type = turf['street_type']
                contact.address.suf_direction = turf['suf_direction']
                contact.address.precinct_id = turf['precinct_id']
                contact.address.city = turf['city']
                contact.address.zipcode = turf['zipcode']
                updates.append(contact)
                continue

            # get voter rex by name only

        # Contact.update_many(dao, updates)
        dao.close()
        return len(updates)

    @staticmethod
    def get_with_missing_precinct(dao=None):
        if not dao:
            dao = Dao()
        sql = ("SELECT * FROM contacts "
               "WHERE precinct_id is null "
               "ORDER BY last_name, first_name, middle_name;")
        rex = dao.execute(sql)
        return rex
        # return [Contact(rec) for rec in rex] if rex else []

    @staticmethod
    @get_dao
    def get_email_dups(dao):
        sql = ("SELECT * "
               "FROM contacts "
               "WHERE email IN "
               "(SELECT email "
               "FROM contacts "
               "WHERE email <> '' "
               "GROUP BY email HAVING COUNT(email) > 1) "
               "ORDER BY last_name, first_name, middle_name;")
        return dao.execute(sql)

    @staticmethod
    @get_dao
    def get_phone_dups(dao):
        p_clause_1 = "(SELECT phone1 FROM contacts " \
                     "WHERE phone1 <> '' " \
                     "GROUP BY phone1 HAVING COUNT(phone1) > 1) "
        p_clause_2 = "(SELECT phone2 FROM contacts " \
                     "WHERE phone2 <> '' " \
                     "GROUP BY phone2 HAVING COUNT(phone2) > 1) "
        sql = ("SELECT * FROM contacts "
               "WHERE phone1 IN %s "
               "OR phone1 IN %s "
               "OR phone2 IN %s "
               "OR phone2 IN %s "
               "ORDER BY last_name, first_name, middle_name;") % (
            p_clause_1, p_clause_2, p_clause_1, p_clause_2)
        return dao.execute(sql)

    @staticmethod
    @get_dao
    def get_name_addr_dups(dao):
        sql = ("SELECT * FROM contacts "
               "INNER JOIN "
               "(SELECT last_name_meta, street_name_meta FROM contacts "
               "GROUP BY (last_name_meta || ':' || street_name_meta) "
               "HAVING count(id) > 1) dup "
               "ON contacts.last_name_meta=dup.last_name_meta "
               "WHERE contacts.street_name_meta <> '' "
               "ORDER BY last_name, first_name, middle_name;")
        return dao.execute(sql)

    @staticmethod
    @get_dao
    def get_name_dups(dao):
        sql = ("SELECT contacts.* FROM contacts "
               "JOIN "
               "(SELECT last_name_meta, last_name, first_name_meta FROM contacts "
               "GROUP BY (last_name_meta || ':' || first_name_meta) "
               "HAVING count(id) > 1) dup "
               "ON contacts.last_name_meta=dup.last_name_meta "
               "AND substr(contacts.last_name,1,1)=substr(dup.last_name,1,1) "
               "AND contacts.first_name_meta LIKE (dup.first_name_meta || '%') "
               "ORDER BY last_name, first_name, middle_name;")
        return dao.execute(sql)

    @staticmethod
    @get_dao
    def get_activists(dao):
        sql = "SELECT * FROM contacts WHERE active=1 ORDER BY last_name, first_name, middle_name;"
        rex = dao.execute(sql)
        return [Contact(rec) for rec in rex] if rex else []

    @staticmethod
    @get_dao
    def get_by_precinct(dao, precinct_id):
        sql = ("SELECT * FROM contacts "
               "WHERE precinct_id=? "
               "AND active=1 "
               "ORDER BY last_name, first_name, middle_name;")
        vals = (precinct_id,)
        rex = dao.execute(sql, vals)
        return [Contact(rec) for rec in rex] if rex else []

    @staticmethod
    @get_dao
    def get_by_precinct_list(dao, precinct_list):
        sql = ("SELECT * FROM contacts "
               "WHERE precinct_id IN (%s) "
               "AND active=1 "
               "ORDER BY last_name, first_name, middle_name;") % (
            dao.get_param_str(precinct_list)
        )
        rex = dao.execute(sql, precinct_list)
        return [Contact(rec) for rec in rex] if rex else []

    @staticmethod
    def get_by_group(dao, group_id):
        sql = ("SELECT * FROM contacts "
               "WHERE id IN "
               "(SELECT contact_id "
               "FROM group_members "
               "WHERE group_id=?)")
        rex = dao.execute(sql, (group_id,))
        return [Contact(rec) for rec in rex] if rex else []

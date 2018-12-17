from dao.dao import Dao, get_dao


class Election(object):

    def __init__(self, d):
        self.id = None
        self.date = None
        self.description = None
        if d:
            self.__from_dict(d)

    def __str__(self):
        return '%s, %s' % (self.description, self.date)

    def __from_dict(self, d):
        self.id = d['id']
        self.date = d['date']
        self.description = d['description']

    def insert(self):
        sql = ("INSERT INTO elections "
               "(id, date, description) "
               "VALUES (%s, %s, %s);")
        vals = [
            self.id, self.date, self.description
        ]
        dao = Dao()
        return dao.execute(sql, vals)

    @staticmethod
    @get_dao
    def get(dao, election_codes=None):
        sql = "SELECT * FROM elections "
        if election_codes:
            ec = '"' + '","'.join(election_codes) + '"'
            sql += "WHERE code IN (%s) " % (ec,)
        sql += "ORDER BY date DESC;"
        return dao.execute(sql)

    @staticmethod
    def get_dict(dao, election_codes=None):
        rex = Election.get(dao, election_codes)
        return {rec['code']: rec for rec in rex}

    @staticmethod
    @get_dao
    def get_ballot_types(dao):
        sql = "SELECT voter_id, type FROM ballots"
        return dao.execute(sql, id_fld='voter_id')

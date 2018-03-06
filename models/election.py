from models.mysql_dao import MySqlDao


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
        dao = MySqlDao()
        return dao.execute(sql, vals)

    @staticmethod
    def get_all(dao):
        sql = "SELECT * FROM elections ORDER BY date DESC;"
        return dao.execute(sql)

    @staticmethod
    def get(dao, election_codes):
        ec = '"' + '","'.join(election_codes) + '"'
        sql = ("SELECT * FROM elections WHERE code IN (%s) "
               "ORDER BY date;") % (ec,)
        return dao.execute(sql)

    @staticmethod
    def get_dict(dao, election_codes=None):
        if election_codes:
            rex = Election.get(dao, election_codes)
        else:
            rex = Election.get_all(dao)
        return {rec['code']: rec for rec in rex}

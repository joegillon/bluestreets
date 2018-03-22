from models.dao import Dao, get_dao


class Precinct(object):

    def __init__(self, d=None):
        self.id = None
        self.county_code = ''
        self.county_name = ''
        self.jurisdiction_code = ''
        self.jurisdiction_name = ''
        self.ward = ''
        self.precinct = ''
        self.state_house = ''
        self.state_senate = ''
        self.congress = ''
        self.county_commissioner = ''
        self.school_precinct = ''
        if d:
            for attr in self.__dict__:
                if attr in d:
                    setattr(self, attr, d[attr])

    def __str__(self):
        return '%s: %s: %s' % (
            self.jurisdiction_code,
            self.ward, self.precinct
        )

    @staticmethod
    @get_dao
    def get_all(dao):
        sql = "SELECT * FROM precincts;"
        return dao.execute(sql)

    @staticmethod
    def get_by_jwp(dao=None):
        if not dao:
            dao = Dao()
        sql = "SELECT * FROM precincts;"
        rex = dao.execute(sql)
        return {('%s:%s:%s' % (rec['jurisdiction_code'], rec['ward'], rec['precinct'])): rec for rec in rex}

    @staticmethod
    def get_by_precinct(dao, d):
        sql = ("SELECT * FROM precincts "
               "WHERE jurisdiction_code=? "
               "AND ward=? "
               "AND precinct=?;")
        vals = [
            d['jurisdiction_code'],
            d['ward'],
            d['precinct']
        ]
        rex = dao.execute(sql, vals)
        return Precinct(rex[0]) if rex else None

    @staticmethod
    def get_jurisdictions(dao):
        sql = "SELECT * FROM jurisdictions ORDER BY name;"
        return dao.execute(sql)

    @staticmethod
    def get_by_jurisdiction(dao, jurisdiction_code):
        sql = "SELECT * FROM precincts WHERE jurisdiction_code=?;"
        vals = (jurisdiction_code,)
        rex = dao.execute(sql, vals)
        return [Precinct(rec) for rec in rex] if rex else []


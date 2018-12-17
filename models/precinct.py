from dao.dao import Dao, get_dao


class Precinct(object):

    db_cols = [
        'county_code', 'jurisdiction_code',
        'ward', 'precinct', 'state_house', 'state_senate',
        'congress', 'county_commissioner', 'school_precinct'
    ]

    def __init__(self, d=None):
        self.id = None
        self.county_code = ''
        self.county_name = ''
        self.jurisdiction_code = ''
        self.jurisdiction_name = ''
        self.ward = ''
        self.precinct = ''
        self.slots = 0
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

    def serialize(self):
        return {
            'id': self.id,
            'jurisdiction_code': self.jurisdiction_code,
            'jurisdiction_name': self.jurisdiction_name,
            'ward': self.ward,
            'precinct': self.precinct,
            'slots': self.slots,
            'state_house': self.state_house,
            'state_senate': self.state_senate,
            'congress': self.congress,
            'county_commissioner': self.county_commissioner,
            'school_precinct': self.school_precinct
        }

    @staticmethod
    @get_dao
    def get_all(dao):
        sql = "SELECT * FROM precincts;"
        rex = dao.execute(sql)
        return [Precinct(rec) for rec in rex] if rex else []

    @staticmethod
    def get_dict(dao):
        precincts = Precinct.get_all(dao)
        return {p.id: p for p in precincts}

    @staticmethod
    def get_by_jwp(dao):
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

    @staticmethod
    @get_dao
    def add(dao, d):
        sql = "INSERT INTO precincts (%s) VALUES (%s)" % (
            ','.join(Precinct.db_cols), dao.get_param_str(Precinct.db_cols)
        )
        vals = [
            d['county_code'],
            d['jurisdiction_code'],
            d['ward'], d['precinct'],
            d['state_house'], d['state_senate'], d['congress'],
            d['county_commissioner'], d['school_precinct']

        ]
        return dao.execute(sql, vals)

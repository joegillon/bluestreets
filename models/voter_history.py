class VoterHistory(object):

    def __init__(self, d=None):
        self.voter_id = None
        self.county_code = None
        self.jurisdiction_code = None
        self.school_code = None
        self.election_code = None
        self.absentee_flag = False
        if d:
            self.__from_dict(d)

    def __from_dict(self, d):
        self.voter_id = d['voter_id']
        self.county_code = d['county_code']
        self.jurisdiction_code = d['jurisdiction_code']
        self.school_code = d['school_code']
        self.election_code = d['election_code']
        self.absentee_flag = d['absentee_flag']

    def __str__(self):
        return '%s: %s' % (self.voter_id, self.election_code)

    @staticmethod
    def get_for_voter(dao, voter_id, election_codes):
        sql = ("SELECT election_code, election_date, election_description, absentee_flag, ballot "
               "FROM voter_history "
               "WHERE voter_id=? "
               "AND election_code in (%s)"
               "ORDER BY election_date DESC") % (
            dao.get_param_str(election_codes),
        )
        vals = [voter_id] + election_codes
        rex = dao.execute(sql, vals)
        return {rec['election_code']: rec for rec in rex} if rex else {}

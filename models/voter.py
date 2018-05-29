from models.dao import Dao
from models.person_name import PersonName
from models.address import Address
from utils.match import MatchLib


class Voter(object):

    # attrs = [
    #     'id', 'name', 'address', 'turf',
    #     'birth_year', 'gender'
    # ]

    colnames = [
        'Last Name', 'first Name', 'Middle', 'Suffix',
        'Address', 'City', 'Zip', 'Gender', 'Birth Year',
        'Party', 'Voter ID', 'Reg Date', 'Perm Abs',
        'Status', 'UOCAVA'
    ]

    def __init__(self, d=None):
        self.id = None
        self.name = None
        self.address = None
        self.birth_year = None
        self.gender = None
        self.voter_id = None
        self.reg_date = None
        self.perm_abs = None
        self.status = None
        self.uocava = None
        self.ballot = None
        if d:
            for attr in self.__dict__:
                if attr in d:
                    setattr(self, attr, d[attr])
            self.name = PersonName(d)
            self.address = Address(d)

    def __str__(self):
        return str(self.name)

    def serialize(self):
        d = {
            'voter_id': self.voter_id,
            'name': self.name.serialize(),
            'address': self.address.serialize(),
            'precinct_id': self.address.precinct_id,
            'birth_year': self.birth_year,
            'gender': self.gender,
            'reg_date': self.reg_date,
            'perm_abs': self.perm_abs if self.perm_abs else 'N',
            'status': self.status,
            'uocava': self.uocava
        }
        if 'score' in self.__dict__:
            d['score'] = self.__dict__['score']
        return d

    @staticmethod
    def voters_by_name_and_address(dao, addr, pn):
        sql = ("SELECT * FROM voters "
               "WHERE street_name_meta LIKE ? "
               "AND street_name LIKE ? "
               "AND house_number BETWEEN ? AND ? "
               "AND last_name_meta = ? "
               "AND last_name LIKE ?;")
        vals = (
            addr.metaphone + '%',
            addr.street_name[0] + '%',
            addr.block[0], addr.block[1],
            pn.last_meta,
            pn.last[0] + '%'
        )
        rex = dao.execute(sql, vals)
        return [Voter(rec) for rec in rex] if rex else []

    @staticmethod
    def lookup(dao, params):
        pn = PersonName(params)
        if 'address' in params and params['address']:
            addr = Address(params)
            matches = Voter.voters_by_name_and_address(dao, addr, pn)
        else:
            matches = Voter.__voters_by_name(dao, pn)
        return matches

    @staticmethod
    def __voters_by_location(dao, addr, letter):
        sql = ("SELECT * FROM voters "
               "WHERE street_name_meta LIKE %s "
               "AND street_name LIKE %s "
               "AND house_number BETWEEN %s AND %s "
               "AND last_name LIKE %s;")
        vals = (
            addr.metaphone + '%',
            addr.street_name[0] + '%',
            addr.block[0],
            addr.block[1],
            letter + '%'
        )
        rex = dao.execute(sql, vals)
        return [Voter(rec) for rec in rex] if rex else []

    @staticmethod
    def __voters_by_name(dao, pn):
        candidates = Voter.__get_candidates_by_name(dao, pn)
        candidates_by_name = {str(candidate.name): candidate for candidate in candidates}
        names = [str(candidate.name) for candidate in candidates]
        matches = MatchLib.get_best_partials(str(pn), names, 75)
        return [candidates_by_name[match] for match in matches]

    @staticmethod
    def __get_candidates_by_name(dao, pn):
        sql = ("SELECT * "
               "FROM voters "
               "WHERE last_name_meta=? "
               "AND last_name LIKE ? "
               "AND first_name LIKE ?")
        vals = [
            pn.last_meta,
            pn.last[0] + '%',
            pn.first[0] + '%'
        ]
        rex = dao.execute(sql, vals)
        return [Voter(rec) for rec in rex] if rex else []

    @staticmethod
    def get_one(dao, voter_id):
        sql = "SELECT * FROM voters WHERE voter_id=?;"
        vals = (voter_id,)
        rex = dao.execute(sql, vals)
        if not rex:
            return None
        return Voter(rex[0])

    @staticmethod
    def get_by_name(dao, pn):
        sql = ("SELECT * FROM voters "
               "WHERE last_name=? "
               "AND first_name=? ")
        vals = [pn.last, pn.first]
        if pn.middle:
            sql += "AND middle_name=? "
            vals.append(pn.middle)
        if pn.suffix:
            sql += "AND name_suffix=?"
            vals.append(pn.suffix)
        rex = dao.execute(sql, vals)
        return [Voter(rec) for rec in rex]

    @staticmethod
    def get_voter(dao, voter_id):
        from models.election import Election
        from models.voter_history import VoterHistory

        sql = "SELECT * FROM voters WHERE voter_id=?;"
        vals = (voter_id,)
        rex = dao.execute(sql, vals)
        if not rex:
            return None
        voter_rec = rex[0]

        elections = Election.get(dao)
        election_codes = [election['code'] for election in elections]

        voter_elections = VoterHistory.get_for_voter(dao, voter_rec['voter_id'], election_codes)
        for election in elections:
            code = 'N'
            if election['code'] in voter_elections:
                code = voter_elections[election['code']]['ballot'] \
                    if voter_elections[election['code']]['ballot'] else 'Y'
                if voter_elections[election['code']]['absentee_flag'] == 'Y':
                    code += 'A'
            voter_rec[election['date']] = code

        return voter_rec

    @staticmethod
    def batch_lookup(submissions):
        from models.street_index import StreetIndex
        from models.dao import Dao

        dao = Dao(stateful=True)

        for submission in submissions:
            # print(str(submission.name))
            street = '%s %s' % (
                submission.address.street_name,
                submission.address.street_type
            )
            if submission.address.metaphone:
                voters = Voter.__get_by_location(dao, submission)
                if voters:
                    streets = set([voter.address.street_name for voter in voters])
                    matches = MatchLib.get_best_partials(street, streets, 85)
                    voters = [voter for voter in voters if voter.address.street_name in matches]
                    voters_by_name = {str(voter.name): voter for voter in voters}
                    names = [str(voter.name) for voter in voters]
                    matches = MatchLib.get_best_partials(str(submission.name), names, 65)
                    if matches:
                        submission.matches = [voters_by_name[match] for match in matches]
                        top_score = 0
                        for match in submission.matches:
                            Voter.__set_match_score(submission, match)
                            if match.score > top_score:
                                top_score = match.score
                        if top_score < 65:
                            voters = []
                        else:
                            continue
            voters = Voter.__get_by_name(dao, submission)
            if voters:
                if submission.address.street_name:
                    streets = set([voter.address.street_name for voter in voters])
                    matches = MatchLib.get_best_partials(street, streets, 85)
                    submission.matches = [voter for voter in voters if voter.address.street_name in matches]
                else:
                    submission.matches = voters
            if not submission.matches:
                if StreetIndex.is_valid_address(submission.address):
                    submission.matches = Voter.__get_household(dao, submission)

            for match in submission.matches:
                Voter.__set_match_score(submission, match)

        dao.close()

    @staticmethod
    def __get_by_location(dao, submission):
        sql = ("SELECT * FROM voters "
               "WHERE street_name_meta LIKE ? "
               "AND street_name LIKE ? "
               "AND house_number BETWEEN ? AND ? "
               "AND last_name LIKE ?;")
        vals = (
            submission.address.metaphone + '%',
            submission.address.street_name[0] + '%',
            submission.address.block[0],
            submission.address.block[1],
            submission.name.last[0] + '%'
        )
        rex = dao.execute(sql, vals)
        return [Voter(rec) for rec in rex] if rex else []

    @staticmethod
    def __get_by_name(dao, submission):
        candidates = Voter.__get_candidates_name_only(dao, submission)
        candidates_by_name = {str(candidate.name): candidate for candidate in candidates}
        names = [str(candidate.name) for candidate in candidates]
        matches = MatchLib.get_best_partials(str(submission.name), names, 75)
        return [candidates_by_name[match] for match in matches]

    @staticmethod
    def __get_candidates_name_only(dao, submission):
        pn = submission.name
        addr = submission.address
        sql = ("SELECT * "
               "FROM voters "
               "WHERE last_name_meta=? "
               "AND last_name LIKE ? "
               "AND first_name_meta=? "
               "AND first_name LIKE ?")
        vals = [
            MatchLib.get_single(pn.last),
            pn.last[0] + '%',
            MatchLib.get_single(pn.first),
            pn.first[0] + '%'
        ]
        if addr.zipcode:
            sql += " AND zipcode LIKE ?"
            vals.append(addr.zipcode[0:4] + '%')
        elif addr.city:
            sql += " AND city=?"
            vals.append(addr.city)
        rex = dao.execute(sql, vals)
        return [Voter(rec) for rec in rex] if rex else []

    @staticmethod
    def __get_household(dao, submission):
        if not submission.address.metaphone:
            return []
        sql = ("SELECT * "
               "FROM voters "
               "WHERE street_name_meta LIKE ? "
               "AND street_name LIKE ? "
               "AND house_number=? "
               "ORDER BY last_name, first_name, middle_name;")
        vals = [
            submission.address.metaphone + '%',
            submission.address.street[0] + '%',
            submission.address.house_number
        ]
        rex = dao.execute(sql, vals)
        return [Voter(rec) for rec in rex] if rex else []

    @staticmethod
    def __set_match_score(submission, match):
        from fuzzywuzzy import fuzz

        possible = 100
        score = fuzz.ratio(str(submission.name), str(match.name))
        if score >= 50:
            if submission.address.street_name:
                possible += 100
                score += fuzz.ratio(str(submission.address), str(match.address))
            if submission.address.city:
                possible += 100
                score += fuzz.ratio(submission.address.city, match.address.city)
            if submission.address.zipcode:
                possible += 100
                score += fuzz.ratio(submission.address.zipcode, match.address.zipcode)
        match.score = int(score / possible * 100)

    @staticmethod
    def get_by_block(dao, block, elections=None):

        sql = ("SELECT * "
               "FROM voters "
               "WHERE precinct_id=? "
               "AND street_name=? "
               "AND street_type=? ")
        vals = [
            block['precinct_id'],
            block['street_name'],
            block['street_type']
        ]
        if block['low_addr']:
            sql += "AND house_number BETWEEN ? AND ? "
            vals += [
                block['low_addr'],
                block['high_addr']
            ]
        if block['odd_even']:
            if block['odd_even'] == 'O':
                sql += "AND (house_number % 2)=1 "
            elif block['odd_even'] == 'E':
                sql += "AND (house_number % 2)=0 "

        sql += "ORDER BY house_number;"

        voters = dao.execute(sql, vals)
        if not voters:
            return []

        if elections:
            from models.voter_history import VoterHistory

            election_codes = [election['code'] for election in elections]

            for voter in voters:
                voter_elections = VoterHistory.get_for_voter(dao, voter['voter_id'], election_codes)
                for election in elections:
                    code = 'N'
                    if election['code'] in voter_elections:
                        code = voter_elections[election['code']]['ballot'] \
                            if voter_elections[election['code']]['ballot'] else 'Y'
                        if voter_elections[election['code']]['absentee_flag'] == 'Y':
                            code += 'A'
                    voter[election['date']] = code

        return voters

    @staticmethod
    def get_by_precinct(precinct_id):
        flds = Voter.__fldnames + Voter.__hx_fldnames
        sql = ("SELECT flds FROM voters AS v "
               "JOIN voter_history AS h "
               "ON v.voter_id=h.voter_id "
               "WHERE v.precinct_id=%s "
               "ORDER BY street_name, street_type, house_number;") % (
            ','.join(flds)
        )
        vals = (precinct_id,)
        dao = MySqlDao()
        return dao.execute(sql, vals)

    __fldnames = [
        'v.id AS id',
        'v.last_name AS last_name',
        'v.first_name AS first_name',
        'v.middle_name AS middle_name',
        'v.name_suffix AS name_suffix',
        'v.birth_year AS birth_year',
        'v.gender AS gender',
        'v.house_number AS house_number',
        'v.pre_direction AS pre_direction',
        'v.street_name AS street_name',
        'v.street_type AS street_type',
        'v.suf_direction AS suf_direction',
        'v.unit AS unit',
        'v.city AS city',
        'v.zip AS zip',
        'v.voter_id AS voter_id',
        'v.reg_date AS reg_date',
        'v.permanent_absentee AS permanent_absentee',
        'v.status AS status',
        'v.uocava AS uocava'
    ]

    __hx_fldnames = [
        'h.election_code AS election_code',
        'h.absentee_flag AS absentee_flag',
        'h.ballot AS ballot'
    ]

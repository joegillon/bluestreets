import unittest
from models.voter import Voter


class TestVoter(unittest.TestCase):

    def test_get_by_block(self):
        election_codes = ['102000638','102000648','102000665','31000053']
        block = {
            'precinct_id': 3703,
            'street_name': 'BRUCE',
            'street_type': 'ST',
            'low_addr': '',
            'high_addr': '',
            'odd_even': ''
        }
        voters = Voter.get_by_block(block, election_codes)
        block = {
            'precinct_id': 3703,
            'street_name': 'BRUCE',
            'street_type': 'ST',
            'low_addr': '1001',
            'high_addr': '1033',
            'odd_even': ''
        }
        voters = Voter.get_by_block(block, election_codes)
        block = {
            'precinct_id': 3703,
            'street_name': 'BRUCE',
            'street_type': 'ST',
            'low_addr': '1001',
            'high_addr': '1033',
            'odd_even': 'O',
        }
        voters = Voter.get_by_block(block, election_codes)
        pass

import unittest

from dao.dao import Dao
from models.address import Address
from models.contact import Contact
from models.person_name import PersonName


class TestContact(unittest.TestCase):

    def setUp(self):
        self.dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)

    def tearDown(self):
        self.dao.close()

    def test_get_activists(self):
        rex = Contact.get_activists(self.dao)
        pass

    def test_get_best_voter(self):
        addr = Address({'address': '3000 Newcastle Rd'})
        pn = PersonName({
            'last_name': 'weinblatt',
            'first_name': 'howard'
        })
        contact = Contact()
        contact.name = pn
        contact.address = addr
        voter = Contact.get_best_voter_rec(self.dao, contact)
        pass

    def test_get_best_turf(self):
        contact = Contact()
        contact.address = Address({
            'address': '3000 Newcastle Rd',
            'zipcode': '48105'
        })
        turf = Contact.get_best_turf(self.dao, contact)
        contact.address.zipcode = ''
        contact.address.city = 'ANN ARBOR'
        turf = Contact.get_best_turf(self.dao, contact)
        pass

    def test_clean_turf(self):
        num, unresolved = Contact.assign_precinct(self.dao)
        pass
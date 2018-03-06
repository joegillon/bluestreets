import unittest
from models.contact import Contact
from models.address import Address
from models.location import Location
from models.dao import Dao


class TestLocation(unittest.TestCase):

    def test_get_block(self):
        dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)
        contact = Contact()
        contact.address = Address({'address': '3000 Newcastle Rd'})
        contact.zipcode = '48105'
        block = Location.get_block(dao, contact)
        contact.zipcode = ''
        contact.city = 'ANN ARBOR'
        block = Location.get_block(dao, contact)
        dao.close()
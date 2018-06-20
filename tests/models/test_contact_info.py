import unittest
from models.contact_info import ContactInfo


class TestContact(unittest.TestCase):

    def setUp(self):
        from models.dao import Dao

        self.dao = Dao(db_file='c:/bench/bluestreets/data/26161.db', stateful=True)

    def tearDown(self):
        self.dao.close()

    def test_get_email_matches(self):
        email = 'leocartierjr@gmail.com'
        matches = ContactInfo.get_email_matches(self.dao, email, 100)
        pass
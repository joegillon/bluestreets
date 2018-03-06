from models.person_name import PersonName
from models.address import Address
from models.contact_info import ContactInfo


class Submission(object):

    def __init__(self):
        self.name = None
        self.address = None
        self.contact = None
        self.matches = []

    @staticmethod
    def from_csv(row, cities, with_contact):
        obj = Submission()
        if with_contact:
            obj.name = PersonName({
                'last_name': row[6],
                'first_name': row[7],
                'middle_name': row[8],
                'name_suffix': row[9]
            })
            obj.address = Address({
                'address': row[3],
                'city': row[4],
                'zip': row[5]
            })
            obj.contact = ContactInfo({
                'email': row[0],
                'phone1': row[1],
                'phone2': row[2]
            })
        else:
            obj.name = PersonName({
                'last_name': row[0],
                'first_name': row[1],
                'middle_name': row[2],
                'name_suffix': row[3]
            })
            obj.address = Address({
                'address': row[4],
                'city': row[5],
                'zip': row[6]
            })

        if obj.address.city not in cities:
            obj.set_city_by_zip(cities)

        return obj

    @staticmethod
    def from_web(item, cities):
        if not item['data0']:
            return None
        obj = Submission()
        obj.name = PersonName({
            'last_name': item['data0'],
            'first_name': item['data1'],
            'middle_name': item['data2'],
            'name_suffix': item['data3']
        })
        try:
            obj.address = Address({
                'address': item['data4'],
                'city': item['data5'],
                'zipcode': item['data6']
            })
        except Exception as ex:
            if str(ex).startswith('Unable to parse address'):
                obj.address = Address({
                    'address': "",
                    'city': item['data5'],
                    'zipcode': item['data6']
                })

        if obj.address.city not in cities:
            for city in cities:
                if city['zipcode'] == obj.address.zipcode:
                    obj.address.city = city['name']
                    break

        return obj

    def serialize(self):
        return {
            'name': self.name.serialize() if self.name else None,
            'address': self.address.serialize() if self.address else None,
            'contact': self.contact.serialize() if self.contact else None,
            'matches': [match.serialize() for match in self.matches] if self.matches else None
        }
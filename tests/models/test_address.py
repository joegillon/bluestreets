import unittest
from models.address import Address


class TestAddress(unittest.TestCase):

    def test_init(self):
        d = {'address': '1527 S. Allison St.'}
        addr = Address(d)
        self.assertEqual('1527', addr.house_number)
        self.assertEqual('S', addr.pre_direction)
        self.assertEqual('ALLISON', addr.street_name)
        self.assertEqual('ST', addr.street_type)
        # self.assertEqual('ALLISON STREET', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('O', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((1500, 1599), addr.block)
        self.assertEqual('ALSNSTRT', addr._Address__metaphone)

        d = {'address': '9375 Dexter Pinckney Rd'}
        addr = Address(d)
        self.assertEqual('9375', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('DEXTERPINCKNEY ROAD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('O', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((9300, 9399), addr.block)
        self.assertEqual('TKSTRPNKNRT', addr._Address__metaphone)

        d = {'address': '376 Harbor Way'}
        addr = Address(d)
        self.assertEqual('376', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('HARBOR WAY', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('E', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((300, 399), addr.block)
        self.assertEqual('HRPR', addr._Address__metaphone)

        d = {'address': '52346 N. ANN ARBOR SALINE RD. E.'}
        addr = Address(d)
        self.assertEqual('52346', addr.house_number)
        self.assertEqual('N', addr.pre_direction)
        # self.assertEqual('ANNARBORSALINE ROAD', addr._Address__street)
        self.assertEqual('E', addr.suf_direction)
        self.assertEqual('E', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((52300, 52399), addr.block)
        self.assertEqual('ANRPRSLNRT', addr._Address__metaphone)

        d = {'address': '7658 PURPLEMARTIN WAY'}
        addr = Address(d)
        self.assertEqual('7658', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('PURPLEMARTIN WAY', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('E', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((7600, 7699), addr.block)
        self.assertEqual('PRPLMRTN', addr._Address__metaphone)

        d = {'address': '3070 Whisperwood Dr. #431'}
        addr = Address(d)
        self.assertEqual('3070', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('WHISPERWOOD DRIVE', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('E', addr._Address__odd_even)
        self.assertEqual(431, addr.unit)
        self.assertEqual((3000, 3099), addr.block)
        self.assertEqual('ASPRTTRF', addr._Address__metaphone)

        d = {'address': '4455 Lima Center Rd.'}
        addr = Address(d)
        self.assertEqual('4455', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('LIMACENTER ROAD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('O', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((4400, 4499), addr.block)
        self.assertEqual('LMSNTRRT', addr._Address__metaphone)

        d = {'address': '1146 Rue Willette Blvd'}
        addr = Address(d)
        self.assertEqual('1146', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('RUEWILLETTE BOULEVARD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('E', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((1100, 1199), addr.block)
        self.assertEqual('RLTPLFRT', addr._Address__metaphone)

        d = {'address': '13434 Island Lake'}
        addr = Address(d)
        self.assertEqual('13434', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('ISLANDLAKE', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('E', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((13400, 13499), addr.block)
        self.assertEqual('ALNTLK', addr._Address__metaphone)

        d = {'address': '6690 Northland Dr NE'}
        addr = Address(d)
        self.assertEqual('6690', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('NORTHLAND DRIVE', addr._Address__street)
        self.assertEqual('NE', addr.suf_direction)
        self.assertEqual('E', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((6600, 6699), addr.block)
        self.assertEqual('NR0LNTTRF', addr._Address__metaphone)

        d = {'address': '728 S. Main #204'}
        addr = Address(d)
        self.assertEqual('728', addr.house_number)
        self.assertEqual('S', addr.pre_direction)
        # self.assertEqual('MAIN', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('E', addr._Address__odd_even)
        self.assertEqual(204, addr.unit)
        self.assertEqual((700, 799), addr.block)
        self.assertEqual('MN', addr._Address__metaphone)

        d = {'address': '223 South St. #2'}
        addr = Address(d)
        self.assertEqual('223', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('SOUTH STREET', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('O', addr._Address__odd_even)
        self.assertEqual(2, addr.unit)
        self.assertEqual((200, 299), addr.block)
        self.assertEqual('S0STRT', addr._Address__metaphone)

        d = {'address': '6655 Jackson Rd. #620'}
        addr = Address(d)
        self.assertEqual('6655', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('JACKSON ROAD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('O', addr._Address__odd_even)
        self.assertEqual(620, addr.unit)
        self.assertEqual((6600, 6699), addr.block)
        self.assertEqual('JKSNRT', addr._Address__metaphone)

        d = {'address': '6655 Jackson Rd. # 620'}
        addr = Address(d)
        self.assertEqual('6655', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('JACKSON ROAD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('O', addr._Address__odd_even)
        self.assertEqual(620, addr.unit)
        self.assertEqual((6600, 6699), addr.block)
        self.assertEqual('JKSNRT', addr._Address__metaphone)

        d = {'address': '6655 Jackson Rd. Unit550'}
        addr = Address(d)
        self.assertEqual('6655', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('JACKSON ROAD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('O', addr._Address__odd_even)
        self.assertEqual(550, addr.unit)
        self.assertEqual((6600, 6699), addr.block)
        self.assertEqual('JKSNRT', addr._Address__metaphone)

        d = {'address': '6655 Jackson Rd. Unit 550'}
        addr = Address(d)
        self.assertEqual('6655', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('JACKSON ROAD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('O', addr._Address__odd_even)
        self.assertEqual(550, addr.unit)
        self.assertEqual((6600, 6699), addr.block)
        self.assertEqual('JKSNRT', addr._Address__metaphone)

        d = {'address': '6655 Jackson Rd 641'}
        addr = Address(d)
        self.assertEqual('6655', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('JACKSON ROAD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('O', addr._Address__odd_even)
        self.assertEqual(641, addr.unit)
        self.assertEqual((6600, 6699), addr.block)
        self.assertEqual('JKSNRT', addr._Address__metaphone)

        d = {'address': '150 S. Staebler Rd. Trlr.886'}
        addr = Address(d)
        self.assertEqual('150', addr.house_number)
        self.assertEqual('S', addr.pre_direction)
        # self.assertEqual('STAEBLER ROAD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('E', addr._Address__odd_even)
        self.assertEqual(886, addr.unit)
        self.assertEqual((100, 199), addr.block)
        self.assertEqual('STPLRRT', addr._Address__metaphone)

        d = {'address': '2892 Bay Ridge'}
        addr = Address(d)
        self.assertEqual('2892', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('BAYRIDGE', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('E', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((2800, 2899), addr.block)
        self.assertEqual('PRJ', addr._Address__metaphone)

        d = {'address': '2893 Bay Ridge Rd'}
        addr = Address(d)
        self.assertEqual('2893', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('BAYRIDGE ROAD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('O', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual((2800, 2899), addr.block)
        self.assertEqual('PRJRT', addr._Address__metaphone)

        d = {'address': 'Bay Ridge Rd'}
        addr = Address(d)
        self.assertEqual('', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('BAYRIDGE ROAD', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual(None, addr.block)
        self.assertEqual('PRJRT', addr._Address__metaphone)

        d = {'address': 'COUNTY ROAD 423'}
        addr = Address(d)
        self.assertEqual('', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        # self.assertEqual('COUNTY ROAD 423', addr._Address__street)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual(None, addr.block)
        self.assertEqual('KNTRTFRT0R', addr._Address__metaphone)

        d = {'address': '19TH ST'}
        addr = Address(d)
        self.assertEqual('', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual(None, addr.block)
        self.assertEqual('ANNN0STRT', addr._Address__metaphone)

        d = {'address': 'first ST'}
        addr = Address(d)
        self.assertEqual('', addr.house_number)
        self.assertEqual('', addr.pre_direction)
        self.assertEqual('', addr.suf_direction)
        self.assertEqual('', addr._Address__odd_even)
        self.assertEqual('', addr.unit)
        self.assertEqual(None, addr.block)
        self.assertEqual('ANSTSTRT', addr._Address__metaphone)

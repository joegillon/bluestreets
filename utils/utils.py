class Utils(object):

    @staticmethod
    def init_from_dict(obj, d):
        obj_name = '_%s__' % (type(obj).__name__,)
        props = [p.replace(obj_name, '') for p in vars(obj)]
        for p in props:
            if p in d:
                obj[p] = d[p]

    @staticmethod
    def is_object(v):
        return hasattr(v, '__dict__')

    @staticmethod
    def flatten_obj(obj, d):
        for attr in obj.attrs:
            value = getattr(obj, attr)
            if Utils.is_object(value):
                Utils.flatten_obj(value, d)
            else:
                d[attr] = value

    @staticmethod
    def generate_password():
        import random

        alphabet = "abcdefghijklmnopqrstuvwxyz"
        upperalphabet = alphabet.upper()
        pw_len = 8
        pwlist = []

        for i in range(pw_len // 3):
            pwlist.append(alphabet[random.randrange(len(alphabet))])
            pwlist.append(upperalphabet[random.randrange(len(upperalphabet))])
            pwlist.append(str(random.randrange(10)))
        for i in range(pw_len-len(pwlist)):
            pwlist.append(alphabet[random.randrange(len(alphabet))])

        random.shuffle(pwlist)
        pwstring = "".join(pwlist)

        return pwstring

    @staticmethod
    def to_dict(list):
        return {obj.id: obj for obj in list}

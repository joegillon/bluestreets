import base64
import hashlib
import hmac


def encrypt_password(password):
    signed = get_hmac(password).decode('ascii')
    # return _pwd_context.encrypt(signed)


def get_hmac(password):
    """Returns a Base64 encoded HMAC+SHA512 of the password signed with the salt specified
    by ``SECURITY_PASSWORD_SALT``.

    :param password: The password to sign
    """
    salt = 'fhasdgihwntlgy8f'

    h = hmac.new(encode_string(salt), encode_string(password), hashlib.sha512)
    return base64.b64encode(h.digest())


def encode_string(string):
    if isinstance(string, str):
        string = string.encode('utf-8')
    return string


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

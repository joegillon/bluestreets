class MySqlDao(object):

    host = 'localhost'
    user = 'joe'
    password = 'gumshoe5.'
    schema = 'michigan'

    def __init__(self, stateful=None):
        self.cursor, self.sql, self.params = self.__connect()
        self.__stateful = stateful

    def __connect(self):
        import MySQLdb

        self.db = MySQLdb.connect(
            host=self.host,
            user=self.user,
            passwd=self.password,
            db=self.schema
        )
        return self.db.cursor(), '', []

    def execute(self, sql, params=None):
        self.sql = sql
        self.params = params
        op = self.sql.split(' ', 1)[0].upper()
        if op == 'SELECT':
            result = self.__query()
        elif op == 'INSERT':
            result = self.__add()
        elif op == 'UPDATE':
            result = self.__update()
        elif op == 'DELETE':
            result = self.__drop()
        else:
            result = None
        if self.__stateful:
            return result
        self.db.close()
        return result

    def __query(self):
        if self.params:
            n = self.cursor.execute(self.sql, self.params)
        else:
            n = self.cursor.execute(self.sql)
        if not n:
            return []
        rex = self.cursor.fetchall()
        flds = [d[0] for d in self.cursor.description]
        return [dict(zip(flds, rec)) for rec in rex] if rex else None

    def __add(self):
        self.cursor.execute(self.sql, self.params)
        self.db.commit()
        return self.cursor.lastrowid

    def add_many(self, sql, params):
        self.cursor.executemany(sql, params)
        self.db.commit()

    def __update(self):
        self.cursor.execute(self.sql, self.params)
        self.db.commit()

    def __drop(self):
        self.cursor.execute(self.sql, self.params)
        self.db.commit()

    def close(self):
        self.db.close()

    @staticmethod
    def get_param_str(lst):
        return ('%s,' * len(lst))[0:-1]

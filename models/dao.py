class Dao(object):

    def __init__(self, db_file=None, stateful=None):
        import sqlite3
        from flask import current_app as app

        if db_file:
            self.db = sqlite3.connect(db_file)
        else:
            self.db = sqlite3.connect(app.config['DB_PATH'])
        self.__cursor = self.db.cursor()
        self.__sql = ''
        self.__params = []
        self.__stateful = stateful

    def execute(self, sql, params=None):
        self.__sql = sql
        self.__params = params
        op = self.__sql.split(' ', 1)[0].upper()
        if op == 'SELECT':
            result = self.__query()
        elif op == 'INSERT':
            result = self.__add()
        elif op == 'UPDATE':
            result = self.__update()
        elif op == 'DELETE':
            result = self.__drop()
        elif op == 'PRAGMA':
            return self.__cursor.execute(sql)
        else:
            result = []
        if self.__stateful:
            return result
        self.db.close()
        return result

    def __query(self):
        if self.__params:
            n = self.__cursor.execute(self.__sql, self.__params)
        else:
            n = self.__cursor.execute(self.__sql)
        if not n:
            return []
        rex = self.__cursor.fetchall()
        flds = [d[0] for d in self.__cursor.description]
        return [dict(zip(flds, rec)) for rec in rex] if rex else []

    def __add(self):
        self.__cursor.execute(self.__sql, self.__params)
        self.db.commit()
        return self.__cursor.lastrowid

    def __update(self):
        self.__cursor.execute(self.__sql, self.__params)
        self.db.commit()
        return 1

    def __drop(self):
        self.__cursor.execute(self.__sql, self.__params)
        self.db.commit()
        return 1

    def close(self):
        self.db.close()

    def add_many(self, tbl, flds, values):
        sql = "INSERT INTO %s (%s) VALUES (%s);" % (
            tbl, ','.join(flds), Dao.get_param_str(flds)
        )
        self.__cursor.executemany(sql, values)
        self.db.commit()

    def update_many(self, tbl, flds, values):
        sql = "UPDATE %s SET %s WHERE id=?" % (
            tbl, '=?,'.join(flds) + '=?')
        self.__cursor.executemany(sql, values)
        self.db.commit()

    def get_max_id(self, tbl, id_fld):
        sql = "SELECT MAX(%s) FROM %s;" % (id_fld, tbl)
        value = self.db.cursor().execute(sql).fetchone()[0]
        return value if value else 0

    @staticmethod
    def get_param_str(lst):
        return ('?,' * len(lst))[0:-1]

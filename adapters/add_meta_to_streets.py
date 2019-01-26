if __name__ == '__main__':
    import sqlite3
    from models.address import Address

    cxn = sqlite3.connect('c:/bench/bluestreets/data/26161.db')
    cursor = cxn.cursor()
    sql = ("SELECT DISTINCT street_name "
           "FROM streets "
           "WHERE county_code='81' "
           "ORDER BY street_name")
    names = cursor.execute(sql).fetchall()

    for name in names:
        meta = Address.get_street_meta(name[0])
        # print(name[0] + ": " + meta)
        sql = ("UPDATE streets "
               "SET street_name_meta=? "
               "WHERE street_name=?;")
        vals = (meta, name[0])
        cursor.execute(sql, vals)
        cxn.commit()

    cxn.close()
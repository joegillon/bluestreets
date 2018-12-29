import dao.turf_dao as turf_dao


def get_pcts():
    return turf_dao.get_precincts(dao)


def update_streets():
    for pct in pcts:
        sql = ("UPDATE streets "
               "SET precinct_id = ? "
               "WHERE jurisdiction_code=? "
               "AND ward=? "
               "AND precinct=?")
        vals = (pct['id'], pct['jurisdiction_code'], pct['ward'], pct['precinct'])
        dao.execute(sql, vals)


if __name__ == '__main__':
    from dao.dao import Dao

    dao = Dao(stateful=True, dbpath='c:/bench/bluestreets/data/26161.db')
    pcts = get_pcts()
    update_streets()
    dao.close()


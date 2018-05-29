from abc import ABCMeta, abstractmethod
from enum import Enum, auto
from models.turf import Turf


class TurfLevel(Enum):
    JURISDICTION = auto()
    WARD = auto()
    PRECINCT = auto()
    STREET = auto()
    BLOCK = auto()


class TurfChain:
    """
    Abstract handler for turf queries
    """

    __metaclass__ = ABCMeta

    next = None
    dao = None
    turf_id = None

    def __init(self, dao, turf_id):
        self.dao = dao
        self.turf_id = turf_id

    def set_next(self, next_turf):
        self.next = next_turf
        return self.next

    @abstractmethod
    def get_data(self):
        raise NotImplementedError("You should implement this method.")


class JurisdictionTurf(TurfChain):
    def get_data(self):
        return Turf.get_jurisdictions(self.dao)


class PrecinctTurf(TurfChain):
    def get_data(self):
        return Turf.get_precincts(self.dao)

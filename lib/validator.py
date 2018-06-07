from collections import Iterable

class Item:
    __slots__ = ("name", "dtype", "contents")
    def __init__(self, name, dtype, contents=None):
        self.name = name
        self.dtype = dtype
        self.contents = contents

class InvalidArgTypeException(Exception):
    def __init__(self, arg, etype, atype):
        if type(etype) is type:
            t = etype.__name__
        elif isinstance(etype, Iterable):
            t = " or ".join((i.__name__ for i in etype))
        else:
            raise InvalidArgTypeException("etype", (type, Iterable), type(etype))
        super().__init__(self, "Argument {} must be of type {}, or subtype; {} was given instead.".format(repr(arg), t, atype.__name__))

class Scheme:
    __slots__ = ("required", "optional")
    def __init__(self, required=None, optional=None):
        self.required = []
        self.optional = []
        if required:
            if isinstance(required, Iterable):
                for i in required:
                    self.add(i, True)
            else:
                raise InvalidArgTypeException("required", Iterable, type(required))
        if optional:
            if isinstance(optional, list):
                for i in optional:
                    self.add(i, False)
            else:
                raise InvalidArgTypeException("optional", Iterable, type(required))

    def add(self, item, req=False):
        if isinstance(item, (Item, Scheme)):
            if req:
                self.required.append(item)
            else:
                self.optional.append(item)
        else:
            raise InvalidArgTypeException("item", (Item, Scheme), type(item))


# legacy
def is_valid(scheme, data, strict=False):
    """Validate data structure in compliance with the scheme."""
    if type(scheme) == dict:
        for s in scheme:
            if s in data:
                if type(scheme[s]) == type(data[s]):
                    if type(scheme[s]) in (dict, list, tuple) and not is_valid(scheme[s], data[s], strict):
                        return False
                else:
                    return False
            elif strict:
                return False
        sch = set(scheme) # !!!
        dat = set(data)
        if not sch.intersection(dat).issubset(sch):
            return False
    elif type(scheme) in (list, tuple):
        # scheme depth must be 1
        t = type(scheme[0])
        if t in (dict, list, tuple):
            for d in data:
                if t != type(d) or not is_valid(t, d, strict):
                    return False
        else:
            for d in data:
                if t != type(d):
                    return False
    return True
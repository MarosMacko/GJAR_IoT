from collections.abc import Iterable

class Item:
    __slots__ = ("name", "dtype", "contents")
    # dtype = list => type(contents) = type
    # dtype = dict => type(contents) = Scheme
    def __init__(self, name, dtype, contents=None):
        self.name = name
        self.dtype = dtype
        self.contents = contents
    def __repr__(self):
        return "Item({}, {}, {})".format(self.name, self.dtype.__name__, self.contents)

class InvalidArgTypeException(Exception):
    def __init__(self, arg, expected_type, actual_type):
        if type(expected_type) is type:
            t = expected_type.__name__
        elif isinstance(expected_type, Iterable):
            t = " or ".join((i.__name__ for i in expected_type))
        else:
            raise InvalidArgTypeException("expected_type", (type, Iterable), type(expected_type))
        super().__init__(self, "Argument {} must be of type {}, or subtype; {} was given instead.".format(repr(arg), t, actual_type.__name__))

class Scheme:
    """Scheme of object structure and types of items inside."""
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

    def get_by_name(self, item, req):
        if req:
            for i in self.required:
                if i.name == item:
                    return i
        else:
            for i in self.optional:
                if i.name == item:
                    return i
        return None

    def __repr__(self):
        return "Scheme(required={}, optional={})".format(self.required, self.optional)

def _is_valid_type(item, data):
    if not item.dtype == type(data):
            return False
    if item.dtype == list:
        for j in data:
            if not item.contents == type(j):
                return False
    elif item.dtype == dict:
        if not is_valid(item.contents, data):
            return False
    return True

def is_valid(scheme, data):
    """Validate structure according to the scheme."""
    checked = set()
    for i in scheme.required:
        if not i.name in data:
            return False
        if not _is_valid_type(i, data[i.name]):
            return False
        checked.update(set((i.name,)))
    for i in data:#.keys():
        print(i, checked, i in checked)
        if not i in checked:
            item = scheme.get_by_name(i, False)
            if not item:
                return False
            if not _is_valid_type(item, data[i]):
                return False
    return True

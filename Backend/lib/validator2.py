from collections.abc import Iterable, Mapping

__all__ = ("Item", "List", "Map")

def can_be_instance(item, dtype):
    if isinstance(item, dtype):
        return True
    else:
        # try:
        #     dtype(str(item))
        #     return True
        # except Exception as e:
        #     print(e)
        #     return False
        if dtype == float and isinstance(item, int):
            return True
    return False
        

class Item:
    __slots__ = ("name", "dtype")
    def __init__(self, name:str, dtype:type):
        self.name = name
        self.dtype = dtype

    def __repr__(self):
        return "{}(name={}, dtype={})".format(type(self).__name__, repr(self.name), repr(self.dtype.__name__))

    def validate(self, data):
        return can_be_instance(data, self.dtype)


class List(Item):
    def validate(self, data):
        if not isinstance(data, Iterable):
            return False

        if isinstance(self.dtype, Item):
            return all(map(lambda x: self.dtype.validate(x), data))
        else:
            return all(map(lambda x: can_be_instance(x, self.dtype), data))


class Map(Item):
    __slots__ = ("children",)
    def __init__(self, name:str, children:Iterable, optional:Iterable=None):
        self.name = name
        self.dtype = type(self)
        self.children = children
        self.optional = optional

    def __repr__(self):
        return super().__repr__() \
            + "\n" + "\n".join(map(lambda x: "\n".join(["|- " + l for l in x.splitlines()]),
                                   [repr(c) for c in self.children]))

    def validate(self, data):
        if not isinstance(data, Mapping):
            return False

        keys = list(data.keys())
        
        for item in self.children:
            try:
                d = data[item.name]
            except:
                if item.name in self.optional:
                    continue
                else:
                    return False
            
            if item.validate(d):
                keys.remove(item.name)
            else:
                return False

        if keys:
            return False
        return True


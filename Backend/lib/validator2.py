from typing import Union
from collections.abc import Iterable

class Item():
    __slots__ = ("name", "dtype")
    def __init__(self, name:str, dtype:type):
        self.name = name
        self.dtype = dtype
    def __repr__(self):
        return "{}(name={}, dtype={})".format(type(self).__name__, repr(self.name), self.dtype.__name__)
    def validate(self, value):
        if type(self.dtype) == Union:
            return isinstance(value, self.dtype.__args__)
        else:
            return isinstance(value, self.dtype)


class Tree(Item):
    __slots__ = ("children",)
    def __init__(self, name:str, children:list):
        super().__init__(name, type(self))
        self.children = children
    def __repr__(self):
        return super().__repr__() \
            + "\n" + "\n".join(map(lambda x: "\n".join(["  " + l for l in x.splitlines()]),
                                   [repr(c) for c in self.children]))

    def validate(self, value):
        return isintance(value, Iterable) # and all(###)

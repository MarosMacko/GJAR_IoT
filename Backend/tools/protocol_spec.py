"""
Module: protocol_spec.py

This module loads an API (version specified as argument) and analyzes its validator Scheme,
creating a protocol specification from it.
"""

import sys, os, ast
sys.path.append("..")
from lib.validator import *

def print_item(item, lv):
    ind = "\t" * lv
    if item.dtype == dict:
        print(ind, item.name, ": object")
        print_scheme(item.contents, lv+1)
    elif item.dtype == list:
        print(ind, item.name, ":", item.dtype.__name__, "of", item.contents.__name__)
    else:
        print(ind, item.name, ":", item.dtype.__name__)

def print_scheme(s, lv=1):
    ind = "\t" * lv
    print(ind, "REQUIRED")
    for i in s.required:
        print_item(i, lv+1)
    print(ind, "OPTIONAL")
    for i in s.optional:
        print_item(i, lv+1)

def error(msg):
    print(msg)
    sys.exit(1)

if len(sys.argv) != 2:
    error("Usage: {} <version>".format(sys.argv[0]))

if os.getcwd().endswith("tools"):
    p = os.path.join("..", "lib")
else:
    p = "lib"

fname = os.path.join(os.getcwd(), p, "APIv" + sys.argv[1] + ".py")

if not os.path.isfile(fname):
    error(f"No such file: {fname}")

with open(fname, "r") as _f:
    f = _f.read()

c = ast.parse(f)
m = ast.Module()

for i in range(len(c.body)):
    if isinstance(c.body[i], ast.ClassDef) and c.body[i].name == "api":
        m.body = [c.body[i],]
        break

exec(compile(m, "<module>", "exec"))

schemes = api().schemes
for s in schemes:
    print("SCHEME:", s)
    print_scheme(schemes[s])

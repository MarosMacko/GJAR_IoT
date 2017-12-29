import importlib
import os
from flask import jsonify, abort


apis = {}


def call(version, request):
    if version not in apis:
        if os.path.isfile("lib/APIv" + str(version) + ".py"):
            m = importlib.import_module("lib.APIv" + str(version), "")
            apis[version] = m.api
        else:
            abort(404)
    return apis[version].call(request)

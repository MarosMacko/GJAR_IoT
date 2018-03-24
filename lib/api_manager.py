import importlib, importlib.util
import os
from flask import jsonify, abort


apis = {}

def call(version, request, data):
    if version not in apis:
        print("lib/APIv" + version + ".py", "./lib")
        if os.path.isfile("lib/APIv" + version + ".py"):
            spec = importlib.util.spec_from_file_location("APIv" + version, "lib/APIv" + version + ".py")
            # m = importlib.import_module("APIv" + version)
            m = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(m)
            apis[version] = m.api()
        else:
            abort(404)
    return apis[version].call(request, data)

import time
from flask import jsonify, g

from lib.validator import *
from lib.helper import *

import db

class api():
    def __init__(self,):
        self.schemes = {}
        self.schemes["connect"] = Scheme([Item("id", int)], [Item("token", str)])

        self.schemes["data"] = Scheme([Item("token", str)])
        d = Scheme([Item("time", str)], [Item("temperature", float), Item("humidity", float), Item("noise", int)])
        self.schemes["data"].add(Item("data", dict, d))

        self.schemes["error"] = Scheme([Item("id", int), Item("level", str)], [Item("token", str), Item("error", str)])
        self.schemes["alive"] = Scheme([Item("token", str)])

        self.schemes["view"] = Scheme([Item("room", int)])
        self.schemes["view"].add(Item("time", dict, Scheme(None, [
            Item("time", str),
            Item("time-from", str),
            Item("time-to", str)
        ])), False)
        self.schemes["view"].add(Item("data", list, str))

        self.schemes["auth"] = Scheme([Item("user", str), Item("password", str)])
        self.schemes["command"] = Scheme([Item("token", str), Item("command", str)])

    def call(self, req, data):
        if req in self.schemes and hasattr(self, "api_" + req):
            if is_valid(self.schemes[req], data):
                return getattr(self, "api_" + req)(data)
            else:
                return jsonify(API_fatal("Invalid request."))
        else:
            return jsonify(API_fatal("Unknown request."))

    def api_connect(self, data):
        con = db.get_db()
        c = con.cursor()
        c.execute("INSERT INTO logs VALUES ('{}', null, 'TEST');".format(time.strftime("%Y-%m-%d %H:%M:%S")))
        con.commit()

        if data["id"] == 0:
            return jsonify(API_error("New device. This API currently does not support creating new devices."))
        return jsonify(API_response(id=data["id"]))

    def api_data(self, data):
        return jsonify(API_response(msg="THX."))

    def api_error(self, data):
        print("DEVICE has encountered an error. Printing data:")
        print(data)
        return jsonify(API_response(msg="I hear ya."))

    def api_alive(self, data):
        return jsonify(API_response(command="PONG"))


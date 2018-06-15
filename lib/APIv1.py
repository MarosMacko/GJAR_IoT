import time
from random import randint
from hashlib import sha256
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

        self.last_id = 0
        self.candidates = []

    def call(self, req, data):
        if req in self.schemes and hasattr(self, "api_" + req):
            if is_valid(self.schemes[req], data):
                return getattr(self, "api_" + req)(data)
            else:
                return jsonify(API_fatal("Invalid request."))
        else:
            return jsonify(API_fatal("Unknown request."))

    def api_connect(self, data):
        if "token" in data:
            s = db.select("devices", "*", "dev_id={} and token='{}'".format(data["id"], data["token"]))
            print(s)
            if len(s) == 1:
                db.insert_raw("logs", "'{}', {}, '{}';".format(db.format_time(), data["id"], "Successfull reconnected."))
            else:
                return jsonify(API_error("Invalid token."))
        else:
            if data["id"] == 0:
                if self.last_id == 0:
                    self.last_id = self.get_last()
                self.last_id += 1
                c = (self.last_id, self.create_token())
                self.candidates.append(c)
                return jsonify(API_response(id=c[0], token=c[1]))
            else:
                return jsonify(API_error("Unable to identify. Initiate a new connection."))

    def api_data(self, data):
        d = db.select("devices", "*", "token='{}'".format(data["token"]))
        if len(d) == 1:
            d = d[0]
        else:
            return jsonify(API_error("No such token."))

        dev_id = d[0]
        room_number = d[2]
        t = db.format_time()
        d = ""
        if "temperature" in data:
            d += data["temperature"] + ", "
        else:
            d += "null, "
        if "humidity" in data:
            d += data["humidity"]
        else:
            d += "null"
        db.insert_raw("data", "{}, {}, {}, {}".format(dev_id, room_number, t, d))
        return jsonify(API_message())

    def api_error(self, data):
        print("DEVICE has encountered an error. Printing data:")
        print(data)
        return jsonify(API_response(msg="I hear ya."))

    def api_alive(self, data):
        # TODO: Check the database to see if there are any pending command to be sent to the device.
        return jsonify(API_response(command="PONG"))

    def api_command(self, data):
        if len(db.select("users", "*", "token='{}'".format(data["token"]))) == 1:
            cmd = data["command"].split(" ")
            if not cmd:
                return jsonify(API_fatal("No command supplied."))
            if cmd[0] == "candidates":
                return jsonify(API_response(candidates=self.candidates))
            elif cmd[0] == "approve":
                if len(cmd) == 3 and cmd[1].isdigit() and cmd[2].isdigit():
                    for i in range(len(self.candidates)):
                        if self.candidates[i][0] == cmd[1]:
                            if db.select("devices", "*", "dev_id={}".format(cmd[1])):
                                db.query("update devices set token='{}' where dev_id={};".format(self.candidates[i][1], cmd[1]))
                            else:
                                db.insert_raw("devices", "{}, {}, {}, null".format(self.candidates[i][0], self.candidates[i][1]), cmd[2])
                            return jsonify(API_response())
                    return jsonify(API_error("No such candidate dev_id."))
                else:
                    return jsonify(API_fatal("Invalid query."))
            elif cmd[0] == "room":
                if len(cmd) == 3 and cmd[1].isdigit():
                    db.insert_raw("rooms", "{}, '{}', null".format(cmd[1], cmd[2]))

        else:
            return jsonify(API_error("Unable to authenticate."))

    def get_last(self):
        d = db.select("devices", "dev_id")
        return max(d, key=lambda x: x[0])[0]

    def create_token(self):
        return sha256((db.format_time() + str(randint(0,100)) + self.__name__).encode()).hexdigest()


from flask import jsonify

from lib.validator import is_valid

class api():
    schemes = { "connect": {"id": 0},
                "data": {
                    "id": 0,
                    "token": "",
                    "data": {
                        "time": "", # [01]
                        "temperature": 0.0, # [02]
                        "humidity": 0.0, # [02]
                    }
                },
                "error": {
                    "id": 0,
                    "token": "",
                    "level": "",
                    "error": ""
                },
                "alive": {
                    "id": 0,
                    "token": ""
                },
                "view": {
                    "room": 0,
                    "time-from": "", # [01]
                    "time-to": "", # [01]
                    "data": [""]
                },
                "auth": {
                    "user": "",
                    "password": ""
                },
                "command": {
                    "token": "",
                    "command": ""
                }
                }
    def __init__(self,):
        pass
    def call(self, req, data):
        r = {"module": __name__, "available": req in self.schemes, "data": data}
        if req in self.schemes:
            r["is_valid"] = is_valid(self.schemes[req], data, True)
        return jsonify(r)

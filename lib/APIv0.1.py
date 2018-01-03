from flask import jsonify

from validator import is_valid

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
                }
                }
    def __init__(self,):
        pass
    def call(self, request):
        return jsonify({"module": __name__})

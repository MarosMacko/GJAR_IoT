from flask import jsonify

class api():
    def __init__(self,):
        pass
    def call(self, request):
        return jsonify({"module": __name__})

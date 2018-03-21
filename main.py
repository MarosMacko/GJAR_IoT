#!/usr/bin/python3

import os
from flask import Flask, request, abort, send_from_directory

from lib import api_manager


app = Flask(__name__, static_url_path='/static', static_folder='/var/www/static')

@app.route("/")
def index():
    with open("/var/www/static/index.html", "rb") as f:
        return f.read()
"""
@app.route("/static/<path:path>")
def static_content(path):
    return send_from_directory("/var/www/static/", path)
"""

@app.route("/api/v<version>/<req>", methods=["POST"])
def api_call(version, req):
    #return "Routing " + version + " req " + req
    if request.is_json:
        return api_manager.call(version, req.lower(), request.get_json())
    else:
        return abort(400)

if __name__ == '__main__':
    app.run()

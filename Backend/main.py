#!/usr/bin/python3

import os, time
from getpass import getpass
from flask import Flask, request, abort, send_from_directory, g

from lib import api_manager
from webhook import webhook


app = Flask(__name__, static_url_path='/static', static_folder='/var/www/static')

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = 'iot'
app.config['MYSQL_DATABASE_PASSWORD'] = getpass("Enter database password: ")
app.config['MYSQL_DATABASE_DB'] = 'iot'
app.config['MYSQL_DATABASE_HOST'] = 'localhost'


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
    webhook("Starting server...")
    app.run()

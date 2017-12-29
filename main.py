#!/usr/bin/python3

import os
from flask import Flask, request

from lib import api_manager


app = Flask(__name__)

@app.route("/")
def index():
    return "Welcome!"


@app.route("/api/v<float:version>/<request>")
def api_call(version, request):
    return api_manager.call(version, request)

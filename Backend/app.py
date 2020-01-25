"""GJAR IoT App Module

Module for loading the configurations and creating the application and
database object.

Not to be ran independently.

"""

if __name__ == "__main__":
    print("This module is not supposed to be ran on its own!")
    exit(1)

import yaml
from flask import Flask, request, abort, redirect
from flask_sqlalchemy import SQLAlchemy

from lib.helper import prefer_https_user
from lib import api_manager as v1_manager

app = Flask(__name__)

with open("config.yml") as f:
    conf = yaml.safe_load(f.read())

# MySQL configurations
app.config['MYSQL_DATABASE_USER'] = conf["database"]["user"]
app.config['MYSQL_DATABASE_PASSWORD'] = conf["database"]["password"]
app.config['MYSQL_DATABASE_DB'] = conf["database"]["db"]
app.config['MYSQL_DATABASE_HOST'] = conf["database"]["host"]

# app.config["SQLALCHEMY_DATABASE_URI"] = "mysql://{user}:{password}@{server}/{database}".format( # sqlite for testing
#     user     = app.config["MYSQL_DATABASE_USER"],
#     password = app.config["MYSQL_DATABASE_PASSWORD"],
#     server   = app.config["MYSQL_DATABASE_HOST"],
#     database = app.config["MYSQL_DATABASE_DB"])

app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False


db = SQLAlchemy(app)

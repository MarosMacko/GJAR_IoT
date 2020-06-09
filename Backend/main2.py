#!/usr/bin/python3

"""GJAR IoT Main Loader v2

A more idiomatic Flask version of the app main module, which merely
loads other specialised modules.

"""

import app
import dbv2 # so that DB tables are created if needed


import lib.APIv2

v2 = lib.APIv2.load(app.app, app.db, dbv2)
app.app.register_blueprint(v2)


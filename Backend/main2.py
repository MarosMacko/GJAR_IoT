#!/usr/bin/python3

"""GJAR IoT Main Loader v2

A more idiomatic Flask version of the app main module, which merely
loads other specialised modules.

"""

import app
import dbv2 # so that DB tables are created if needed
import lib.converters

from legacy import bp as v1
import lib.APIv2
import lib.exports

app.app.register_blueprint(v1, url_prefix="/v1")

v2 = lib.APIv2.load(app.app, app.db, dbv2)
app.app.register_blueprint(v2, url_prefix="/v2")

export = lib.exports.load(app.app, app.db, dbv2)
app.app.register_blueprint(export, url_prefix="/export")


if __name__ == '__main__':
    app.app.run()

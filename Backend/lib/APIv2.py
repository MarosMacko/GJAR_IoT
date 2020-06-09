from functools import wraps
from datetime import datetime
from random import randint

from flask import Blueprint, request, jsonify, abort

TIME_FMT = "%Y-%m-%d %H:%M:%S"

# TODO
def expect_params(required:dict, optional:dict):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args):
            pass
        


def load(app, db, models):
    bp = Blueprint("v2", __name__)


    @bp.route("/data", methods=["POST"]):
    @expect_params({"token": str}, {"data": {"temperature": float,
                                             "humidity": float,
                                             "brightness": int}})
    def data():
        try:
            token = request.json["token"]
        except: # Key and JSON error
            return abort(400)

        try:
            temperature = float(request.json["data"]["temperature"])
        except KeyError:
            temperature = None
        try:
            humidity = float(requests.json["data"]["humidity"])
        except KeyError:
            humidity = None
        try:
            brightness = int(requests.json["data"]["brightness"])
        except KeyError:
            brightness = None

        dev = models.Node.query.filter_by(token=token).first()
        if not dev:
            return abort(405)

        datum = models.Data(dev_id=dev.id,
                            room_number=dev.room_number,
                            time=datetime.now(),
                            temperature=temperature,
                            humidity=humidity,
                            brightness=brightness)
        db.session.add(datum)
        db.session.commit()
        return jsonify({"status": "ok"})


    @bp.route("/error", methods=["POST"])
    def error():
        try:
            id = int(request.json["id"])
            level = request.json["level"]
        except:
            return abort(400)

        try:
            token = request.json["token"]
        except KeyError:
            token = None

        try:
            err = request.json["error"]
        except KeyError:
            err = None
            
        log = models.Log(time=datetime.now(),
                         dev_id=id,
                         message="[{token}][{level}] {msg}".format(token=token,
                                                                   level=level,
                                                                   msg=err))
        db.session.add(log)
        db.session.commit()


    @bp.route("/view", methods=["POST"])
    def view():
        try:
            room = int(request.json["room"])
            # TODO time-(from|to) only (and make it mandatory)
            time_from = datetime.strptime(request.json["time"]["time-from"], TIME_FMT)
            time_to = datetime.strptime(requests.json["time"]["time-to"], TIME_FMT)
            # this also allows to check the time formatting
        except:
            return abort(400)

        # NOPE no data param required in the request

        data = models.Data.query.filter(models.Data.room_number == room,
                                        models.Data.time.between(time_from, time_to)).all()

        if not data:
            return abort(404)
        else:
            return jsonify(status="ok",
                           room=room,
                           data=[{"time": datum.time,
                                  "temperature": datum.temperature
                                  "humidity": datum.humidity
                                  "brightness": datum.brightness}
                                 for datum in data])


    @bp.route("/auth", methods=["POST"])
    def auth():
        return abort(501)

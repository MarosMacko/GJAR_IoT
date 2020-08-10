from functools import wraps
from datetime import datetime
from random import randint

from flask import Blueprint, request, jsonify, abort

TIME_FMT = "%Y-%m-%d %H:%M:%S"

def expect_params(required:dict, optional:dict):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args):
            if not request.is_json:
                return abort(400)

            data = request.get_json()

            for k in required.keys():
                try:
                    if not isinstance(data[k], required[k]):
                        return abort(400)
                except KeyError:
                    return abort(400)

            for k in optional.keys():
                try:
                    if not isinstance(data[k], optional[k]):
                        return abort(400)
                except KeyError:
                    pass

            return fn(**data)

        return wrapper
    return decorator
                    


def load(app, db, models):
    bp = Blueprint("v2", __name__)


    @bp.route("/data", methods=["POST"])
    @expect_params({"token": str}, {"temperature": float,
                                    "humidity": float,
                                    "brightness": int})
    def data(token, temperature=None, humidity=None, brightness=None):
        dev = models.Node.query.filter_by(token=token).first()
        if not dev:
            return abort(440)

        datum = models.Data(dev_id=dev.dev_id,
                            room_number=dev.room_number,
                            time=datetime.now(),
                            temperature=temperature,
                            humidity=humidity,
                            brightness=brightness)
        db.session.add(datum)
        db.session.commit()
        return jsonify({"status": "ok"})


    @bp.route("/error", methods=["POST"])
    @expect_params(dict(), {"level": str,
                            "token": str,
                            "error": str})
    def error(level=None, token=None, error=None):
        ip = request.remote_addr
        
        if not level:
            level = "UNKNOWN"

        if not token:
            token = "UNKNOWN"

        if not error:
            error = "UNKNOWN"

        log = models.Log(time=datetime.now(),
                         dev_id=id,
                         message="[{token} @ {ip}][{level}] {msg}".format(token=token,
                                                                          level=level,
                                                                          msg=err,
                                                                          ip=ip))
        db.session.add(log)
        db.session.commit()


    @bp.route("/view", methods=["POST"])
    @expect_params({"room": int,
                    "time_from": str,
                    "time_to": str}, {}) # todo interval or number of results as optional
    def view(room, time_from, time_to):
        try:
            time_from = datetime.strptime(time_from, TIME_FMT)
            time_to = datetime.strptime(time_to, TIME_FMT)
        except:
            return abort(400)

        data = models.Data.query.filter(models.Data.room_number == room,
                                        models.Data.time.between(time_from, time_to)).all()

        if not data:
            return abort(440)
        else:
            return jsonify(status="ok",
                           room=room,
                           data=[{"time": datum.time,
                                  "temperature": datum.temperature,
                                  "humidity": datum.humidity,
                                  "brightness": datum.brightness}
                                 for datum in data])


    @bp.route("/auth", methods=["POST"])
    def auth():
        return abort(501)

    return bp

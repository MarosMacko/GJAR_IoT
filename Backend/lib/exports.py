from datetime import datetime, timedelta
from io import BytesIO
from flask import Blueprint, request, jsonify, abort, send_file

from .errors import *

TIME_FMT = "%Y-%m-%d %H:%M:%S"
DATE_FMT = "%Y-%m-%d"


def remove_nulls(data:dict):
    for k in data.keys():
        if data[k] is None:
            data[k] = ""
    return data


def csv_response(data, filename, include_room=False):
    if include_room:
        fil = b"room_number,time,temperature,humidity,brightness\n" \
            + b"\n".join([("{room_number},{time},{temperature},{humidity},{brightness}"
                           .format(**remove_nulls({"room_number": datum.room_number,
                                                   "time": datum.time.strftime(TIME_FMT),
                                                   "temperature": datum.temperature,
                                                   "humidity": datum.humidity,
                                                   "brightness": datum.brightness}))
                           .encode())
                          for datum in data])
    else:
        fil = b"time,temperature,humidity,brightness\n" \
            + b"\n".join([("{time},{temperature},{humidity},{brightness}"
                           .format(**remove_nulls({"time": datum.time.strftime(TIME_FMT),
                                                   "temperature": datum.temperature,
                                                   "humidity": datum.humidity,
                                                   "brightness": datum.brightness}))
                           .encode())
                          for datum in data])

    return send_file(BytesIO(fil),
                     mimetype="text/csv",
                     as_attachment=True,
                     attachment_filename=filename)


def export_name(room_number, time_from, time_to):
    room_sig = "all" if room_number is None else "room-" + str(room_number)
    if time_from is None: # and time_to is then None as well
        time_sig = "all"
    else:
        if time_to == time_from + timedelta(days=1):
            time_sig = time_from.strftime(DATE_FMT)
        else:
            time_sig = "{}--{}".format(time_from.strftime(DATE_FMT),
                                       time_to.strftime(DATE_FMT))
        
    return "gjar-iot-{}-{}.csv".format(room_sig, time_sig)


def load(app, db, models):

    def general_export(room_number, time_from, time_to):
        conditions = []
        if room_number is not None:
            conditions.append(models.Data.room_number == room_number)

        if not (time_from is None or time_to is None):
            conditions.append(models.Data.time.between(time_from, time_to))

        if not conditions:
            data = models.Data.query.all()
        else:
            data = models.Data.query.filter(*conditions).all()

        if not data:
            if room_number is not None and not models.Room.query.get(room_number):
                return abort(RoomNotFoundException())
            else:
                return abort(NoDataException())

        return csv_response(data,
                            export_name(room_number, time_from, time_to),
                            room_number is None) # whether to include room numbers

    
    bp = Blueprint("export", __name__)

    
    @bp.route("/<int:room_number>", methods=["GET"])
    def export_single_all(room_number):                    
        return general_export(room_number, None, None)


    @bp.route("/all", methods=["GET"])
    def export_all_all():
        return general_export(None, None, None)


    @bp.route("/<int:room_number>/<date:day>", methods=["GET"])
    def export_single_single(room_number, day):
        return general_export(room_number, day, day + timedelta(days=1))


    @bp.route("/all/<date:day>", methods=["GET"])
    def export_all_single(day):
        return general_export(None, day, day + timedelta(days=1))


    @bp.route("/<int:room_number>/<date:start>/<date:end>", methods=["GET"])
    def export_single_range(room_number, start, end):
        return general_export(room_number, start, end)


    @bp.route("/all/<date:start>/<date:end>", methods=["GET"])
    def export_all_range(start, end):
        return general_export(None, start, end)

    return bp


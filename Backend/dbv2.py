from sqlalchemy.dialects.mysql import TINYINT, FLOAT

import app
_db = app.db


class User(_db.Model):
    __tablename__ = "users"
    name = _db.Column(_db.String(25), primary_key=True)
    email = _db.Column(_db.String(50))
    password = _db.Column(_db.String(64))
    salt = _db.Column(_db.String(32))
    token = _db.Column(_db.String(64), unique=True)


class Room(_db.Model):
    __tablename__ = "rooms"
    room_number = _db.Column(TINYINT(3, unsigned=True), primary_key=True)
    room_name = _db.Column(_db.String(20))
    floor = _db.Column(TINYINT(1, unsigned=True))


class Node(_db.Model):
    __tablename__ = "devices"
    dev_id = _db.Column(TINYINT(3, unsigned=True), primary_key=True, autoincrement=True)
    token = _db.Column(_db.String(64), unique=True)
    room_number = _db.Column(TINYINT(3, unsigned=True), _db.ForeignKey(Room.room_number))
    last_heartbeat = _db.Column(_db.DateTime)


class Data(_db.Model):
    __tablename__ = "data"
    dev_id = _db.Column(TINYINT(3, unsigned=True), _db.ForeignKey(Node.dev_id))
    room_number = _db.Column(TINYINT(3, unsigned=True), _db.ForeignKey(Room.room_number), primary_key=True)
    time = _db.Column(_db.DateTime, primary_key=True)
    temperature = _db.Column(FLOAT(7,4))
    humidity = _db.Column(FLOAT(8,4))
    brightness = _db.Column(TINYINT(3, unsigned=True))


class Log(_db.Model):
    __tablename__ = "logs"
    time = _db.Column(_db.DateTime, primary_key=True)
    dev_id = _db.Column(TINYINT(3, unsigned=True), primary_key=True, nullable=True)
    message = _db.Column(_db.Text)


_db.create_all()

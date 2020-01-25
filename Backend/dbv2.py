import app
_db = app.db


class User(_db.Model):
    __tablename__ = "users"
    name = _db.Column(_db.String(25), primary_key=True)
    email = _db.Column(_db.String(50))
    password = _db.Column(_db.String(64))
    salt = _db.Column(_db.String(32))
    token = _db.Column(_db.String(64))

class Room(_db.Model):
    __tablename__ = "rooms"
    room_number = _db.Column(_db.Integer, primary_key=True) # TODO: tinyint(3)
    room_name = _db.Column(_db.String(10)) # TODO bigger?
    floor = _db.Column(_db.Integer) # TODO: tinyint(1)

class Node(_db.Model):
    __tablename__ = "devices"
    dev_id = _db.Column(_db.Integer, primary_key=True, autoincrement=True)
    token = _db.Column(_db.String(64))
    room_number = _db.Column(_db.Integer, _db.ForeignKey(Room.room_number))
    last_heartbeat = _db.Column(_db.DateTime)

class Data(_db.Model):
    __tablename__ = "data"
    dev_id = _db.Column(_db.Integer, _db.ForeignKey(Node.dev_id))
    room_number = _db.Column(_db.Integer, _db.ForeignKey(Room.room_number), primary_key=True)
    time = _db.Column(_db.DateTime, primary_key=True)
    temperature = _db.Column(_db.Float) # TODO
    humidity = _db.Column(_db.Float)
    brightness = _db.Column(_db.Integer)

class Log(_db.Model):
    __tablename__ = "logs"
    time = _db.Column(_db.DateTime, primary_key=True)
    dev_id = _db.Column(_db.Integer, primary_key=True, nullable=True)
    message = _db.Column(_db.Text)

_db.create_all()

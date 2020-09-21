from datetime import datetime

from werkzeug.routing import BaseConverter

from app import app


DATE_FMT = "%Y-%m-%d"
TIME_FMT = "%Y-%m-%d %H:%M:%S"

class DateConverter(BaseConverter):
    
    def to_python(self, value):
        return datetime.strptime(value, DATE_FMT)

    def to_url(self, value):
        return value.strftime(DATE_FMT)


class DatetimeConverter(BaseConverter):
    
    def to_python(self, value):
        return datetime.strptime(value, TIME_FMT)

    def to_url(self, value):
        return value.strftime(TIME_FMT)


app.url_map.converters["date"] = DateConverter
app.url_map.converters["datetime"] = DatetimeConverter

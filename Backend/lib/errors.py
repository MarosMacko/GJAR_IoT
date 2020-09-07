"""Custom exceptions."""

import werkzeug.exceptions as ex


class NodeNotFoundException(ex.HTTPException):
    code = 404
    description = 'Requested node not found.'


class RoomNotFoundException(ex.HTTPException):
    code = 404
    description = 'Requested room not found.'


class NoDataException(ex.HTTPException):
    code = 404
    description = "No data."

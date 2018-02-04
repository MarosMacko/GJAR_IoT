import sqlite3

from flask import g

def connect_db():
    """Connects to the specific database."""
    rv = sqlite3.connect("data.db")
    rv.row_factory = sqlite3.Row
    return rv

def get_db():
    if not hasattr(g, 'sqlite_db'):
        g.sqlite_db = connect_db()
    return g.sqlite_db
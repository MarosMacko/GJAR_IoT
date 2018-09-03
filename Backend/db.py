import time
from collections.abc import Sequence
from flaskext.mysql import MySQL

from flask import g, current_app as app

def get_db():
    """Get a database connection. If there isn't one, it will be created"""
    if not hasattr(g, "mysql"):
        mysql = MySQL()
        mysql.init_app(app)
        g.mysql = mysql
    if not hasattr(g, 'db_con'):
        g.db_con = g.mysql.connect()
    return g.db_con

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the application context."""
    if hasattr(g, 'db_con'):
        g.db_con.close()


def insert(table:str, values:Sequence):
    """Insert values into table."""
    raise Exception("Untested function.")
    con = get_db()
    c = con.cursor()
    c.execute("INSERT INTO {} VALUES ({});".format(table, ",".join([repr(v) for v in values])))
    con.commit()

def insert_raw(table:str, values:str):
    """Insert values provided as a single string to table."""
    con = get_db()
    c = con.cursor()
    c.execute("INSERT INTO {} VALUES ({});".format(table, values))
    con.commit()

def select(table:str, col:str, where=None):
    """Select from table."""
    con = get_db()
    c = con.cursor()
    q = "SELECT "
    if isinstance(col, str):
        q += col
    else:
        q += ",".join(col)
    q += " FROM " + table
    if where:
        q += " WHERE " + where
    q += ";"
    c.execute(q)
    return c.fetchall()

def query(q):
    """Run query exacly as provided."""
    con = get_db()
    c = con.cursor()
    c.execute(q)
    con.commit()
    return c.fetchall()


def format_time():
    """Return a time in YYYY-mm-dd HH:MM:SS formatting."""
    return time.strftime("%Y-%m-%d %H:%M:%S")
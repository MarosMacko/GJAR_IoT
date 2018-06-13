from flaskext.mysql import MySQL

from flask import g, current_app as app

def get_db():
    if not hasattr(g, "mysql"):
        mysql = MySQL()
        mysql.init_app(app)
        g.mysql = mysql
    if not hasattr(g, 'db_con'):
        g.db_con = g.mysql.connect()
    return g.db_con

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'db_con'):
        g.db_con.close()


def insert(table, values):
    raise Exception("Untested function.")
    con = get_db()
    c = con.cursor()
    c.execute("INSERT INTO f{table} VALUES ({});".format(",".join([repr(v) for v in values])))
    con.commit()

def insert_raw(table, values):
    con = get_db()
    c = con.cursor()
    c.execute("INSERT INTO f{table} VALUES ({});".format(values))
    con.commit()
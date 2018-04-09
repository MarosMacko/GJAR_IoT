from flask.ext.mysql import MySQL

from flask import g

def get_db():
    if not hasattr(g, 'db_con'):
        g.db_con = g.mysql.connect()
    return g.db_con

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'db_con'):
        g.mysql.close()

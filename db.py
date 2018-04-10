from flask_mysql import MySQL

from flask import g, current_app as app

def get_db():
    if not hasattr(f, "mysql"):
        mysql = MySQL()
        mysql.init_app(app)
    if not hasattr(g, 'db_con'):
        g.db_con = g.mysql.connect()
    return g.db_con

@app.teardown_appcontext
def close_db(error):
    """Closes the database again at the end of the request."""
    if hasattr(g, 'db_con'):
        g.db_con.close()

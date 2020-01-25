from functools import wraps
from flask import request, redirect

def API_error(description):
    """Create an API error message."""
    return {"status": "error", "error": description}

def API_fatal(description):
    """Create an API fatal error message."""
    return {"status": "fatal", "error": description}

def API_response(*args, **kwargs):
    """Create an API response using provided arguments.
    
    Positional arguments: any number of dicts that will be merged into the response.
    
    Keyword arguments: will be merged into the response."""
    r = {"status": "ok"}
    for a in args:
        if type(a) is dict:
            r.update(a)
        else:
            raise Exception("Unsupported arguments")
    if kwargs:
        r.update(kwargs)
    return r

def prefer_https_user(f):
    @wraps(f)
    def w(*args, **kwargs):
        if not request.is_secure and request.headers.get("User-Agent") != "ESP8266HTTPClient":
            url = request.url.replace('http://', 'https://', 1)
            return redirect(url, code=301)
        else:
            return f(*args, **kwargs)
    return w

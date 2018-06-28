def API_error(description):
    return {"status": "error", "error": description}

def API_fatal(description):
    return {"status": "fatal", "error": description}

def API_response(*args, **kwargs):
    r = {"status": "ok"}
    for a in args:
        if type(a) is dict:
            r.update(a)
        else:
            raise Exception("Unsupported arguments")
    if kwargs:
        r.update(kwargs)
    return r

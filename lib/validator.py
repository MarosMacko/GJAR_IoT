def is_valid(scheme, data, strict=False):
    """Validate data structure in compliance with the scheme."""
    if type(scheme) == dict:
        for s in scheme:
            if s in data:
                if type(scheme[s]) == type(data[s]):
                    if type(scheme[s]) in (dict, list, tuple) and not is_valid(scheme[s], data[s], strict):
                        return False
                else:
                    return False
            elif strict:
                return False
        sch = set(scheme) # !!!
        dat = set(data)
        if not sch.intersection(dat).issubset(sch):
            return False
    elif type(scheme) in (list, tuple):
        # scheme depth must be 1
        t = type(scheme[0])
        if t in (dict, list, tuple):
            for d in data:
                if t != type(d) or not is_valid(t, d, strict):
                    return False
        else:
            for d in data:
                if t != type(d):
                    return False
    return True
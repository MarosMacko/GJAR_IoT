from os.path import isfile
from json import JSONDecoder, JSONEncoder
from requests import post

_dec = JSONDecoder()
_enc = JSONEncoder()
url = ""
host = ""

if isfile("webhook.json"):
    with open("webhook.json", "r") as f:
        data = _dec.decode(f.read())
    url = data["url"]
    host = data["host"]

def webhook(msg):
    if not url:
        print("No webhook data.")
        return
    if host:
        obj = {"content": "Server at {}: {}".format(host, msg)}
    else:
        obj = {"content": "Unidentified server: {}".format(msg)}
    post(url, json=_enc.encode(obj))

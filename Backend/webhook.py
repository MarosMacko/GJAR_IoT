import json
from os.path import isfile
from requests import post

url = ""
host = ""

if isfile("webhook.json"):
    with open("webhook.json", "r") as f:
        data = json.loads(f.read())
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
    post(url, json=obj)

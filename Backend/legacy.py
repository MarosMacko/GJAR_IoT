"""Legacy (v1) code for backward compatibility."""

from flask import request, abort, redirect, Blueprint
from lib import api_manager


bp = Blueprint("v1", __name__)

@bp.route("/<req>", methods=["POST"])
def api_call(req):
    if not request.is_secure and request.headers.get("User-Agent") != "ESP8266HTTPClient":
        url = request.url.replace('http://', 'https://', 1)
        return redirect(url, code=301)
    
    if request.is_json:
        return api_manager.call(version, req.lower(), request.get_json())
    else:
        return abort(400)

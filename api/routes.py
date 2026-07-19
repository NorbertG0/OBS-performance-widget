from flask import Blueprint, jsonify
from monitor import stats

api = Blueprint('api', __name__)

@api.route("/stats")
def get_stats():
    return jsonify(stats)


"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/create_user', methods=['POST'])
def create_user():
    data = request.get_json()
    email    = data.get("email", "").strip()
    password = data.get("password", "").strip()

    if not email or not password:
        return jsonify({"error":"No llegó toda la info"}),400

    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"error":"ya hay un usuario con ese email"}),409
    
    new_user = User(email=email, password=password,is_active = True)
    db.session.add(new_user)
    db.session.commit()

    new_user_to_share = new_user.serialize()

    return jsonify({"mensage":"Un éxito", "user":new_user_to_share}),201
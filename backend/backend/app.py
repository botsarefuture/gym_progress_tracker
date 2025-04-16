
from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo import MongoClient
import os
from bson import ObjectId

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
jwt = JWTManager(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['gym_tracker']
users_collection = db['users']
workouts_collection = db['workouts']

@app.route('/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    password_hash = generate_password_hash(data['password'])
    new_user = {
        'username': data['username'],
        'password': password_hash,
        'email': data['email']
    }
    users_collection.insert_one(new_user)
    return jsonify({"msg": "User created"}), 201

@app.route('/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    user = users_collection.find_one({'username': data['username']})
    if user and check_password_hash(user['password'], data['password']):
        access_token = create_access_token(identity=user['username'])
        return jsonify(access_token=access_token)
    return jsonify({"msg": "Invalid credentials"}), 401

@app.route('/workouts', methods=['POST'])
@jwt_required()
def log_workout():
    data = request.get_json()
    username = data['username']
    workout_data = {
        'exercise': data['exercise'],
        'sets': data['sets'],
        'reps': data['reps'],
        'weight': data['weight'],
        'date': data['date']
    }
    workouts_collection.insert_one(workout_data)
    return jsonify({"msg": "Workout logged successfully"}), 201
def _jsonify_objectids(obj_list):
    """
    Convert ObjectId fields in a list of dicts to strings.

    Parameters
    ----------
    obj_list : list
        List of dictionaries possibly containing ObjectId fields.

    Returns
    -------
    list
        List of dictionaries with ObjectId fields converted to strings.
    """
    for obj in obj_list:
        if isinstance(obj, dict):
            for key, value in obj.items():
                if isinstance(value, ObjectId):
                    obj[key] = str(value)
    return obj_list

@app.route('/workouts', methods=['GET'])
@jwt_required()
def get_workouts():
    workouts = _jsonify_objectids(list(workouts_collection.find()))
    return jsonify(workouts)

if __name__ == '__main__':
    app.run(debug=True)
    
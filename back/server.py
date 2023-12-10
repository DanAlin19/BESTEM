from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
from jwt import encode
import datetime

app = Flask(__name__)
CORS(app)

client = MongoClient('mongodb://localhost:27017/')
db = client['bestem']
users_collection = db['users']

SECRET_KEY = 'secretdiscret'

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    token = encode(payload, SECRET_KEY, algorithm='HS256')
    return token

@app.route('/register_user', methods=['POST'])
def register_user():
    try:
        data = request.get_json()

        users_collection.insert_one({
            'email': data['email'],
            'password': data['password']
        })

        return jsonify({'message': 'success'})
    except Exception as e:
        return jsonify({'message': 'error', 'error': str(e)})

@app.route('/get_all_users', methods=['GET'])
def get_all_users():
    try:
        users = list(users_collection.find({}, {'_id': False}))

        users_json = json_util.dumps(users)
        return jsonify({'users': users_json})
    
    except Exception as e:
        return jsonify({'message': 'error', 'error': str(e)})

@app.route('/login_user', methods=['POST'])
def login_user():
    try:
        data = request.get_json()

        if 'email' not in data or 'password' not in data:
            return jsonify({'message': 'error', 'error': 'Email and password are required'})

        user = users_collection.find_one({'email': data['email'], 'password': data['password']}, {'_id': False})

        if user:
            token = generate_token(str(user.get('_id')))
            return jsonify({'token': token})
        else:
            return jsonify({'message': 'error', 'error': 'Invalid email or password'})

    except Exception as e:
        return jsonify({'message': 'error', 'error': str(e)})


@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host='207.154.232.144', port=5001)

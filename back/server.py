from flask import Flask, request, jsonify, url_for, redirect, session
from flask_cors import CORS
from pymongo import MongoClient
from bson import json_util
from jwt import encode
import datetime
from jwt import decode, ExpiredSignatureError
import os
import subprocess
# from authlib.integrations.flask_client import OAuth

app = Flask(__name__)
# app.secret_key = 'random_secret'

# oath = OAuth()
CORS(app)
# google = oath.register(
#     name='google',
#     client_id='',
#     client_secret='',
#     access_token_url='https://accounts.google.com/o/oauth2/token',
#     access_token_params=None,
#     authorize_url='https://accounts.google.com/o/oauth2/auth',
#     authorize_params=None,
#     api_base_url='https://www.googleapis.com/oauth2/v1/',
#     client_kwargs={'scope': 'openid email profile'},
# )

client = MongoClient('mongodb://localhost:27017/')
db = client['bestem']
users_collection = db['users']
devices_collection = db['devices']

SECRET_KEY = 'secretdiscret'

# @app.route('/login')
# def login():
#     google = oauth.create_client('google')
#     redirect_uri = url_for('authorize', _external=True)
#     return google.authorize_redirect(redirect_uri)

# @app.route('/authorize')
# def authorize():
#     google = oauth.create_client('google')
#     token = google.authorize_access_token()
#     resp = google.get('userinfo')
#     resp.raise_for_status()
#     user_info = resp.json()
#     # do something with the token and profile
#     return redirect('/')

def generate_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
    }
    token = encode(payload, SECRET_KEY, algorithm='HS256')
    return token

def get_latestID():
    try:
        users = list(users_collection.find({}, {'_id': False}))
        return users[-1]['id'] + 1
    except:
        return 0

@app.route('/register_user', methods=['POST'])
def register_user():
    try:
        data = request.get_json()

        users_collection.insert_one({
            'id': get_latestID(),
            'email': data['email'],
            'password': data['password'],
            'devices': []
        })

        return jsonify({'message': 'success'})
    except Exception as e:
        return jsonify({'message': 'error', 'error': str(e)})

@app.route('/get_Userdevices', methods=['POST'])
def get_Userdevices():
    try:
        
        data = request.get_json()
        token = data.get('token')

        if not token:
            return jsonify({'message': 'error', 'error': 'Token is required'})

        try:
            decoded_token = decode(token, SECRET_KEY, algorithms=['HS256'])
            user_id = decoded_token['user_id']
        except ExpiredSignatureError:
            return jsonify({'message': 'error', 'error': 'Token has expired'})
        except Exception as e:
            return jsonify({'message': 'error', 'error': str(e)})

        user = users_collection.find_one({'id': user_id}, {'_id': False})

        if not user:
            return jsonify({'message': 'error', 'error': 'User not found'})

        user_devices = list(devices_collection.find({'user_id': user_id}, {'_id': False}))

        devices_data = []
        for device in user_devices:
            devices_data.append({
                'device_id': device['id'],
                'nume': device['nume'],
                'IpAddress': device['IpAddress'],
                'Publickey': device['Publickey']
            })

        return jsonify({'devices': devices_data})
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

@app.route('/delete_users', methods=['DELETE'])
def delete_users():
    try:
        users_collection.delete_many({})
        return jsonify({'message': 'success'})
    except Exception as e:
        return jsonify({'message': 'error', 'error': str(e)})

@app.route('/login_user', methods=['POST'])
def login_user():
    try:
        data = request.get_json()

        if 'email' not in data or 'password' not in data:
            return jsonify({'message': 'error', 'error': 'Email and password are required'})

        user = users_collection.find_one({'email': data['email'], 'password': data['password']},
            {'_id': False, 'password': False})

        if user:
            token = generate_token(user['id'])
            return jsonify({'token': token})
        else:
            return jsonify({'message': 'error', 'error': 'Invalid email or password'})

    except Exception as e:
        return jsonify({'message': 'error', 'error': str(e)})
    
def get_latestID_device():
    try:
        devices = list(devices_collection.find({}, {'_id': False}))
        return devices[-1]['id'] + 1
    except:
        return 0
    
def incrementIP():
    devices = list(devices_collection.find({}, {'_id': False}))
    num = list(map(int,devices[-1]['IpAddress'].split('.')))
    num[3] += 1
    for i in range(3, 0, -1):
        if num[i] == 256:
            num[i] = 0
            num[i-1] += 1
    result_string = ".".join(map(str, num))
    return result_string
        

def gen_keys():
    os.umask(0o077)
    private_key_generation = subprocess.run(["wg", "genkey"], stdout=subprocess.PIPE, text=True)
    private_key = private_key_generation.stdout.strip()

    # Derive WireGuard public key from the generated private key
    public_key_generation = subprocess.run(["wg", "pubkey"], input=private_key, stdout=subprocess.PIPE, text=True)
    public_key = public_key_generation.stdout.strip()

    return private_key, public_key

def update_wg_conf(allowed_ips, public_key):
    try:
        command = [
            'sudo', 'sh', '-c',
            f'echo "\\n[Peer]\\nAllowedIPs = {allowed_ips}/32\\nPublicKey = {public_key}\\n" >> /etc/wireguard/wg0.conf'
        ]
        subprocess.run(command, check=True)
        subprocess.run(['sudo','wg-quick', 'down', 'wg0'], check=True)
        subprocess.run(['sudo','wg-quick', 'up', 'wg0'], check=True)
        return jsonify({'message': 'success'})
    except subprocess.CalledProcessError as e:
        return jsonify({'message': 'error', 'error': str(e)})
        

@app.route('/create_device', methods=['POST'])
def create_device():
    try:
        data = request.get_json()

        token = data.get('token')
        nume = data.get('nume')
        public_key = data.get('public_key')
        
        if not token:
            return jsonify({'message': 'error', 'error': 'Token is required'})
        if not nume:
            return jsonify({'message': 'error', 'error': 'Nume is required'})

        try:
            decoded_token = decode(token, SECRET_KEY, algorithms=['HS256'])
            userID = decoded_token['user_id']
        except ExpiredSignatureError:
            return jsonify({'message': 'error', 'error': 'Token has expired'})
        except Exception as e:
            return jsonify({'message': 'error', 'error': str(e)})

        device_id = get_latestID_device()
        if device_id == 0:
            ip_address = "10.0.0.2"
        else:
            ip_address = incrementIP()
        private_key = gen_keys()[0]
        # public_key = gen_keys()[1]
    
        devices_collection.insert_one({
            'id': device_id,
            'nume': nume,
            'user_id': userID,
            'IpAddress': ip_address,
            'Publickey': public_key,
        })
        
        update_wg_conf(ip_address, public_key)
        
        users_collection.update_one(
            {'id': userID},
            {'$push': {'devices': device_id}}
        )
        return jsonify({'private_key': private_key, 'public_key': public_key, 'ip_address': ip_address})
    except Exception as e:
        return jsonify({'message': 'error', 'error': str(e)})

@app.route('/get_all_devices', methods=['GET'])
def get_all_devices():
    try:
        devices = list(devices_collection.find({}, {'_id': False}))

        devices_json = json_util.dumps(devices)
        return jsonify({'devices': devices_json})
    
    except Exception as e:
        return jsonify({'message': 'error', 'error': str(e)})
    
@app.route('/delete_devices', methods=['DELETE'])
def delete_devices():
    try:
        devices_collection.delete_many({})
        return jsonify({'message': 'success'})
    except Exception as e:
        return jsonify({'message': 'error', 'error': str(e)})
    
@app.route('/')
def hello():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run(host='207.154.232.144', port=5001)
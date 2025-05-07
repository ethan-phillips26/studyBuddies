import os
from dotenv import load_dotenv
import firebase_admin
from firebase_admin import credentials, firestore

load_dotenv()

firebase_creds = {
    "type": "service_account",
    "project_id": os.environ['FIREBASE_PROJECT_ID'],
    "private_key_id": os.environ['FIREBASE_PRIVATE_KEY_ID'],
    "private_key": os.environ['FIREBASE_PRIVATE_KEY'].replace("\\n", "\n"),
    "client_email": os.environ['FIREBASE_CLIENT_EMAIL'],
    "client_id": os.environ['FIREBASE_CLIENT_ID'],
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{os.environ['FIREBASE_CLIENT_EMAIL'].replace('@', '%40')}",
    "universe_domain": "googleapis.com"
}

cred = credentials.Certificate(firebase_creds)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred, {
        'databaseURL': os.environ['FIREBASE_DATABASE_URL']
    })

db = firestore.client()

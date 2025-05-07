import firebase_admin
from firebase_admin import credentials, firestore
import os

# Load credentials from environment variables
firebase_credentials = {
  "type": "service_account",
  "project_id": "studybuddies-1150c",
  "private_key_id": "5b764bfff7127750b0570a0c70448c170c6ba849",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDC545MCBomWqUS\nJMzZDjDWak4yeOn4THeQ8K0GpwQf6Y4yasAC16FOpg9nZ5e+GCtNh6A+J4jGfqx/\n4DWyvYYbdKyyK7J5JDgG5JtKR0luvoX0eXpLtrkS+0c3oXNmcZ9sP9UTIgZtDE5X\ndUE9hoWBGN91fXjXotSLsHZ7jcz7IciWZCNJPA7AJSyFX1sj6MmpA5X5itoDR86J\n3zz2PktcqGW4IbGZ8yzNBTOHjjdGIZcchYpHKlDK4K+DZhv3zqORCWsaCNmlLSpc\nYwJ9uM4SyH3uqFBFVW8uUfftgr1eDWoe9M+pHF1MsIOe2u77dWTw67JdXkv0friv\nPIcvaunFAgMBAAECggEATTXBzyjegxchkWB2rf3LJwWR2LjBpxVTwF03jg0XuzSg\nmiRj0DxvsGJkc8g7+phEf0AdIMI0kr2XxEijvR0LRVEhIKvi1c6dS03AntpCotZi\n5ohBBEFsa7KTcdxJhOm6B/35gMzX0tcvKcJPh/oEZTHfRAHinznoDTZomWWBMHJt\n/ToavSK9tIut5W6FUBEWkLiAhLqfoNEDjgM1pm4kYMM6YSd/Kjo5aamGzI4ki+cB\nQRw5byfy+jgGmEexNSfiLhtv2OhVp1b7jOwEiCgkmNB5rWrzeYD+W2LwJNjnBAEL\nwYA7lseNscpEyznQKPXo3uq5G/9A9QXPTwAH9tF0+QKBgQD0VclFlW0Cd2qXNNGQ\nMcpxfyPk9LEbRii1/6jNfnzvF/G98nZ/D7ak9nGwW9aWF0KrzNCY2Klm489qvcrl\njvm+3BHfraME9Tg/vU1IsMqY/s73lUKFhP2Nxs5dB0mHHeXUbRsHAEBFA6IyBapg\nmA920QCMkPBRbywVXJFmYVYjGwKBgQDMNaOaUqDQOHcItjZSe7qHjio5ooJ+yeT5\nWcUfAlZ2w8LK1SGeolyFl1JAKFXwo5rFchX8Q8EVvbPNW4D4AOP3hV0rBezL9D6l\nIAaf8cNOcx5b6Q9TZQKWhPwB2IHJesjyBg9gB25Xk7NmCNMz0jrwlOiGRGjNYFub\nmp4fVlcUnwKBgQC0pmS8zOEfLLmjeErlSNr8FVutoXj8yF+7SH4/CSFICbUTkpwo\nD68jwo6GLTC4IhSKP1GPYMnHJ/IoYpEMLyzZ/447if744HGpNsZYU1ZHzkWp6jKX\n059AXtgfEg88Fk/iQpT0FSxvmmMmhufUqTjtyVOVmmgEXaUDWkCqqJbuNwKBgDh0\nY8RYL4kg8xd/eEkZV5n+HYJNgRIYMqsUvEA0Xz76I7H7dg3rCPUNvnlqLUgXksQf\nJCDXglvGVBzjvSXS6TMWtYkdXDeOUHtJ/UrehYX8oVn7dncxp6OBJEJGXqsavM7c\nCggcRc8EUEZXDjx3VEAKirYD141fpDPCbRBwyCY1AoGAGs4j01QVo8i3veDQp/ur\nybKtPnKccvss03ULcc3SSf3IcuD+xuyuUn7Q/whEBZU8QkRIIUcXZcYe8sjgTTbt\n4+IQUOMuBwsdS8bgC5XPkR/ktNySpvOIc7NO9OlQazQppcUrCUAA2znGkFjjYpdf\nZyt6jbqz5IJa52EiiEVOHtE=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@studybuddies-1150c.iam.gserviceaccount.com",
  "client_id": "117736926134740992114",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40studybuddies-1150c.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
}

# Initialize Firebase Admin SDK with credentials
cred = credentials.Certificate(firebase_credentials)
firebase_admin.initialize_app(cred)

# Initialize Firestore
db = firestore.client()


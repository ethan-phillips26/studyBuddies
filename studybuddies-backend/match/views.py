from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .firebase_config import db

from stream_chat import StreamChat

STREAM_API_KEY = 'your_api_key'  
STREAM_API_SECRET = 'your_api_secret'
stream_client = StreamChat(api_key=STREAM_API_KEY, api_secret=STREAM_API_SECRET)

@csrf_exempt
def match_users(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            uid = body.get('uid')
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=400)

        if not uid:
            return JsonResponse({'error': 'UID is required'}, status=400)

        try:
            user_ref = db.collection('users').document(uid)
            user_doc = user_ref.get()
        except Exception as e:
            return JsonResponse({'error': f'Error accessing Firestore: {str(e)}'}, status=500)

        if not user_doc.exists:
            return JsonResponse({'error': 'User not found'}, status=404)

        user_data = user_doc.to_dict()
        user_classes = user_data.get('classes', [])
        matched_users = user_data.get('matches', [])

        if not user_classes:
            return JsonResponse({'error': 'User is not enrolled in any classes'}, status=400)

        try:
            stream_client.upsert_user({
                "id": uid,
                "name": f"{user_data.get('fname', '')} {user_data.get('lname', '')}".strip(),
                "image": user_data.get('profile_image', ''),
                "role": "admin"
            })

            token = stream_client.create_token(uid)

        except Exception as e:
            return JsonResponse({'error': f'Stream Chat error: {str(e)}'}, status=500)

        matching_users_ref = db.collection('users').where('classes', 'array_contains_any', user_classes)
        matching_users = matching_users_ref.stream()

        matching_user_ids = [
            user.id
            for user in matching_users
            if user.id != uid and user.id not in matched_users
        ]

        return JsonResponse({
            'matches': matching_user_ids,
            'stream_token': token,
            'stream_api_key': STREAM_API_KEY
        })

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

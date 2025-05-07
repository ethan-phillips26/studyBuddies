from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .firebase_config import db

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

        user_ref = db.collection('users').document(uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            return JsonResponse({'error': 'User not found'}, status=404)

        user_data = user_doc.to_dict()
        user_classes = user_data.get('classes', [])
        matched_users = user_data.get('matches', [])

        if not user_classes:
            return JsonResponse({'error': 'User is not enrolled in any classes'}, status=400)

        matching_users_ref = db.collection('users').where('classes', 'array_contains_any', user_classes)
        matching_users = matching_users_ref.stream()

        matching_user_ids = [
            user.id
            for user in matching_users
            if user.id != uid and user.id not in matched_users
        ]

        return JsonResponse(matching_user_ids, safe=False)

    return JsonResponse({'error': 'Invalid HTTP method'}, status=405)

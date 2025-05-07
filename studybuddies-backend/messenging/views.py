from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from stream_chat import StreamChat
import json
import os

@csrf_exempt
def generate_stream_key(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        firebase_uid = data.get('firebaseUid')

        client = StreamChat(
            api_key=os.environ['STREAM_API_KEY'],
            api_secret=os.environ['STREAM_API_SECRET']
        )
        token = client.create_token(firebase_uid)

        return HttpResponse(token, content_type='text/plain')

    return HttpResponse("Method Not Allowed", status=405)

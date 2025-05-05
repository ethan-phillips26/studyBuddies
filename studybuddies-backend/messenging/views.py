from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from stream_chat import StreamChat
import json

@csrf_exempt
def generate_stream_key(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        firebase_uid = data.get('firebaseUid')

        StreamChat(api_key="25tf5sakkgnx", api_secret="4kbv2fwdzzv63q8w463u5zav9qa8v5e37c4d7qcv9pnwk3cfskmak27sh3v8s5pd")
        token = client.create_token(firebase_uid)

        return HttpResponse(token, content_type='text/plain')

    return HttpResponse("Method Not Allowed", status=405)

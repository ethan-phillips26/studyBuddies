from django.urls import path
from .views import generate_stream_key

urlpatterns = [
    path('generate-stream-key/', generate_stream_key, name='generate_stream_key'),
]
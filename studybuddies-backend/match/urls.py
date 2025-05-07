# match/urls.py
from django.urls import path
from .views import match_users

urlpatterns = [
    path('match/', match_users, name='match_users'),
]

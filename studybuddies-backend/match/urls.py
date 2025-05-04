from django.urls import path
from match import views

urlpatterns = [
    path('matches/', views.get_matches, name='get_matches'),
]
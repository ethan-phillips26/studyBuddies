from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_matches(request):
    # Hardcoded info for now
    matches = [
        {"name": "John", "interest": "Machine Learning"},
        {"name": "Emma", "interest": "Data Science"},
    ]
    return Response(matches)


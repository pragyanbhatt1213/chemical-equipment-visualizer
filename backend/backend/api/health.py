"""
Simple healthcheck endpoint for Railway deployment.
Railway needs a GET endpoint that returns 200 to know app is healthy.
"""

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def healthcheck(request):
    """
    Simple healthcheck endpoint.
    Returns 200 OK instantly - no auth, no DB access required.
    Railway uses this to verify app is running.
    """
    return Response({"status": "healthy"})

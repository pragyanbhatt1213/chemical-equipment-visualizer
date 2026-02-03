import logging
from rest_framework.decorators import api_view, permission_classes # tells Django -> this function  is API endpoint
from rest_framework.response import Response # returns JSON response
from rest_framework import status, permissions# http status codes(200,201,400)
from django.http import HttpResponse
from .pdf_utils import generate_pdf

from .models import Dataset
from .serializers import DatasetSerializer
from .utils import analyze_csv
from django.contrib.auth import authenticate
from django.contrib.auth.models import User  # ✅ ADDED for admin creation
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated

from .export_utils import generate_csv, generate_excel

logger = logging.getLogger('api')


@api_view(["POST"]) #this endpoint accept POST only
@permission_classes([IsAuthenticated])
def upload_csv(request):
    file = request.FILES.get("file")
    logger.info(f"CSV upload attempt: {file.name if file else 'No file'}")

    if not file: # prevent crashes
        logger.warning("CSV upload failed: No file provided")
        return Response(
            {"error": "No file uploaded"},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        analysis = analyze_csv(file)
        logger.info(f"CSV analysis successful: {file.name}, Equipment count: {analysis['total_equipment']}")
    except Exception as e:
        logger.error(f"CSV analysis failed for {file.name}", exc_info=True)
        return Response(
            {"error": str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

    dataset = Dataset.objects.create( #convert analytics to permanent storage
        name=file.name, # one row=one csv
        total_equipment=analysis["total_equipment"],
        avg_flowrate=analysis["avg_flowrate"],
        avg_pressure=analysis["avg_pressure"],
        avg_temperature=analysis["avg_temperature"],
        type_distribution=analysis["type_distribution"],
        # New analytics
        statistics=analysis["statistics"],
        equipment_data=analysis["equipment_data"],
        avg_health_score=analysis["avg_health_score"],
        outliers=analysis["outliers"],
        outlier_count=analysis["outlier_count"],
        efficiency_ranking=analysis["efficiency_ranking"],
        risk_summary=analysis["risk_summary"],
    )

    logger.info(f"Dataset created: ID={dataset.id}, Name={file.name}")

    # # Keep only last 5 datasets
    # if Dataset.objects.count() > 5:
    #     Dataset.objects.order_by("uploaded_at").first().delete() # delete older upload

    serializer = DatasetSerializer(dataset) # convert dataset to JSON
    return Response(serializer.data, status=status.HTTP_201_CREATED) # send back to frontend 
 
 #History API
@api_view(["GET"]) # fetches last 5 uploads
@permission_classes([IsAuthenticated])

def history(request):
    logger.info("History API called")
    datasets = Dataset.objects.order_by("-uploaded_at")[:5]
    serializer = DatasetSerializer(datasets, many=True) #many=True-> list of objects
    logger.info(f"Returned {len(datasets)} datasets from history")
    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])

def generate_pdf_report(request, dataset_id):
    logger.info(f"PDF generation request for dataset ID: {dataset_id}")
    try:
        dataset = Dataset.objects.get(id=dataset_id)
        logger.info(f"Dataset found: {dataset.name}")
    except Dataset.DoesNotExist:
        logger.error(f"Dataset not found: ID={dataset_id}")
        return Response(
            {"error": "Dataset not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        pdf_bytes = generate_pdf(dataset)
        logger.info(f"PDF generated successfully for dataset ID: {dataset_id}")
    except Exception as e:
        logger.error(f"PDF generation failed for dataset ID: {dataset_id}", exc_info=True)
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    response = HttpResponse(pdf_bytes, content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="equipment_report.pdf"'
    return response
# Fetch dataset from DB

# Call pure utility function

# Return downloadable PDF

# No business logic in view


# authenticate() → checks username/password

# Token.objects.get_or_create() → one token per user

# Stateless auth (no sessions)
@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login(request):
    # 🔐 AUTO CREATE ADMIN IF NOT EXISTS (FREE TIER SAFE)
    # This lazy-loads on first login request instead of using pre-deploy commands
    if not User.objects.filter(username="admin").exists():
        User.objects.create_superuser(
            username="admin",
            email="admin@example.com",
            password="admin123"
        )
        logger.info("Admin user created automatically on first login request")
    
    username = request.data.get("username")
    password = request.data.get("password")
    logger.info(f"Login attempt for user: {username}")

    if not username or not password:
        logger.warning("Login failed: Missing credentials")
        return Response(
            {"error": "Username and password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)

    if not user:
        logger.warning(f"Login failed: Invalid credentials for user {username}")
        return Response(
            {"error": "Invalid credentials"},
            status=status.HTTP_401_UNAUTHORIZED
        )

    token, _ = Token.objects.get_or_create(user=user)
    logger.info(f"Login successful for user: {username}")

    return Response({
        "token": token.key,
        "username": user.username
    })



@api_view(["GET"])
@permission_classes([IsAuthenticated])
def export_csv(request, dataset_id):
    logger.info(f"CSV export request for dataset ID: {dataset_id}")
    try:
        dataset = Dataset.objects.get(id=dataset_id)
    except Dataset.DoesNotExist:
        logger.error(f"CSV export failed: Dataset not found (ID={dataset_id})")
        return Response(
            {"error": "Dataset not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        csv_bytes = generate_csv(dataset)
        logger.info(f"CSV exported successfully for dataset ID: {dataset_id}")
    except Exception as e:
        logger.error(f"CSV export failed for dataset ID: {dataset_id}", exc_info=True)
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    response = HttpResponse(csv_bytes, content_type="text/csv")
    response["Content-Disposition"] = 'attachment; filename="equipment_summary.csv"'
    return response

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def export_excel(request, dataset_id):
    logger.info(f"Excel export request for dataset ID: {dataset_id}")
    try:
        dataset = Dataset.objects.get(id=dataset_id)
    except Dataset.DoesNotExist:
        logger.error(f"Excel export failed: Dataset not found (ID={dataset_id})")
        return Response(
            {"error": "Dataset not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        excel_bytes = generate_excel(dataset)
        logger.info(f"Excel exported successfully for dataset ID: {dataset_id}")
    except Exception as e:
        logger.error(f"Excel export failed for dataset ID: {dataset_id}", exc_info=True)
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    response = HttpResponse(
        excel_bytes,
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    )
    response["Content-Disposition"] = 'attachment; filename="equipment_summary.xlsx"'
    return response

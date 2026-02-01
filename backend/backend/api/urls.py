from django.urls import path
from .views import (
    upload_csv,
    history,
    generate_pdf_report,
    login,
    export_csv,
    export_excel
)

urlpatterns = [
    path("login/", login),
    path("upload/", upload_csv),
    path("history/", history),
    path("generate-pdf/<int:dataset_id>/", generate_pdf_report),
    path("export/csv/<int:dataset_id>/", export_csv),
    path("export/excel/<int:dataset_id>/", export_excel),
]

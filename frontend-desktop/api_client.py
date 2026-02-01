import requests
import os

BASE_URL = "http://127.0.0.1:8000/api"

class APIClient:
    def __init__(self):
        self.token = None

    def login(self, username, password):
        response = requests.post(
            f"{BASE_URL}/login/",
            json={"username": username, "password": password}
        )

        if response.status_code == 200:
            self.token = response.json()["token"]
            return True

        return False

    def set_token(self, token):
        """Set token after login"""
        self.token = token

    def _headers(self):
        """Private method - return auth headers"""
        return {
            "Authorization": f"Token {self.token}"
        }

    def headers(self):
        """Legacy method for backward compatibility"""
        return self._headers() if self.token else {}


    def upload_csv(self, file_path):
        with open(file_path, "rb") as f:
            files = {"file": f}
            response = requests.post(
                f"{BASE_URL}/upload/",
                files=files,
                headers=self._headers()
            )

        if response.status_code == 201:
            return response.json()
        return None

    def download_pdf(self, dataset_id):
        """Download PDF report for dataset"""
        response = requests.get(
            f"{BASE_URL}/generate-pdf/{dataset_id}/",
            headers=self._headers()
        )
        response.raise_for_status()
        return response.content

    def fetch_history(self):
        """Get list of all uploaded datasets"""
        response = requests.get(
            f"{BASE_URL}/history/",
            headers=self._headers()
        )
        response.raise_for_status()
        return response.json()
        
    def export_csv(self, dataset_id):
        """Export dataset as CSV"""
        response = requests.get(
            f"{BASE_URL}/export/csv/{dataset_id}/",
            headers=self._headers()
        )
        response.raise_for_status()
        return response.content

    def export_excel(self, dataset_id):
        """Export dataset as Excel"""
        response = requests.get(
            f"{BASE_URL}/export/excel/{dataset_id}/",
            headers=self._headers()
        )
        response.raise_for_status()
        return response.content

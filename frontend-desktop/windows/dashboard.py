"""
Dashboard Window Module
This module provides the main GUI for the Chemical Equipment Visualizer desktop application.
Users can upload CSV files, view charts, and download PDF reports.
"""

import os
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QLabel, QPushButton,
    QFileDialog, QMessageBox, QListWidget
)

from utils.charts import show_type_distribution_chart
from windows.analytics import AnalyticsWindow


class DashboardWindow(QWidget):
    """
    Main dashboard window for the Chemical Equipment Visualizer application.
    Provides UI components for uploading CSV files, viewing charts, and downloading PDFs.
    """
    def __init__(self, api_client):
        """
        Initialize the dashboard window.
        
        Args:
            api_client: API client instance for communicating with the backend
        """
        super().__init__()
        self.api = api_client  # Store API client for making requests
        self.dataset = None  # Will store uploaded CSV data and metadata
        self.selected_dataset_id = None  # Track selected dataset from history
        self.init_ui()  # Build the user interface

    def init_ui(self):
        """
        Initialize and set up the user interface components.
        Creates the window layout with buttons and labels.
        """
        # Set window properties
        self.setWindowTitle("Chemical Equipment Visualizer")
        self.setGeometry(200, 100, 500, 400)  # x, y, width, height

        # Create main vertical layout to arrange widgets top-to-bottom
        self.layout = QVBoxLayout()

        # Info label - displays status messages and upload information
        self.info_label = QLabel("Upload a CSV file to begin")
        self.layout.addWidget(self.info_label)

        # Upload button - allows user to select and upload a CSV file
        self.upload_btn = QPushButton("Upload CSV")
        self.upload_btn.clicked.connect(self.upload_csv)  # Connect to upload_csv method
        self.layout.addWidget(self.upload_btn)

        # Chart button - displays type distribution chart (disabled until data is uploaded)
        self.chart_btn = QPushButton("Show Chart")
        self.chart_btn.clicked.connect(self.show_chart)
        self.chart_btn.setEnabled(False)  # Initially disabled
        self.layout.addWidget(self.chart_btn)

        # Analytics button - displays advanced analytics dashboard (disabled until data is uploaded)
        self.analytics_btn = QPushButton("📊 Advanced Analytics")
        self.analytics_btn.clicked.connect(self.show_analytics)
        self.analytics_btn.setEnabled(False)  # Initially disabled
        self.layout.addWidget(self.analytics_btn)

        # PDF button - downloads PDF report (disabled until data is uploaded)
        self.pdf_btn = QPushButton("Download PDF")
        self.pdf_btn.clicked.connect(self.download_pdf)
        self.pdf_btn.setEnabled(False)  # Initially disabled
        self.layout.addWidget(self.pdf_btn)

        # History section
        self.history_label = QLabel("History (Last 5 Uploads)")
        self.layout.addWidget(self.history_label)

        # List widget to show upload history
        self.history_list = QListWidget()
        self.history_list.itemClicked.connect(self.on_history_selected)
        self.layout.addWidget(self.history_list)

        # Export CSV button
        self.export_csv_btn = QPushButton("Export CSV")
        self.export_csv_btn.clicked.connect(self.handle_export_csv)
        self.layout.addWidget(self.export_csv_btn)

        # Export Excel button
        self.export_excel_btn = QPushButton("Export Excel")
        self.export_excel_btn.clicked.connect(self.handle_export_excel)
        self.layout.addWidget(self.export_excel_btn)

        # Apply the layout to the window
        self.setLayout(self.layout)

    def upload_csv(self):
        """
        Handle CSV file upload.
        Opens a file dialog, sends the selected CSV to the backend API,
        and updates the UI with the response data.
        """
        # Open file dialog - user selects a CSV file
        file_path, _ = QFileDialog.getOpenFileName(
            self, "Select CSV", "", "CSV Files (*.csv)"
        )

        # If user cancelled the dialog, exit without doing anything
        if not file_path:
            return

        # Send CSV file to backend API for processing
        response = self.api.upload_csv(file_path)

        # If upload was successful, update UI and enable buttons
        if response:
            self.dataset = response  # Store the response data
            # Update info label with upload details
            self.info_label.setText(
                f"Uploaded: {response['name']}\n"
                f"Total Equipment: {response['total_equipment']}"
            )
            # Enable chart and PDF buttons now that data is available
            self.chart_btn.setEnabled(True)
            self.analytics_btn.setEnabled(True)
            self.pdf_btn.setEnabled(True)
            # Load history after successful upload
            self.load_history()
        else:
            # Show error message if upload failed
            QMessageBox.critical(self, "Error", "Upload failed")

    def load_history(self):
        """Fetch and display upload history"""
        try:
            self.history_list.clear()
            datasets = self.api.fetch_history()

            for ds in datasets:
                # Show dataset name and upload date
                text = f"{ds['name']} | {ds['uploaded_at']}"
                self.history_list.addItem(text)
                # Store dataset ID in Qt user role (256)
                self.history_list.item(self.history_list.count() - 1).setData(256, ds["id"])
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Failed to load history: {str(e)}")

    def on_history_selected(self):
        """Handle history list item selection"""
        item = self.history_list.currentItem()
        if item:
            # Extract stored dataset ID
            self.selected_dataset_id = item.data(256)

    def get_selected_dataset_id(self):
        """Get ID of selected dataset from history"""
        item = self.history_list.currentItem()
        if not item:
            return None
        return item.data(256)

    def handle_export_csv(self):
        """Export selected dataset as CSV"""
        dataset_id = self.get_selected_dataset_id()
        if not dataset_id:
            QMessageBox.warning(self, "Error", "Please select a dataset from history")
            return

        filename = "equipment_summary.csv"
        try:
            data = self.api.export_csv(dataset_id)
            with open(filename, "wb") as f:
                f.write(data)
            QMessageBox.information(self, "Success", f"CSV saved as {filename}")
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Export failed: {str(e)}")

    def handle_export_excel(self):
        """Export selected dataset as Excel"""
        dataset_id = self.get_selected_dataset_id()
        if not dataset_id:
            QMessageBox.warning(self, "Error", "Please select a dataset from history")
            return

        filename = "equipment_summary.xlsx"
        try:
            data = self.api.export_excel(dataset_id)
            with open(filename, "wb") as f:
                f.write(data)
            QMessageBox.information(self, "Success", f"Excel saved as {filename}")
        except Exception as e:
            QMessageBox.critical(self, "Error", f"Export failed: {str(e)}")

    def show_chart(self):
        """
        Display the type distribution chart.
        Uses the uploaded dataset to generate and show a visualization.
        """
        # Extract type distribution data and pass to chart function
        show_type_distribution_chart(self.dataset["type_distribution"])

    def show_analytics(self):
        """
        Display the advanced analytics dashboard.
        Shows comprehensive analytics with health scores, statistics, visualizations.
        """
        if not self.dataset:
            QMessageBox.warning(self, "Error", "Please upload data first")
            return
        
        self.analytics_window = AnalyticsWindow(self.dataset)
        self.analytics_window.show()

    def download_pdf(self):
        """
        Download PDF report for the uploaded dataset.
        Saves to the current working directory.
        """
        dataset_id = self.dataset["id"]
        filename = f"equipment_report_{dataset_id}.pdf"
        
        try:
            # Request PDF download from backend API
            data = self.api.download_pdf(dataset_id)
            
            # Save PDF to file
            with open(filename, "wb") as f:
                f.write(data)
            
            QMessageBox.information(self, "Success", f"PDF saved as {filename}")
        except Exception as e:
            QMessageBox.critical(self, "Error", f"PDF download failed: {str(e)}")

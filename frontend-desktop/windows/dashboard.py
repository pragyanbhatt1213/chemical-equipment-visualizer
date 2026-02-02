"""
Dashboard Window Module
This module provides the main GUI for the Chemical Equipment Visualizer desktop application.
Users can upload CSV files, view charts, and download PDF reports.
"""

import os
from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QPushButton,
    QFileDialog, QMessageBox, QListWidget, QFrame, QScrollArea, QSplitter
)
from PyQt5.QtCore import Qt, QPropertyAnimation, QEasingCurve, QRect
from PyQt5.QtGui import QFont, QIcon

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
        Creates a modern dashboard layout with sidebar navigation and main content area.
        """
        # Set window properties
        self.setWindowTitle("Chemical Equipment Visualizer - Dashboard")
        self.setGeometry(100, 50, 1200, 800)
        self.setMinimumSize(800, 600)

        # Create main horizontal layout
        main_layout = QHBoxLayout()
        main_layout.setContentsMargins(0, 0, 0, 0)
        main_layout.setSpacing(0)

        # Create sidebar
        sidebar = self.create_sidebar()
        main_layout.addWidget(sidebar)

        # Create main content area
        content_area = self.create_content_area()
        main_layout.addWidget(content_area)

        self.setLayout(main_layout)

        # Set window background
        self.setStyleSheet("""
            QWidget {
                background-color: #F8F9FA;
            }
        """)

    def create_sidebar(self):
        """Create the sidebar navigation panel"""
        sidebar = QFrame()
        sidebar.setStyleSheet("""
            QFrame {
                background-color: #051F20;
                border: none;
                border-radius: 0px;
            }
        """)
        sidebar.setFixedWidth(280)

        sidebar_layout = QVBoxLayout()
        sidebar_layout.setContentsMargins(20, 30, 20, 30)
        sidebar_layout.setSpacing(20)

        # Logo/Title section with high contrast
        title_label = QLabel("Chemical Equipment Visualizer")
        title_label.setStyleSheet("""
            QLabel {
                color: #FFFFFF;
                font-size: 20px;
                font-weight: bold;
                background-color: transparent;
                border: none;
                margin-bottom: 20px;
                padding: 10px;
            }
        """)
        title_label.setAlignment(Qt.AlignCenter)
        title_label.setWordWrap(True)
        sidebar_layout.addWidget(title_label)

        # Navigation buttons with click handlers
        nav_buttons = [
            ("📊 Dashboard", True, self.show_dashboard_section),
            ("📈 Analytics", False, self.show_analytics_section),
            ("📋 History", False, self.show_history_section),
            ("📄 Reports", False, self.show_reports_section)
        ]

        self.nav_buttons = []  # Store button references
        for text, is_active, callback in nav_buttons:
            btn = QPushButton(text)
            btn.setStyleSheet(f"""
                QPushButton {{
                    background-color: {'#235347' if is_active else 'transparent'};
                    color: #FFFFFF;
                    border: none;
                    border-radius: 8px;
                    padding: 12px 16px;
                    font-size: 14px;
                    font-weight: 500;
                    text-align: left;
                }}
                QPushButton:hover {{
                    background-color: #163832;
                    color: #FFFFFF;
                }}
            """)
            btn.clicked.connect(callback)
            self.nav_buttons.append(btn)
            sidebar_layout.addWidget(btn)

        sidebar_layout.addStretch()

        # User section at bottom
        user_frame = QFrame()
        user_frame.setStyleSheet("""
            QFrame {
                background-color: #0B2B26;
                border-radius: 8px;
                padding: 12px;
            }
        """)
        user_layout = QVBoxLayout()
        user_layout.setContentsMargins(12, 12, 12, 12)

        user_label = QLabel("👤 Demo User")
        user_label.setStyleSheet("""
            QLabel {
                color: #FFFFFF;
                font-size: 14px;
                font-weight: 500;
                background-color: transparent;
                border: none;
            }
        """)
        user_layout.addWidget(user_label)

        logout_btn = QPushButton("Logout")
        logout_btn.setStyleSheet("""
            QPushButton {
                background-color: transparent;
                color: #DAF1DE;
                border: 1px solid #DAF1DE;
                border-radius: 6px;
                padding: 8px 12px;
                font-size: 12px;
                margin-top: 8px;
            }
            QPushButton:hover {
                background-color: #DAF1DE;
                color: #051F20;
            }
        """)
        user_layout.addWidget(logout_btn)

        user_frame.setLayout(user_layout)
        sidebar_layout.addWidget(user_frame)

        sidebar.setLayout(sidebar_layout)
        return sidebar

    def create_content_area(self):
        """Create the main content area"""
        content_widget = QWidget()
        content_layout = QVBoxLayout()
        content_layout.setContentsMargins(30, 30, 30, 30)
        content_layout.setSpacing(20)

        # Top bar
        top_bar = self.create_top_bar()
        content_layout.addWidget(top_bar)

        # Main content scroll area
        scroll_area = QScrollArea()
        scroll_area.setWidgetResizable(True)
        scroll_area.setStyleSheet("""
            QScrollArea {
                background-color: transparent;
                border: none;
            }
        """)

        # Content container
        self.content_container = QWidget()
        self.container_layout = QVBoxLayout()
        self.container_layout.setSpacing(20)

        # Info section
        self.info_label = QLabel("Welcome to Chemical Equipment Visualizer")
        self.info_label.setStyleSheet("""
            QLabel {
                color: #051F20;
                font-size: 24px;
                font-weight: 700;
                margin-bottom: 8px;
            }
        """)
        self.container_layout.addWidget(self.info_label)

        # Action cards section
        action_cards = self.create_action_cards()
        self.container_layout.addWidget(action_cards)

        # History section
        self.history_section = self.create_history_section()
        self.container_layout.addWidget(self.history_section)

        # Export section
        self.export_section = self.create_export_section()
        self.container_layout.addWidget(self.export_section)

        self.container_layout.addStretch()
        self.content_container.setLayout(self.container_layout)
        scroll_area.setWidget(self.content_container)

        content_layout.addWidget(scroll_area)
        content_widget.setLayout(content_layout)
        return content_widget

    def create_top_bar(self):
        """Create the top navigation bar"""
        top_bar = QFrame()
        top_bar.setStyleSheet("""
            QFrame {
                background-color: white;
                border: none;
                border-bottom: 1px solid #E0E0E0;
                border-radius: 12px;
                padding: 16px 20px;
            }
        """)

        top_layout = QHBoxLayout()
        top_layout.setContentsMargins(0, 0, 0, 0)

        # Page title
        self.page_title = QLabel("Dashboard")
        self.page_title.setStyleSheet("""
            QLabel {
                color: #051F20;
                font-size: 20px;
                font-weight: 600;
            }
        """)
        top_layout.addWidget(self.page_title)

        top_layout.addStretch()

        # Status indicator
        status_label = QLabel("● Online")
        status_label.setStyleSheet("""
            QLabel {
                color: #20D9A0;
                font-size: 14px;
                font-weight: 500;
            }
        """)
        top_layout.addWidget(status_label)

        top_bar.setLayout(top_layout)
        return top_bar

    def create_action_cards(self):
        """Create action cards for main functionality"""
        cards_frame = QFrame()
        cards_layout = QHBoxLayout()
        cards_layout.setSpacing(20)

        # Upload card
        upload_card = self.create_card(
            "📁 Upload CSV",
            "Upload and analyze equipment data",
            self.upload_csv,
            "#235347"
        )
        cards_layout.addWidget(upload_card)

        # Chart card
        self.chart_card = self.create_card(
            "📊 Show Chart",
            "View type distribution visualization",
            self.show_chart,
            "#4A90E2",
            enabled=False
        )
        cards_layout.addWidget(self.chart_card)

        # Analytics card
        self.analytics_card = self.create_card(
            "📈 Advanced Analytics",
            "Comprehensive equipment analysis",
            self.show_analytics,
            "#20D9A0",
            enabled=False
        )
        cards_layout.addWidget(self.analytics_card)

        # PDF card
        self.pdf_card = self.create_card(
            "📄 Download PDF",
            "Generate detailed report",
            self.download_pdf,
            "#FF9800",
            enabled=False
        )
        cards_layout.addWidget(self.pdf_card)

        cards_frame.setLayout(cards_layout)
        return cards_frame

    def create_card(self, title, description, callback, color, enabled=True):
        """Create a modern action card"""
        card = QFrame()
        card.setStyleSheet(f"""
            QFrame {{
                background-color: white;
                border: none;
                border-radius: 12px;
                padding: 20px;
                border-left: 4px solid {color};
            }}
            QFrame:hover {{
                background-color: #F8F9FA;
            }}
        """)
        card.setMinimumHeight(120)

        card_layout = QVBoxLayout()
        card_layout.setSpacing(8)

        # Title
        title_label = QLabel(title)
        title_label.setStyleSheet(f"""
            QLabel {{
                color: {color};
                font-size: 16px;
                font-weight: 600;
            }}
        """)
        card_layout.addWidget(title_label)

        # Description
        desc_label = QLabel(description)
        desc_label.setStyleSheet("""
            QLabel {
                color: #666666;
                font-size: 14px;
                line-height: 1.4;
            }
        """)
        desc_label.setWordWrap(True)
        card_layout.addWidget(desc_label)

        card_layout.addStretch()

        # Action button
        action_btn = QPushButton("Open")
        action_btn.setStyleSheet(f"""
            QPushButton {{
                background-color: {color};
                color: white;
                border: none;
                border-radius: 6px;
                padding: 8px 16px;
                font-size: 12px;
                font-weight: 500;
            }}
            QPushButton:hover {{
                background-color: {color};
                opacity: 0.8;
            }}
            QPushButton:disabled {{
                background-color: #E0E0E0;
                color: #9E9E9E;
            }}
        """)
        action_btn.setEnabled(enabled)
        action_btn.clicked.connect(callback)
        card_layout.addWidget(action_btn)

        card.setLayout(card_layout)
        return card

    def create_history_section(self):
        """Create the history section"""
        history_frame = QFrame()
        history_frame.setStyleSheet("""
            QFrame {
                background-color: white;
                border: none;
                border-radius: 12px;
                padding: 20px;
            }
        """)

        history_layout = QVBoxLayout()
        history_layout.setSpacing(16)

        # Section title
        history_title = QLabel("📋 Upload History")
        history_title.setStyleSheet("""
            QLabel {
                color: #051F20;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 8px;
            }
        """)
        history_layout.addWidget(history_title)

        # History list
        self.history_list = QListWidget()
        self.history_list.setStyleSheet("""
            QListWidget {
                background-color: #F8F9FA;
                border: 1px solid #E0E0E0;
                border-radius: 8px;
                padding: 8px;
            }
            QListWidget::item {
                background-color: transparent;
                border: none;
                border-radius: 6px;
                padding: 12px 16px;
                margin: 2px 0px;
                color: #051F20;
            }
            QListWidget::item:hover {
                background-color: #DAF1DE;
            }
            QListWidget::item:selected {
                background-color: #235347;
                color: white;
            }
        """)
        self.history_list.itemClicked.connect(self.on_history_selected)
        self.history_list.setMaximumHeight(200)
        history_layout.addWidget(self.history_list)

        history_frame.setLayout(history_layout)
        return history_frame

    def create_export_section(self):
        """Create the export section"""
        export_frame = QFrame()
        export_frame.setStyleSheet("""
            QFrame {
                background-color: white;
                border: none;
                border-radius: 12px;
                padding: 20px;
            }
        """)

        export_layout = QVBoxLayout()
        export_layout.setSpacing(16)

        # Section title
        export_title = QLabel("💾 Export Data")
        export_title.setStyleSheet("""
            QLabel {
                color: #051F20;
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 8px;
            }
        """)
        export_layout.addWidget(export_title)

        # Export buttons
        export_buttons_layout = QHBoxLayout()
        export_buttons_layout.setSpacing(12)

        # Export CSV button
        self.export_csv_btn = QPushButton("📊 Export CSV")
        self.export_csv_btn.setStyleSheet("""
            QPushButton {
                background-color: #4A90E2;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 12px 20px;
                font-size: 14px;
                font-weight: 500;
            }
            QPushButton:hover {
                background-color: #357ABD;
            }
        """)
        self.export_csv_btn.clicked.connect(self.handle_export_csv)
        export_buttons_layout.addWidget(self.export_csv_btn)

        # Export Excel button
        self.export_excel_btn = QPushButton("📈 Export Excel")
        self.export_excel_btn.setStyleSheet("""
            QPushButton {
                background-color: #20D9A0;
                color: #051F20;
                border: none;
                border-radius: 8px;
                padding: 12px 20px;
                font-size: 14px;
                font-weight: 500;
            }
            QPushButton:hover {
                background-color: #8EB69B;
            }
        """)
        self.export_excel_btn.clicked.connect(self.handle_export_excel)
        export_buttons_layout.addWidget(self.export_excel_btn)

        export_buttons_layout.addStretch()
        export_layout.addLayout(export_buttons_layout)

        export_frame.setLayout(export_layout)
        return export_frame

    def enable_action_cards(self):
        """Enable action cards after successful data upload"""
        # Find and enable the action buttons in the cards
        for card in [self.chart_card, self.analytics_card, self.pdf_card]:
            for child in card.findChildren(QPushButton):
                child.setEnabled(True)

    # Navigation methods
    def show_dashboard_section(self):
        """Show the dashboard section"""
        self.update_nav_buttons(0)
        self.page_title.setText("Dashboard")
        # Show dashboard content
        self.history_section.show()
        self.export_section.show()

    def show_analytics_section(self):
        """Show the analytics section"""
        self.update_nav_buttons(1)
        self.page_title.setText("Analytics")
        if self.dataset:
            self.show_analytics()
        else:
            QMessageBox.information(self, "Info", "Please upload data first to view analytics")

    def show_history_section(self):
        """Show the history section"""
        self.update_nav_buttons(2)
        self.page_title.setText("History")
        # Focus on history section
        self.history_section.show()
        self.export_section.hide()

    def show_reports_section(self):
        """Show the reports section"""
        self.update_nav_buttons(3)
        self.page_title.setText("Reports")
        # Focus on export section
        self.history_section.hide()
        self.export_section.show()

    def update_nav_buttons(self, active_index):
        """Update navigation button styles"""
        for i, btn in enumerate(self.nav_buttons):
            if i == active_index:
                btn.setStyleSheet("""
                    QPushButton {
                        background-color: #235347;
                        color: #FFFFFF;
                        border: none;
                        border-radius: 8px;
                        padding: 12px 16px;
                        font-size: 14px;
                        font-weight: 500;
                        text-align: left;
                    }
                    QPushButton:hover {
                        background-color: #163832;
                        color: #FFFFFF;
                    }
                """)
            else:
                btn.setStyleSheet("""
                    QPushButton {
                        background-color: transparent;
                        color: #FFFFFF;
                        border: none;
                        border-radius: 8px;
                        padding: 12px 16px;
                        font-size: 14px;
                        font-weight: 500;
                        text-align: left;
                    }
                    QPushButton:hover {
                        background-color: #163832;
                        color: #FFFFFF;
                    }
                """)

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
                f"✅ Successfully uploaded: {response['name']}\n"
                f"Total Equipment: {response['total_equipment']} items"
            )
            self.info_label.setStyleSheet("""
                QLabel {
                    color: #20D9A0;
                    font-size: 16px;
                    font-weight: 600;
                    background-color: #DAF1DE;
                    border-radius: 8px;
                    padding: 12px 16px;
                    border-left: 4px solid #20D9A0;
                }
            """)
            
            # Enable action cards
            self.enable_action_cards()
            
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

"""
Advanced Analytics Window Module
Displays comprehensive analytics dashboard with health scores, statistics, outliers, and rankings.
"""

from PyQt5.QtWidgets import (
    QWidget, QVBoxLayout, QHBoxLayout, QLabel, QTableWidget, QTableWidgetItem,
    QScrollArea, QFrame
)
from PyQt5.QtCore import Qt
from PyQt5.QtGui import QFont, QColor
import matplotlib.pyplot as plt
from matplotlib.backends.backend_qt5agg import FigureCanvasQTAgg as FigureCanvas
from matplotlib.figure import Figure
import io


class AnalyticsWindow(QWidget):
    """
    Advanced Analytics Dashboard showing comprehensive equipment analysis.
    Displays health scores, statistics, visualizations, and risk assessment.
    """
    def __init__(self, dataset):
        """
        Initialize analytics window.
        
        Args:
            dataset: Dictionary containing all analytics data
        """
        super().__init__()
        self.dataset = dataset
        self.init_ui()

    def init_ui(self):
        """Initialize and setup the analytics UI"""
        self.setWindowTitle("Advanced Analytics Dashboard")
        self.setGeometry(100, 100, 1200, 800)
        
        layout = QVBoxLayout()
        
        # Title
        title = QLabel("📊 Advanced Analytics Dashboard")
        title_font = QFont()
        title_font.setPointSize(16)
        title_font.setBold(True)
        title.setFont(title_font)
        layout.addWidget(title)
        
        # Summary Cards
        layout.addLayout(self.create_summary_cards())
        
        # Statistics Table
        layout.addWidget(self.create_statistics_table())
        
        # Charts
        layout.addLayout(self.create_charts())
        
        # Efficiency Ranking
        layout.addWidget(self.create_ranking_table())
        
        # Outliers
        if self.dataset.get('outliers'):
            layout.addWidget(self.create_outliers_table())
        
        # Add scroll area
        scroll = QScrollArea()
        scroll.setWidgetResizable(True)
        container = QWidget()
        container.setLayout(layout)
        scroll.setWidget(container)
        
        main_layout = QVBoxLayout()
        main_layout.addWidget(scroll)
        self.setLayout(main_layout)

    def create_summary_cards(self):
        """Create summary metric cards"""
        layout = QHBoxLayout()
        
        # Health Score Card
        health_frame = self.create_card(
            "⭐ Average Health Score",
            f"{self.dataset.get('avg_health_score', 0)}/100",
            "#4CAF50"
        )
        layout.addWidget(health_frame)
        
        # Risk Summary Card
        risk = self.dataset.get('risk_summary', {})
        risk_text = f"High: {risk.get('high_risk', 0)}\nMed: {risk.get('medium_risk', 0)}\nLow: {risk.get('low_risk', 0)}"
        risk_frame = self.create_card(
            "🚨 Risk Summary",
            risk_text,
            "#2196F3"
        )
        layout.addWidget(risk_frame)
        
        # Outliers Card
        outlier_frame = self.create_card(
            "⚠️ Outliers",
            str(self.dataset.get('outlier_count', 0)),
            "#FF9800"
        )
        layout.addWidget(outlier_frame)
        
        return layout

    def create_card(self, title, value, color):
        """Create a metric card"""
        frame = QFrame()
        frame.setStyleSheet(f"""
            QFrame {{
                border-left: 4px solid {color};
                background-color: #f5f5f5;
                border-radius: 4px;
                padding: 15px;
            }}
        """)
        
        layout = QVBoxLayout()
        
        title_label = QLabel(title)
        title_font = QFont()
        title_font.setBold(True)
        title_label.setFont(title_font)
        layout.addWidget(title_label)
        
        value_label = QLabel(value)
        value_font = QFont()
        value_font.setPointSize(14)
        value_font.setBold(True)
        value_label.setFont(value_font)
        value_label.setStyleSheet(f"color: {color};")
        layout.addWidget(value_label)
        
        frame.setLayout(layout)
        return frame

    def create_statistics_table(self):
        """Create statistics summary table"""
        label = QLabel("📈 Statistical Analysis")
        font = QFont()
        font.setBold(True)
        label.setFont(font)
        
        table = QTableWidget()
        table.setColumnCount(6)
        table.setHorizontalHeaderLabels(["Parameter", "Min", "Max", "Median", "Std Dev", "Mean"])
        table.setMaximumHeight(150)
        
        stats = self.dataset.get('statistics', {})
        row = 0
        
        for param_name in ['flowrate', 'pressure', 'temperature']:
            param_data = stats.get(param_name, {})
            table.insertRow(row)
            
            table.setItem(row, 0, QTableWidgetItem(param_name.capitalize()))
            table.setItem(row, 1, QTableWidgetItem(str(param_data.get('min', 'N/A'))))
            table.setItem(row, 2, QTableWidgetItem(str(param_data.get('max', 'N/A'))))
            table.setItem(row, 3, QTableWidgetItem(str(param_data.get('median', 'N/A'))))
            table.setItem(row, 4, QTableWidgetItem(str(param_data.get('std', 'N/A'))))
            table.setItem(row, 5, QTableWidgetItem(str(param_data.get('mean', 'N/A'))))
            
            row += 1
        
        table.resizeColumnsToContents()
        
        layout = QVBoxLayout()
        layout.addWidget(label)
        layout.addWidget(table)
        
        widget = QWidget()
        widget.setLayout(layout)
        return widget

    def create_charts(self):
        """Create visualization charts"""
        layout = QHBoxLayout()
        
        # Pressure vs Temperature Scatter
        if self.dataset.get('equipment_data'):
            scatter_canvas = self.create_scatter_chart()
            layout.addWidget(scatter_canvas)
            
            # Health Score Distribution
            health_canvas = self.create_health_chart()
            layout.addWidget(health_canvas)
        
        return layout

    def create_scatter_chart(self):
        """Create pressure vs temperature scatter plot"""
        fig = Figure(figsize=(5, 4), dpi=100)
        ax = fig.add_subplot(111)
        
        equipment_data = self.dataset.get('equipment_data', [])
        pressures = [eq['pressure'] for eq in equipment_data]
        temperatures = [eq['temperature'] for eq in equipment_data]
        health_scores = [eq['health_score'] for eq in equipment_data]
        
        scatter = ax.scatter(pressures, temperatures, c=health_scores, cmap='RdYlGn', s=50, alpha=0.6)
        ax.set_xlabel("Pressure")
        ax.set_ylabel("Temperature")
        ax.set_title("Pressure vs Temperature")
        fig.colorbar(scatter, ax=ax, label="Health Score")
        
        canvas = FigureCanvas(fig)
        return canvas

    def create_health_chart(self):
        """Create health score distribution bar chart"""
        fig = Figure(figsize=(5, 4), dpi=100)
        ax = fig.add_subplot(111)
        
        equipment_data = self.dataset.get('equipment_data', [])[:10]
        names = [eq['name'][:10] for eq in equipment_data]
        scores = [eq['health_score'] for eq in equipment_data]
        colors = ['green' if s >= 85 else 'orange' if s >= 70 else 'red' for s in scores]
        
        ax.barh(names, scores, color=colors)
        ax.set_xlabel("Health Score")
        ax.set_title("Equipment Health Scores")
        ax.set_xlim(0, 100)
        
        canvas = FigureCanvas(fig)
        return canvas

    def create_ranking_table(self):
        """Create efficiency ranking table"""
        label = QLabel("🏆 Equipment Efficiency Ranking")
        font = QFont()
        font.setBold(True)
        label.setFont(font)
        
        table = QTableWidget()
        table.setColumnCount(5)
        table.setHorizontalHeaderLabels(["Rank", "Equipment Name", "Type", "Health Score", "Status"])
        table.setMaximumHeight(300)
        
        ranking = self.dataset.get('efficiency_ranking', [])
        
        for row, item in enumerate(ranking[:10]):
            table.insertRow(row)
            
            table.setItem(row, 0, QTableWidgetItem(str(item['rank'])))
            table.setItem(row, 1, QTableWidgetItem(item['equipment_name']))
            table.setItem(row, 2, QTableWidgetItem(item['type']))
            
            score_item = QTableWidgetItem(str(item['health_score']))
            score_item.setForeground(QColor("#2196F3"))
            table.setItem(row, 3, score_item)
            
            status_item = QTableWidgetItem(item['status'])
            if item['status'] == 'Excellent':
                status_item.setForeground(QColor("#4CAF50"))
            elif item['status'] == 'Good':
                status_item.setForeground(QColor("#2196F3"))
            elif item['status'] == 'Fair':
                status_item.setForeground(QColor("#FF9800"))
            else:
                status_item.setForeground(QColor("#F44336"))
            table.setItem(row, 4, status_item)
        
        table.resizeColumnsToContents()
        
        layout = QVBoxLayout()
        layout.addWidget(label)
        layout.addWidget(table)
        
        widget = QWidget()
        widget.setLayout(layout)
        return widget

    def create_outliers_table(self):
        """Create outliers table"""
        label = QLabel("⚠️ Detected Outliers")
        font = QFont()
        font.setBold(True)
        label.setFont(font)
        
        table = QTableWidget()
        table.setColumnCount(7)
        table.setHorizontalHeaderLabels(["Equipment", "Type", "Flowrate", "Pressure", "Temperature", "Health Score", "Risk"])
        table.setMaximumHeight(250)
        
        outliers = self.dataset.get('outliers', [])
        
        for row, outlier in enumerate(outliers):
            table.insertRow(row)
            
            table.setItem(row, 0, QTableWidgetItem(outlier['equipment_name']))
            table.setItem(row, 1, QTableWidgetItem(outlier['type']))
            
            params = outlier['parameters']
            table.setItem(row, 2, QTableWidgetItem(str(params['flowrate'])))
            table.setItem(row, 3, QTableWidgetItem(str(params['pressure'])))
            table.setItem(row, 4, QTableWidgetItem(str(params['temperature'])))
            
            score_item = QTableWidgetItem(str(outlier['health_score']))
            table.setItem(row, 5, score_item)
            
            risk_item = QTableWidgetItem(outlier['risk'])
            if outlier['risk'] == 'HIGH':
                risk_item.setForeground(QColor("#F44336"))
            elif outlier['risk'] == 'MEDIUM':
                risk_item.setForeground(QColor("#FF9800"))
            else:
                risk_item.setForeground(QColor("#4CAF50"))
            table.setItem(row, 6, risk_item)
        
        table.resizeColumnsToContents()
        
        layout = QVBoxLayout()
        layout.addWidget(label)
        layout.addWidget(table)
        
        widget = QWidget()
        widget.setLayout(layout)
        return widget

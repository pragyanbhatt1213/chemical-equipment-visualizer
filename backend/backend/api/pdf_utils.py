import io
from reportlab.lib.pagesizes import A4, letter
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from reportlab.lib.utils import ImageReader
from reportlab.lib import colors
from reportlab.platypus import Table, TableStyle


def generate_pdf(dataset):
    """
    Generates a comprehensive PDF report for a Dataset instance with advanced analytics.
    Returns PDF as bytes.
    """
    # Lazy import: matplotlib only loads when PDF is generated
    # This prevents font cache build during startup
    import matplotlib
    matplotlib.use("Agg")  # Non-GUI backend - critical for server
    import matplotlib.pyplot as plt

    # -----------------------------
    # 1. Generate chart image
    # -----------------------------
    type_data = dataset.type_distribution

    fig, ax = plt.subplots()
    ax.bar(type_data.keys(), type_data.values())  # Uses server-side Matplotlib
    ax.set_title("Equipment Type Distribution")
    ax.set_xlabel("Equipment Type")
    ax.set_ylabel("Count")

    chart_buffer = io.BytesIO()  # Creates an in-memory file, No temp files on disk
    plt.savefig(chart_buffer, format="png", bbox_inches="tight")
    plt.close(fig)
    chart_buffer.seek(0)

    # Generate scatter plot: Pressure vs Temperature
    if dataset.equipment_data:
        fig, ax = plt.subplots(figsize=(8, 6))
        pressures = [eq['pressure'] for eq in dataset.equipment_data]
        temperatures = [eq['temperature'] for eq in dataset.equipment_data]
        health_scores = [eq['health_score'] for eq in dataset.equipment_data]
        
        scatter = ax.scatter(pressures, temperatures, c=health_scores, cmap='RdYlGn', s=100, alpha=0.6)
        ax.set_xlabel("Pressure")
        ax.set_ylabel("Temperature")
        ax.set_title("Pressure vs Temperature Correlation")
        plt.colorbar(scatter, ax=ax, label="Health Score")
        
        scatter_buffer = io.BytesIO()
        plt.savefig(scatter_buffer, format="png", bbox_inches="tight")
        plt.close(fig)
        scatter_buffer.seek(0)
    else:
        scatter_buffer = None

    # Generate health score distribution
    if dataset.equipment_data:
        fig, ax = plt.subplots(figsize=(8, 6))
        names = [eq['name'][:15] for eq in dataset.equipment_data[:10]]  # Limit to first 10
        scores = [eq['health_score'] for eq in dataset.equipment_data[:10]]
        colors_list = ['green' if s >= 85 else 'orange' if s >= 70 else 'red' for s in scores]
        
        ax.barh(names, scores, color=colors_list)
        ax.set_xlabel("Health Score")
        ax.set_title("Equipment Health Scores (Top 10)")
        ax.set_xlim(0, 100)
        
        health_buffer = io.BytesIO()
        plt.savefig(health_buffer, format="png", bbox_inches="tight")
        plt.close(fig)
        health_buffer.seek(0)
    else:
        health_buffer = None

    # -----------------------------
    # 2. Create PDF with multi-page layout
    # -----------------------------
    pdf_buffer = io.BytesIO()
    pdf = canvas.Canvas(pdf_buffer, pagesize=A4)  # Creates a blank PDF page
    width, height = A4

    y = height - 50

    # ========== PAGE 1: TITLE & SUMMARY ==========
    
    # Title
    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawString(50, y, "Chemical Equipment Visualizer")
    y -= 30

    pdf.setFont("Helvetica", 12)
    pdf.drawString(50, y, "Advanced Analytics Report")
    y -= 40

    # Metadata
    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, y, f"Dataset Name: {dataset.name}")
    y -= 15
    pdf.drawString(50, y, f"Uploaded At: {dataset.uploaded_at.strftime('%d %b %Y %H:%M')}")
    y -= 30

    # Summary section
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Summary Statistics")
    y -= 20

    pdf.setFont("Helvetica", 10)
    pdf.drawString(50, y, f"Total Equipment: {dataset.total_equipment}")
    y -= 15
    pdf.drawString(50, y, f"Average Flowrate: {dataset.avg_flowrate}")
    y -= 15
    pdf.drawString(50, y, f"Average Pressure: {dataset.avg_pressure}")
    y -= 15
    pdf.drawString(50, y, f"Average Temperature: {dataset.avg_temperature}")
    y -= 15
    pdf.drawString(50, y, f"Average Health Score: {dataset.avg_health_score}/100")
    y -= 30

    # Risk Summary
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Risk Assessment")
    y -= 20

    pdf.setFont("Helvetica", 10)
    risk = dataset.risk_summary
    pdf.drawString(50, y, f"High Risk Equipment: {risk.get('high_risk', 0)}")
    y -= 15
    pdf.drawString(50, y, f"Medium Risk Equipment: {risk.get('medium_risk', 0)}")
    y -= 15
    pdf.drawString(50, y, f"Low Risk Equipment: {risk.get('low_risk', 0)}")
    y -= 15
    pdf.drawString(50, y, f"Outliers Detected: {dataset.outlier_count}")
    y -= 30

    # Statistical Analysis table
    pdf.setFont("Helvetica-Bold", 11)
    pdf.drawString(50, y, "Parameter Statistics")
    y -= 20

    pdf.setFont("Helvetica", 9)
    stats = dataset.statistics
    col_width = (width - 100) / 6
    
    # Table headers
    headers = ["Parameter", "Min", "Max", "Median", "Std Dev", "Mean"]
    for i, header in enumerate(headers):
        pdf.drawString(50 + i * col_width, y, header)
    y -= 15
    
    # Table data
    for param_name in ['flowrate', 'pressure', 'temperature']:
        param_data = stats.get(param_name, {})
        pdf.drawString(50, y, param_name.capitalize())
        pdf.drawString(50 + col_width, y, str(param_data.get('min', 'N/A')))
        pdf.drawString(50 + 2 * col_width, y, str(param_data.get('max', 'N/A')))
        pdf.drawString(50 + 3 * col_width, y, str(param_data.get('median', 'N/A')))
        pdf.drawString(50 + 4 * col_width, y, str(param_data.get('std', 'N/A')))
        pdf.drawString(50 + 5 * col_width, y, str(param_data.get('mean', 'N/A')))
        y -= 15

    y -= 20

    # Chart image
    chart_image = ImageReader(chart_buffer)

    pdf.drawImage(
        chart_image,
        50,
        y - 250,
        width=width - 100,
        height=250,
        preserveAspectRatio=True
    )

    # Footer
    pdf.setFont("Helvetica-Oblique", 9)
    pdf.drawString(50, 40, "Generated by Chemical Equipment Visualizer | Page 1")

    pdf.showPage()

    # ========== PAGE 2: ADVANCED CHARTS ==========
    y = height - 50

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, y, "Detailed Analysis")
    y -= 40

    # Scatter plot
    if scatter_buffer:
        scatter_image = ImageReader(scatter_buffer)
        pdf.drawImage(
            scatter_image,
            50,
            y - 280,
            width=width - 100,
            height=280,
            preserveAspectRatio=True
        )
        y -= 300

    # Health score distribution
    if health_buffer:
        health_image = ImageReader(health_buffer)
        pdf.drawImage(
            health_image,
            50,
            y - 200,
            width=width - 100,
            height=200,
            preserveAspectRatio=True
        )

    pdf.setFont("Helvetica-Oblique", 9)
    pdf.drawString(50, 40, "Generated by Chemical Equipment Visualizer | Page 2")

    pdf.showPage()

    # ========== PAGE 3: OUTLIERS & TOP PERFORMERS ==========
    y = height - 50

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, y, "Outliers & Rankings")
    y -= 40

    if dataset.outliers:
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, "Detected Outliers")
        y -= 20

        pdf.setFont("Helvetica", 9)
        for idx, outlier in enumerate(dataset.outliers[:5]):  # Show top 5 outliers
            pdf.drawString(50, y, f"{outlier['equipment_name']} ({outlier['type']})")
            y -= 12
            pdf.drawString(70, y, f"Health Score: {outlier['health_score']} | Risk: {outlier['risk']}")
            y -= 12
            params = outlier['parameters']
            pdf.drawString(70, y, f"Flowrate: {params['flowrate']}, Pressure: {params['pressure']}, Temp: {params['temperature']}")
            y -= 15

    y -= 20

    if dataset.efficiency_ranking:
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, "Top Performers")
        y -= 20

        pdf.setFont("Helvetica", 9)
        for idx, equipment in enumerate(dataset.efficiency_ranking[:5]):  # Show top 5
            pdf.drawString(50, y, f"{equipment['rank']}. {equipment['equipment_name']} ({equipment['type']})")
            y -= 12
            pdf.drawString(70, y, f"Health Score: {equipment['health_score']} | Status: {equipment['status']}")
            y -= 15

    pdf.setFont("Helvetica-Oblique", 9)
    pdf.drawString(50, 40, "Generated by Chemical Equipment Visualizer | Page 3")

    pdf.showPage()
    pdf.save()

    pdf_buffer.seek(0)
    return pdf_buffer.getvalue()

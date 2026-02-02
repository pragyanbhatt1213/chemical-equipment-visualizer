import csv
import io
import pandas as pd


def generate_csv(dataset):
    """
    Generates a comprehensive CSV export with equipment data and analytics.
    Returns CSV bytes.
    """
    buffer = io.StringIO()
    writer = csv.writer(buffer)

    # ========== SUMMARY SECTION ==========
    writer.writerow(["CHEMICAL EQUIPMENT VISUALIZER - ANALYSIS REPORT"])
    writer.writerow([])
    writer.writerow(["Dataset Name:", dataset.name])
    writer.writerow(["Upload Time:", dataset.uploaded_at.strftime('%d %b %Y %H:%M')])
    writer.writerow([])

    # Summary metrics
    writer.writerow(["SUMMARY STATISTICS"])
    writer.writerow(["Metric", "Value"])
    writer.writerow(["Total Equipment", dataset.total_equipment])
    writer.writerow(["Average Flowrate", dataset.avg_flowrate])
    writer.writerow(["Average Pressure", dataset.avg_pressure])
    writer.writerow(["Average Temperature", dataset.avg_temperature])
    writer.writerow(["Average Health Score", dataset.avg_health_score])
    writer.writerow([])

    # Risk summary
    writer.writerow(["RISK ASSESSMENT"])
    writer.writerow(["Risk Level", "Count"])
    risk = dataset.risk_summary
    writer.writerow(["High Risk", risk.get('high_risk', 0)])
    writer.writerow(["Medium Risk", risk.get('medium_risk', 0)])
    writer.writerow(["Low Risk", risk.get('low_risk', 0)])
    writer.writerow(["Outliers Detected", dataset.outlier_count])
    writer.writerow([])

    # Type distribution
    writer.writerow(["EQUIPMENT TYPE DISTRIBUTION"])
    writer.writerow(["Equipment Type", "Count"])
    for eq_type, count in dataset.type_distribution.items():
        writer.writerow([eq_type, count])
    writer.writerow([])

    # Statistical analysis
    writer.writerow(["STATISTICAL ANALYSIS"])
    stats = dataset.statistics
    writer.writerow(["Parameter", "Min", "Max", "Median", "Std Dev", "Mean"])
    for param_name in ['flowrate', 'pressure', 'temperature']:
        param_data = stats.get(param_name, {})
        writer.writerow([
            param_name.capitalize(),
            param_data.get('min', 'N/A'),
            param_data.get('max', 'N/A'),
            param_data.get('median', 'N/A'),
            param_data.get('std', 'N/A'),
            param_data.get('mean', 'N/A')
        ])
    writer.writerow([])

    # Equipment details with health scores
    writer.writerow(["EQUIPMENT DETAILS"])
    writer.writerow(["Equipment Name", "Type", "Flowrate", "Pressure", "Temperature", "Health Score", "Risk Level"])
    for eq in dataset.equipment_data:
        writer.writerow([
            eq['name'],
            eq['type'],
            eq['flowrate'],
            eq['pressure'],
            eq['temperature'],
            eq['health_score'],
            eq['risk']
        ])
    writer.writerow([])

    # Outliers
    if dataset.outliers:
        writer.writerow(["OUTLIERS"])
        writer.writerow(["Equipment Name", "Type", "Flowrate", "Pressure", "Temperature", "Health Score", "Risk"])
        for outlier in dataset.outliers:
            params = outlier['parameters']
            writer.writerow([
                outlier['equipment_name'],
                outlier['type'],
                params['flowrate'],
                params['pressure'],
                params['temperature'],
                outlier['health_score'],
                outlier['risk']
            ])
        writer.writerow([])

    # Top performers
    if dataset.efficiency_ranking:
        writer.writerow(["TOP PERFORMERS"])
        writer.writerow(["Rank", "Equipment Name", "Type", "Health Score", "Status"])
        for item in dataset.efficiency_ranking[:10]:
            writer.writerow([
                item['rank'],
                item['equipment_name'],
                item['type'],
                item['health_score'],
                item['status']
            ])

    return buffer.getvalue().encode("utf-8")


def generate_excel(dataset):
    """
    Generates an Excel file with multiple sheets:
    - Sheet 1: Summary
    - Sheet 2: Statistics
    - Sheet 3: Equipment Details
    - Sheet 4: Type Distribution
    - Sheet 5: Efficiency Ranking
    - Sheet 6: Outliers
    Returns Excel bytes.
    """
    output = io.BytesIO()

    # Sheet 1: Summary
    summary_df = pd.DataFrame({
        "Metric": [
            "Total Equipment",
            "Average Flowrate",
            "Average Pressure",
            "Average Temperature",
            "Average Health Score",
            "High Risk Equipment",
            "Medium Risk Equipment",
            "Low Risk Equipment",
            "Outliers Detected"
        ],
        "Value": [
            dataset.total_equipment,
            dataset.avg_flowrate,
            dataset.avg_pressure,
            dataset.avg_temperature,
            dataset.avg_health_score,
            dataset.risk_summary.get('high_risk', 0),
            dataset.risk_summary.get('medium_risk', 0),
            dataset.risk_summary.get('low_risk', 0),
            dataset.outlier_count
        ]
    })

    # Sheet 2: Statistical Analysis
    stats = dataset.statistics
    stats_data = []
    for param_name in ['flowrate', 'pressure', 'temperature']:
        param_data = stats.get(param_name, {})
        stats_data.append({
            'Parameter': param_name.capitalize(),
            'Min': param_data.get('min', 'N/A'),
            'Max': param_data.get('max', 'N/A'),
            'Median': param_data.get('median', 'N/A'),
            'Std Dev': param_data.get('std', 'N/A'),
            'Mean': param_data.get('mean', 'N/A')
        })
    stats_df = pd.DataFrame(stats_data)

    # Sheet 3: Equipment Details
    equipment_df = pd.DataFrame(dataset.equipment_data)

    # Sheet 4: Type Distribution
    type_df = pd.DataFrame(
        list(dataset.type_distribution.items()),
        columns=["Equipment Type", "Count"]
    )

    # Sheet 5: Efficiency Ranking
    ranking_df = pd.DataFrame(dataset.efficiency_ranking)

    # Sheet 6: Outliers
    outlier_data = []
    for outlier in dataset.outliers:
        params = outlier['parameters']
        outlier_data.append({
            'Equipment Name': outlier['equipment_name'],
            'Type': outlier['type'],
            'Flowrate': params['flowrate'],
            'Pressure': params['pressure'],
            'Temperature': params['temperature'],
            'Health Score': outlier['health_score'],
            'Risk': outlier['risk']
        })
    outliers_df = pd.DataFrame(outlier_data) if outlier_data else pd.DataFrame()

    # Write to Excel
    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        summary_df.to_excel(writer, index=False, sheet_name="Summary")
        stats_df.to_excel(writer, index=False, sheet_name="Statistics")
        equipment_df.to_excel(writer, index=False, sheet_name="Equipment Details")
        type_df.to_excel(writer, index=False, sheet_name="Type Distribution")
        ranking_df.to_excel(writer, index=False, sheet_name="Efficiency Ranking")
        if not outliers_df.empty:
            outliers_df.to_excel(writer, index=False, sheet_name="Outliers")

    output.seek(0)
    return output.read()

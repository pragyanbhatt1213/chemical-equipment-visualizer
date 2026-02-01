import csv
import io
import pandas as pd


def generate_csv(dataset):
    """
    Generates a CSV summary for a dataset.
    Returns CSV bytes.
    """

    buffer = io.StringIO()
    writer = csv.writer(buffer)

    # Header
    writer.writerow([
        "Dataset Name",
        "Total Equipment",
        "Average Flowrate",
        "Average Pressure",
        "Average Temperature"
    ])

    # Data row
    writer.writerow([
        dataset.name,
        dataset.total_equipment,
        dataset.avg_flowrate,
        dataset.avg_pressure,
        dataset.avg_temperature
    ])

    return buffer.getvalue().encode("utf-8")


def generate_excel(dataset):
    """
    Generates an Excel file with:
    - Sheet 1: Summary
    - Sheet 2: Equipment Type Distribution
    Returns Excel bytes.
    """

    output = io.BytesIO()

    # Sheet 1: Summary
    summary_df = pd.DataFrame({
        "Metric": [
            "Total Equipment",
            "Average Flowrate",
            "Average Pressure",
            "Average Temperature"
        ],
        "Value": [
            dataset.total_equipment,
            dataset.avg_flowrate,
            dataset.avg_pressure,
            dataset.avg_temperature
        ]
    })

    # Sheet 2: Type Distribution
    type_df = pd.DataFrame(
        list(dataset.type_distribution.items()),
        columns=["Equipment Type", "Count"]
    )

    with pd.ExcelWriter(output, engine="openpyxl") as writer:
        summary_df.to_excel(writer, index=False, sheet_name="Summary")
        type_df.to_excel(writer, index=False, sheet_name="Type Distribution")

    output.seek(0)
    return output.read()

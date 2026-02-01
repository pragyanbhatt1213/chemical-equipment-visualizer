# This file will contain all CSV analysis logic
# It should NOT contain Django or HTTP code
import pandas as pd

REQUIRED_COLUMNS = [
    "Equipment Name",
    "Type",
    "Flowrate",
    "Pressure",
    "Temperature",
]

def analyze_csv(file):
    #Read csv
    df=pd.read_csv(file)

    #Vlaidate colums
    for column in REQUIRED_COLUMNS:
        if column not in df.columns:
            raise ValueError(f"Missing required column: {column}")
    total_equipment=len(df)

    #Vectorized Pandas operation
    avg_flowrate=df["Flowrate"].mean()
    avg_pressure = df["Pressure"].mean()
    avg_temperature = df["Temperature"].mean()

#     Counts each equipment type
# Perfect for charts
    type_distribution = df["Type"].value_counts().to_dict()

    return {
        "total_equipment": total_equipment,
        "avg_flowrate": round(avg_flowrate, 2),
        "avg_pressure": round(avg_pressure, 2),
        "avg_temperature": round(avg_temperature, 2),
        "type_distribution": type_distribution,
    }



#CSV → API → utils.py → DB → JSON

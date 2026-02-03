# This file will contain all CSV analysis logic
# It should NOT contain Django or HTTP code
import numpy as np

REQUIRED_COLUMNS = [
    "Equipment Name",
    "Type",
    "Flowrate",
    "Pressure",
    "Temperature",
]

def convert_to_native_types(obj):
    """
    Recursively convert numpy types to native Python types for JSON serialization.
    Handles: int64, float64, ndarray, dict, list, etc.
    """
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_to_native_types(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_to_native_types(item) for item in obj]
    else:
        return obj

def calculate_health_score(row, param_stats):
    """
    Calculate equipment health score (0-100) based on how well parameters perform
    - Optimal range scoring
    - Penalize outliers
    """
    score = 100
    
    # Flowrate score (prefer middle range, penalize extremes)
    flowrate_mean = param_stats['flowrate']['mean']
    flowrate_std = param_stats['flowrate']['std']
    flowrate_dev = abs(row['Flowrate'] - flowrate_mean) / (flowrate_std + 0.001)
    if flowrate_dev > 2:  # More than 2 std dev
        score -= 20
    elif flowrate_dev > 1:
        score -= 10
    
    # Pressure score (optimal pressure ranges)
    pressure_val = row['Pressure']
    if pressure_val > 8.5 or pressure_val < 3.5:  # Outside safe range
        score -= 15
    elif pressure_val > 8.0 or pressure_val < 4.0:
        score -= 8
    
    # Temperature score (optimal temperature ranges)
    temp_val = row['Temperature']
    if temp_val > 145 or temp_val < 90:  # Outside safe range
        score -= 15
    elif temp_val > 140 or temp_val < 95:
        score -= 8
    
    return max(0, min(100, round(score, 1)))  # Clamp between 0-100


def detect_outliers(df, param):
    """
    Detect outliers using IQR method (Interquartile Range)
    Returns indices of outlier rows
    """
    Q1 = df[param].quantile(0.25)
    Q3 = df[param].quantile(0.75)
    IQR = Q3 - Q1
    
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    return df[(df[param] < lower_bound) | (df[param] > upper_bound)].index.tolist()


def analyze_csv(file):
    import pandas as pd
    import numpy as np
    
    # Read csv
    df = pd.read_csv(file)

    # Validate columns
    for column in REQUIRED_COLUMNS:
        if column not in df.columns:
            raise ValueError(f"Missing required column: {column}")
    
    total_equipment = len(df)

    # ============ BASIC STATISTICS ============
    avg_flowrate = df["Flowrate"].mean()
    avg_pressure = df["Pressure"].mean()
    avg_temperature = df["Temperature"].mean()

    # Type distribution
    type_distribution = df["Type"].value_counts().to_dict()

    # ============ ADVANCED STATISTICS ============
    stats = {
        'flowrate': {
            'mean': avg_flowrate,
            'min': df["Flowrate"].min(),
            'max': df["Flowrate"].max(),
            'median': df["Flowrate"].median(),
            'std': df["Flowrate"].std(),
        },
        'pressure': {
            'mean': avg_pressure,
            'min': df["Pressure"].min(),
            'max': df["Pressure"].max(),
            'median': df["Pressure"].median(),
            'std': df["Pressure"].std(),
        },
        'temperature': {
            'mean': avg_temperature,
            'min': df["Temperature"].min(),
            'max': df["Temperature"].max(),
            'median': df["Temperature"].median(),
            'std': df["Temperature"].std(),
        },
    }

    # ============ HEALTH SCORES ============
    df['HealthScore'] = df.apply(lambda row: calculate_health_score(row, stats), axis=1)

    # ============ OUTLIER DETECTION ============
    outliers = {
        'flowrate': detect_outliers(df, 'Flowrate'),
        'pressure': detect_outliers(df, 'Pressure'),
        'temperature': detect_outliers(df, 'Temperature'),
    }
    
    outlier_equipment = set()
    for param_outliers in outliers.values():
        outlier_equipment.update(param_outliers)
    
    # Create outlier details
    outlier_details = []
    for idx in outlier_equipment:
        row = df.iloc[idx]
        outlier_details.append({
            'equipment_name': row['Equipment Name'],
            'type': row['Type'],
            'parameters': {
                'flowrate': round(float(row['Flowrate']), 2),
                'pressure': round(float(row['Pressure']), 2),
                'temperature': round(float(row['Temperature']), 2),
            },
            'health_score': float(row['HealthScore']),
            'risk': 'HIGH' if row['HealthScore'] < 70 else 'MEDIUM' if row['HealthScore'] < 85 else 'LOW',
        })

    # ============ EFFICIENCY RANKING ============
    ranking = df.nlargest(len(df), 'HealthScore')[['Equipment Name', 'Type', 'HealthScore']].to_dict('records')
    ranking = [
        {
            'rank': i + 1,
            'equipment_name': item['Equipment Name'],
            'type': item['Type'],
            'health_score': round(float(item['HealthScore']), 1),
            'status': 'Excellent' if item['HealthScore'] >= 90 else 'Good' if item['HealthScore'] >= 75 else 'Fair' if item['HealthScore'] >= 60 else 'Poor'
        }
        for i, item in enumerate(ranking)
    ]

    # ============ EQUIPMENT DATA WITH HEALTH SCORES ============
    equipment_data = []
    for _, row in df.iterrows():
        equipment_data.append({
            'name': row['Equipment Name'],
            'type': row['Type'],
            'flowrate': round(float(row['Flowrate']), 2),
            'pressure': round(float(row['Pressure']), 2),
            'temperature': round(float(row['Temperature']), 2),
            'health_score': round(float(row['HealthScore']), 1),
            'risk': 'HIGH' if row['HealthScore'] < 70 else 'MEDIUM' if row['HealthScore'] < 85 else 'LOW',
        })

    result = {
        # Basic metrics
        "total_equipment": total_equipment,
        "avg_flowrate": round(avg_flowrate, 2),
        "avg_pressure": round(avg_pressure, 2),
        "avg_temperature": round(avg_temperature, 2),
        "type_distribution": type_distribution,
        
        # Advanced analytics
        "statistics": {
            'flowrate': {k: round(v, 2) if isinstance(v, float) else v for k, v in stats['flowrate'].items()},
            'pressure': {k: round(v, 2) if isinstance(v, float) else v for k, v in stats['pressure'].items()},
            'temperature': {k: round(v, 2) if isinstance(v, float) else v for k, v in stats['temperature'].items()},
        },
        
        # Health scores and risk
        "equipment_data": equipment_data,
        "avg_health_score": round(df['HealthScore'].mean(), 1),
        
        # Outliers
        "outliers": outlier_details,
        "outlier_count": len(outlier_equipment),
        
        # Efficiency ranking
        "efficiency_ranking": ranking,
        
        # Risk summary
        "risk_summary": {
            'high_risk': len([e for e in equipment_data if e['risk'] == 'HIGH']),
            'medium_risk': len([e for e in equipment_data if e['risk'] == 'MEDIUM']),
            'low_risk': len([e for e in equipment_data if e['risk'] == 'LOW']),
        }
    }
    
    # Convert numpy types to native Python types for JSON serialization
    return convert_to_native_types(result)


# CSV → API → utils.py → DB → JSON

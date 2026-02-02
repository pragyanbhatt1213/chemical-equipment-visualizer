import React from "react";
import { ScatterChart, Scatter, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import "./Analytics.css";

function Analytics({ summary, equipment_data }) {
  if (!summary || !equipment_data) return null;

  const { statistics, equipment_data: equipmentList, efficiency_ranking, avg_health_score, risk_summary, outliers } = summary;

  // ============ SCATTER PLOT DATA: Pressure vs Temperature ============
  const scatterData = equipmentList.map((eq) => ({
    pressure: eq.pressure,
    temperature: eq.temperature,
    name: eq.name,
    health_score: eq.health_score,
  }));

  // ============ HISTOGRAM DATA: Flowrate Distribution ============
  const flowrateBins = [[], [], [], [], []];
  const minFlow = statistics.flowrate.min;
  const maxFlow = statistics.flowrate.max;
  const binSize = (maxFlow - minFlow) / 5;

  equipmentList.forEach((eq) => {
    const binIndex = Math.min(4, Math.floor((eq.flowrate - minFlow) / binSize));
    flowrateBins[binIndex].push(eq);
  });

  const histogramData = flowrateBins.map((bin, i) => ({
    range: `${(minFlow + i * binSize).toFixed(1)}-${(minFlow + (i + 1) * binSize).toFixed(1)}`,
    count: bin.length,
  }));

  // ============ HEATMAP DATA: Equipment Type × Parameter Matrix ============
  const typeStats = {};
  equipmentList.forEach((eq) => {
    if (!typeStats[eq.type]) {
      typeStats[eq.type] = {
        type: eq.type,
        flowrate: [],
        pressure: [],
        temperature: [],
      };
    }
    typeStats[eq.type].flowrate.push(eq.flowrate);
    typeStats[eq.type].pressure.push(eq.pressure);
    typeStats[eq.type].temperature.push(eq.temperature);
  });

  const heatmapData = Object.values(typeStats).map((item) => ({
    type: item.type,
    avg_flowrate: (item.flowrate.reduce((a, b) => a + b, 0) / item.flowrate.length).toFixed(1),
    avg_pressure: (item.pressure.reduce((a, b) => a + b, 0) / item.pressure.length).toFixed(1),
    avg_temperature: (item.temperature.reduce((a, b) => a + b, 0) / item.temperature.length).toFixed(1),
  }));

  // ============ HEALTH SCORE DISTRIBUTION ============
  const healthScores = equipmentList.map((eq) => ({
    name: eq.name,
    score: eq.health_score,
  }));

  // ============ RISK DISTRIBUTION (PIE CHART) ============
  const riskData = [
    { name: "High Risk", value: risk_summary.high_risk, fill: "#ff4444" },
    { name: "Medium Risk", value: risk_summary.medium_risk, fill: "#ffaa00" },
    { name: "Low Risk", value: risk_summary.low_risk, fill: "#44aa44" },
  ];

  return (
    <div className="analytics-container">
      <h2>📊 Advanced Analytics Dashboard</h2>

      {/* ============ SUMMARY CARDS ============ */}
      <div className="summary-cards">
        <div className="card health-card">
          <h3>⭐ Average Health Score</h3>
          <div className="score">{avg_health_score}</div>
          <p>out of 100</p>
        </div>
        <div className="card risk-card">
          <h3>🚨 Risk Summary</h3>
          <div className="risk-items">
            <div className="risk-high">High: {risk_summary.high_risk}</div>
            <div className="risk-medium">Medium: {risk_summary.medium_risk}</div>
            <div className="risk-low">Low: {risk_summary.low_risk}</div>
          </div>
        </div>
        <div className="card outlier-card">
          <h3>⚠️ Outliers Detected</h3>
          <div className="score">{outliers.length}</div>
          <p>equipment items</p>
        </div>
      </div>

      {/* ============ STATISTICAL SUMMARY TABLE ============ */}
      <div className="stats-table-section">
        <h3>📈 Statistical Analysis</h3>
        <table className="stats-table">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Min</th>
              <th>Max</th>
              <th>Median</th>
              <th>Std Dev</th>
              <th>Mean</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Flowrate</strong></td>
              <td>{statistics.flowrate.min}</td>
              <td>{statistics.flowrate.max}</td>
              <td>{statistics.flowrate.median}</td>
              <td>{statistics.flowrate.std}</td>
              <td>{statistics.flowrate.mean}</td>
            </tr>
            <tr>
              <td><strong>Pressure</strong></td>
              <td>{statistics.pressure.min}</td>
              <td>{statistics.pressure.max}</td>
              <td>{statistics.pressure.median}</td>
              <td>{statistics.pressure.std}</td>
              <td>{statistics.pressure.mean}</td>
            </tr>
            <tr>
              <td><strong>Temperature</strong></td>
              <td>{statistics.temperature.min}</td>
              <td>{statistics.temperature.max}</td>
              <td>{statistics.temperature.median}</td>
              <td>{statistics.temperature.std}</td>
              <td>{statistics.temperature.mean}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ============ VISUALIZATIONS ============ */}
      <div className="visualizations">
        
        {/* Scatter Plot: Pressure vs Temperature */}
        <div className="chart-section">
          <h3>📍 Pressure vs Temperature Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" dataKey="pressure" name="Pressure" />
              <YAxis type="number" dataKey="temperature" name="Temperature" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Legend />
              <Scatter
                name="Equipment"
                data={scatterData}
                fill="#8884d8"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {/* Histogram: Flowrate Distribution */}
        <div className="chart-section">
          <h3>📊 Flowrate Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={histogramData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="range" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Heatmap Table: Equipment Type × Parameters */}
        <div className="chart-section">
          <h3>🔥 Equipment Type Performance Matrix</h3>
          <table className="heatmap-table">
            <thead>
              <tr>
                <th>Equipment Type</th>
                <th>Avg Flowrate</th>
                <th>Avg Pressure</th>
                <th>Avg Temperature</th>
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((item, idx) => (
                <tr key={idx}>
                  <td><strong>{item.type}</strong></td>
                  <td>{item.avg_flowrate}</td>
                  <td>{item.avg_pressure}</td>
                  <td>{item.avg_temperature}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Health Score Bar Chart */}
        <div className="chart-section">
          <h3>💪 Equipment Health Scores</h3>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={healthScores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, 100]} />
              <YAxis dataKey="name" type="category" width={120} />
              <Tooltip />
              <Bar dataKey="score" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution Pie Chart */}
        <div className="chart-section">
          <h3>⭕ Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={riskData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ============ EFFICIENCY RANKING ============ */}
      <div className="ranking-section">
        <h3>🏆 Equipment Efficiency Ranking</h3>
        <div className="ranking-list">
          {efficiency_ranking.slice(0, 10).map((item, idx) => (
            <div key={idx} className={`ranking-item rank-${item.status.toLowerCase()}`}>
              <span className="rank-badge">{item.rank}</span>
              <div className="rank-details">
                <strong>{item.equipment_name}</strong> ({item.type})
              </div>
              <div className="rank-score">
                <span className="health-score">{item.health_score}</span>
                <span className="status">{item.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ============ OUTLIERS ============ */}
      {outliers.length > 0 && (
        <div className="outliers-section">
          <h3>⚠️ Detected Outliers</h3>
          <div className="outlier-list">
            {outliers.map((item, idx) => (
              <div key={idx} className={`outlier-item risk-${item.risk.toLowerCase()}`}>
                <div className="outlier-name">
                  <strong>{item.equipment_name}</strong> ({item.type})
                </div>
                <div className="outlier-params">
                  Flowrate: {item.parameters.flowrate} | Pressure: {item.parameters.pressure} | Temperature: {item.parameters.temperature}
                </div>
                <div className="outlier-score">
                  Health Score: <strong>{item.health_score}</strong> | Risk: <span className={`risk-${item.risk.toLowerCase()}`}>{item.risk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Analytics;

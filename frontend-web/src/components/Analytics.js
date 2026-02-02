import React from "react";
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend, ArcElement } from 'chart.js';
import { Bar as ChartJSBar, Pie as ChartJSPie } from 'react-chartjs-2';
import { 
  MetricCard, 
  MetricValue, 
  MetricLabel, 
  MetricIcon, 
  SummaryGrid, 
  ChartCard, 
  Section 
} from "./common";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  ChartLegend,
  ArcElement
);

// Analytics Container
const AnalyticsContainer = styled(Section)`
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.gray[50]};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  margin-top: ${({ theme }) => theme.spacing.xl};

  h2 {
    color: ${({ theme }) => theme.colors.primary.darkest};
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
    text-align: center;
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

// Risk Items Container
const RiskItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  text-align: left;
`;

const RiskItem = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ risk, theme }) => {
    switch (risk) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.gray[600];
    }
  }};
`;

// Statistics Table
const StatsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.base};

  thead {
    background: ${({ theme }) => theme.colors.primary.lightest};
  }

  th, td {
    padding: ${({ theme }) => theme.spacing.md};
    text-align: center;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }

  th {
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.primary.dark};
  }

  tbody tr:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.xs};
    
    th, td {
      padding: ${({ theme }) => theme.spacing.sm};
    }
  }
`;

// Visualizations Grid
const VisualizationsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

// Chart.js Container
const ChartJSContainer = styled.div`
  width: 100%;
  height: 300px;
  position: relative;
  
  canvas {
    max-height: 300px !important;
  }
`;

// Ranking Section
const RankingSection = styled(ChartCard)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  h3 {
    margin-top: 0;
    color: ${({ theme }) => theme.colors.primary.darkest};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const RankingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const RankingItem = styled(motion.div)`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid ${({ status, theme }) => {
    switch (status) {
      case 'excellent':
        return theme.colors.success;
      case 'good':
        return theme.colors.info;
      case 'fair':
        return theme.colors.warning;
      case 'poor':
        return theme.colors.error;
      default:
        return theme.colors.primary.light;
    }
  }};
  background: ${({ status, theme }) => {
    switch (status) {
      case 'excellent':
        return `${theme.colors.success}08`;
      case 'good':
        return `${theme.colors.info}08`;
      case 'fair':
        return `${theme.colors.warning}08`;
      case 'poor':
        return `${theme.colors.error}08`;
      default:
        return theme.colors.gray[50];
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  gap: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const RankBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  width: 40px;
  height: 40px;
  background: ${({ theme }) => theme.colors.primary.light};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  font-size: ${({ theme }) => theme.typography.fontSizes.base};
`;

const RankDetails = styled.div`
  flex: 1;
  color: ${({ theme }) => theme.colors.primary.darkest};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const RankScore = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: center;
`;

const HealthScore = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary.light};
`;

const Status = styled.span`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  background: ${({ theme }) => theme.colors.gray[100]};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: uppercase;
`;

// Outliers Section
const OutliersSection = styled(ChartCard)`
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  h3 {
    margin-top: 0;
    color: ${({ theme }) => theme.colors.primary.darkest};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const OutlierList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const OutlierItem = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.lg};
  border-left: 4px solid ${({ risk, theme }) => {
    switch (risk) {
      case 'high':
        return theme.colors.error;
      case 'medium':
        return theme.colors.warning;
      case 'low':
        return theme.colors.success;
      default:
        return theme.colors.gray[300];
    }
  }};
  background: ${({ risk, theme }) => {
    switch (risk) {
      case 'high':
        return `${theme.colors.error}08`;
      case 'medium':
        return `${theme.colors.warning}08`;
      case 'low':
        return `${theme.colors.success}08`;
      default:
        return theme.colors.gray[50];
    }
  }};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    transform: translateX(4px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const OutlierName = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.primary.darkest};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

const OutlierParams = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const OutlierScore = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

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
  // Note: healthScores variable removed (visualization removed in previous update)

  // ============ RISK DISTRIBUTION (PIE CHART) ============
  // Note: riskData is kept for potential future use with Recharts pie chart
  // const riskData = [
  //   { name: "High Risk", value: risk_summary.high_risk, fill: "#ff4444" },
  //   { name: "Medium Risk", value: risk_summary.medium_risk, fill: "#ffaa00" },
  //   { name: "Low Risk", value: risk_summary.low_risk, fill: "#44aa44" },
  // ];

  // ============ CHART.JS CONFIGURATIONS ============
  
  // Flowrate Distribution Chart.js Configuration
  const flowrateChartData = {
    labels: histogramData.map(item => item.range),
    datasets: [
      {
        label: 'Equipment Count',
        data: histogramData.map(item => item.count),
        backgroundColor: '#8EB69B',
        borderColor: '#235347',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const flowrateChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#051F20',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#235347',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          title: (context) => `Range: ${context[0].label}`,
          label: (context) => `Count: ${context.parsed.y} equipment`,
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          }
        }
      },
      y: {
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          }
        }
      }
    }
  };

  // Risk Distribution Pie Chart.js Configuration
  const riskChartData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [
      {
        data: [risk_summary.high_risk, risk_summary.medium_risk, risk_summary.low_risk],
        backgroundColor: ['#FF4444', '#FFB020', '#20D9A0'],
        borderColor: ['#FF4444', '#FFB020', '#20D9A0'],
        borderWidth: 2,
        hoverOffset: 4,
      }
    ]
  };

  const riskChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#374151',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
        }
      },
      tooltip: {
        backgroundColor: '#051F20',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#235347',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  return (
    <AnalyticsContainer
      as={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <h2>📊 Advanced Analytics Dashboard</h2>

      {/* ============ SUMMARY CARDS ============ */}
      <SummaryGrid>
        <MetricCard
          variant="success"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <MetricIcon>⭐</MetricIcon>
          <MetricLabel>Average Health Score</MetricLabel>
          <MetricValue variant="success">{avg_health_score}</MetricValue>
          <p style={{ margin: '4px 0 0 0', color: '#999', fontSize: '12px' }}>out of 100</p>
        </MetricCard>

        <MetricCard
          variant="warning"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ scale: 1.02 }}
        >
          <MetricIcon>🚨</MetricIcon>
          <MetricLabel>Risk Summary</MetricLabel>
          <RiskItems>
            <RiskItem risk="high">High: {risk_summary.high_risk}</RiskItem>
            <RiskItem risk="medium">Medium: {risk_summary.medium_risk}</RiskItem>
            <RiskItem risk="low">Low: {risk_summary.low_risk}</RiskItem>
          </RiskItems>
        </MetricCard>

        <MetricCard
          variant="error"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
        >
          <MetricIcon>⚠️</MetricIcon>
          <MetricLabel>Outliers Detected</MetricLabel>
          <MetricValue variant="error">{outliers.length}</MetricValue>
          <p style={{ margin: '4px 0 0 0', color: '#999', fontSize: '12px' }}>equipment items</p>
        </MetricCard>
      </SummaryGrid>

      {/* ============ STATISTICAL SUMMARY TABLE ============ */}
      <ChartCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h3>📈 Statistical Analysis</h3>
        <StatsTable>
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
        </StatsTable>
      </ChartCard>

      {/* ============ VISUALIZATIONS ============ */}
      <VisualizationsGrid>
        
        {/* Scatter Plot: Pressure vs Temperature */}
        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <h3>📍 Pressure vs Temperature Correlation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                type="number" 
                dataKey="pressure" 
                name="Pressure" 
                stroke="#6B7280"
                tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}
              />
              <YAxis 
                type="number" 
                dataKey="temperature" 
                name="Temperature" 
                stroke="#6B7280"
                tick={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }}
              />
              <Tooltip 
                cursor={{ strokeDasharray: "3 3" }}
                contentStyle={{
                  backgroundColor: '#051F20',
                  border: '1px solid #235347',
                  borderRadius: '8px',
                  color: '#FFFFFF',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
                labelStyle={{ color: '#FFFFFF' }}
                formatter={(value, name) => [
                  `${value}${name === 'pressure' ? ' bar' : '°C'}`,
                  name === 'pressure' ? 'Pressure' : 'Temperature'
                ]}
                labelFormatter={(label, payload) => {
                  if (payload && payload.length > 0) {
                    return `Equipment: ${payload[0].payload.name}`;
                  }
                  return '';
                }}
              />
              <Legend 
                wrapperStyle={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '12px',
                  color: '#374151'
                }}
              />
              <Scatter
                name="Equipment"
                data={scatterData}
                fill="#235347"
                shape="circle"
              />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Histogram: Flowrate Distribution - Chart.js */}
        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 }}
        >
          <h3>📊 Flowrate Distribution</h3>
          <ChartJSContainer>
            <ChartJSBar data={flowrateChartData} options={flowrateChartOptions} />
          </ChartJSContainer>
        </ChartCard>

        {/* Heatmap Table: Equipment Type × Parameters */}
        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <h3>🔥 Equipment Type Performance Matrix</h3>
          <StatsTable>
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
          </StatsTable>
        </ChartCard>

        {/* Risk Distribution Pie Chart - Chart.js */}
        <ChartCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <h3>⭕ Risk Distribution</h3>
          <ChartJSContainer>
            <ChartJSPie data={riskChartData} options={riskChartOptions} />
          </ChartJSContainer>
        </ChartCard>
      </VisualizationsGrid>

      {/* ============ EFFICIENCY RANKING ============ */}
      <RankingSection
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 1.0 }}
      >
        <h3>🏆 Equipment Efficiency Ranking</h3>
        <RankingList>
          {efficiency_ranking.slice(0, 10).map((item, idx) => (
            <RankingItem
              key={idx}
              status={item.status.toLowerCase()}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 1.1 + idx * 0.1 }}
              whileHover={{ scale: 1.02 }}
            >
              <RankBadge>{item.rank}</RankBadge>
              <RankDetails>
                <strong>{item.equipment_name}</strong> ({item.type})
              </RankDetails>
              <RankScore>
                <HealthScore>{item.health_score}</HealthScore>
                <Status>{item.status}</Status>
              </RankScore>
            </RankingItem>
          ))}
        </RankingList>
      </RankingSection>

      {/* ============ OUTLIERS ============ */}
      {outliers.length > 0 && (
        <OutliersSection
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.2 }}
        >
          <h3>⚠️ Detected Outliers</h3>
          <OutlierList>
            {outliers.map((item, idx) => (
              <OutlierItem
                key={idx}
                risk={item.risk.toLowerCase()}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 1.3 + idx * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <OutlierName>
                  <strong>{item.equipment_name}</strong> ({item.type})
                </OutlierName>
                <OutlierParams>
                  Flowrate: {item.parameters.flowrate} | Pressure: {item.parameters.pressure} | Temperature: {item.parameters.temperature}
                </OutlierParams>
                <OutlierScore>
                  <span>Health Score: <strong>{item.health_score}</strong></span>
                  <span>Risk: <RiskItem risk={item.risk.toLowerCase()}>{item.risk}</RiskItem></span>
                </OutlierScore>
              </OutlierItem>
            ))}
          </OutlierList>
        </OutliersSection>
      )}
    </AnalyticsContainer>
  );
}

export default Analytics;

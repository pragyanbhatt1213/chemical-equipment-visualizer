import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import styled from 'styled-components';
import { motion } from 'framer-motion';

ChartJS.register( //required once tells chart.js which features u will use
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// Styled components for chart container
const ChartContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  box-shadow: ${({ theme }) => theme.shadows.base};
  position: relative;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, 
      ${({ theme }) => theme.colors.primary.light}, 
      ${({ theme }) => theme.colors.primary.accent}
    );
  }
`;

const ChartTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary.dark};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  &::before {
    content: '📊';
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  }
`;

const ChartWrapper = styled(motion.div)`
  position: relative;
  height: 420px;
  padding: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    height: 320px;
  }
`;

// React component that receives type distribution data as prop
function TypeDistributionChart({ data }) { 
  // data = type_distribution object from backend (e.g., {pump: 5, valve: 3, compressor: 2})
  
  // Extract equipment type names → becomes x-axis labels
  // Object.keys() converts object keys into array: ["pump", "valve", "compressor"]
  const labels = Object.keys(data);
  
  // Extract equipment counts → becomes y-axis data points
  // Object.values() converts object values into array: [5, 3, 2]
  const values = Object.values(data);

  // Green color palette for bars
  const greenColors = [
    '#235347',   // Primary dark green
    '#8EB69B',   // Primary accent green
    '#163832',   // Primary medium green
    '#0B2B26',   // Primary darker green
    '#DAF1DE',   // Primary lightest green
    '#20D9A0',   // Success green
  ];

  // Chart.js data format → defines structure for the bar chart
  // labels = x-axis categories, datasets = data to display
  const chartData = {
    labels: labels,
    datasets: [
      {
        // label = legend text shown in chart
        label: "Equipment Count",
        // data = values to display (height of bars)
        data: values,
        // backgroundColor = colors for each bar using green palette
        backgroundColor: labels.map((_, index) => greenColors[index % greenColors.length]),
        // borderColor = border colors for bars
        borderColor: labels.map((_, index) => greenColors[index % greenColors.length]),
        // borderWidth = thickness of bar borders
        borderWidth: 2,
        // borderRadius = rounded corners on top of bars (in pixels)
        borderRadius: 8,
        // borderSkipped = which borders to skip (false = show all borders)
        borderSkipped: false,
        // hoverBackgroundColor = color when hovering over bars
        hoverBackgroundColor: labels.map((_, index) => `${greenColors[index % greenColors.length]}CC`),
        // hoverBorderColor = border color when hovering
        hoverBorderColor: labels.map((_, index) => greenColors[index % greenColors.length]),
        // hoverBorderWidth = border thickness when hovering
        hoverBorderWidth: 3,
      },
    ],
  };

  // Chart options → configure appearance and behavior
  const options = {
    // responsive = chart resizes to fit container
    responsive: true,
    // maintainAspectRatio = allow custom height
    maintainAspectRatio: false,
    // animation = smooth transitions when chart renders
    animation: {
      // duration = animation speed in milliseconds (1500ms = 1.5 seconds)
      duration: 1500,
      // easing = animation style (easeOutBounce = bouncy effect)
      easing: "easeOutBounce",
      // delay = stagger animation for each bar
      delay: (context) => context.dataIndex * 200,
    },
    // interaction settings
    interaction: {
      intersect: false,
      mode: 'index',
    },
    // plugins = customize chart features
    plugins: {
      // legend = the label box
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#374151',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
            weight: '500',
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'rectRounded',
        }
      },
      // tooltip customization
      tooltip: {
        backgroundColor: '#051F20',
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        borderColor: '#235347',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        titleFont: {
          family: 'Inter, sans-serif',
          size: 14,
          weight: '600',
        },
        bodyFont: {
          family: 'Inter, sans-serif',
          size: 12,
        },
        callbacks: {
          title: (context) => `Equipment Type: ${context[0].label}`,
          label: (context) => `Count: ${context.parsed.y} units`,
        }
      }
    },
    // scales = configure x and y axis behavior
    scales: {
      // x = horizontal axis (categories)
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
            weight: '500',
          }
        }
      },
      // y = vertical axis (values)
      y: {
        // beginAtZero = always start y-axis at 0
        beginAtZero: true,
        grid: {
          color: '#E5E7EB',
          drawBorder: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            family: 'Inter, sans-serif',
            size: 12,
          },
          // stepSize = increment between y-axis labels
          stepSize: 1,
        }
      },
    },
  };

  // Render the bar chart with data and options
  return (
    <ChartContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <ChartTitle>Equipment Type Distribution</ChartTitle>
      <ChartWrapper
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        {/* <Bar/> = react-chartjs-2 wrapper that renders Chart.js canvas element */}
        <Bar data={chartData} options={options} />
      </ChartWrapper>
    </ChartContainer>
  );
}

export default TypeDistributionChart;

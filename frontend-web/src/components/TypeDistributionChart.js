import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register( //required once tells chart.js which features u will use
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

// React component that receives type distribution data as prop
function TypeDistributionChart({ data }) { 
  // data = type_distribution object from backend (e.g., {pump: 5, valve: 3, compressor: 2})
  
  // Extract equipment type names → becomes x-axis labels
  // Object.keys() converts object keys into array: ["pump", "valve", "compressor"]
  const labels = Object.keys(data);
  
  // Extract equipment counts → becomes y-axis data points
  // Object.values() converts object values into array: [5, 3, 2]
  const values = Object.values(data);

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
        // backgroundColor = colors for each bar
        // Array of colors → first bar gets first color, second bar gets second color, etc.
        backgroundColor: [
          "#4f46e5",   // Indigo
          "#22c55e",   // Green
          "#f59e0b",   // Amber
          "#ef4444",   // Red
          "#06b6d4",   // Cyan
        ],
        // borderRadius = rounded corners on top of bars (in pixels)
        borderRadius: 6,
      },
    ],
  };

  // Chart options → configure appearance and behavior
  const options = {
    // responsive = chart resizes to fit container
    responsive: true,
    // animation = smooth transitions when chart renders
    animation: {
      // duration = animation speed in milliseconds (1200ms = 1.2 seconds)
      duration: 1200,
      // easing = animation style (easeOutQuart = smooth deceleration)
      easing: "easeOutQuart",
    },
    // plugins = customize chart features
    plugins: {
      // legend = the label box (currently hidden)
      legend: {
        // display: false = hide the legend from showing
        display: false,
      },
    },
    // scales = configure x and y axis behavior
    scales: {
      // y = vertical axis (values)
      y: {
        // beginAtZero = always start y-axis at 0
        beginAtZero: true,
      },
    },
  };

  // Render the bar chart with data and options
  // <Bar/> = react-chartjs-2 wrapper that renders Chart.js canvas element
  return <Bar data={chartData} options={options} />;
}

export default TypeDistributionChart;

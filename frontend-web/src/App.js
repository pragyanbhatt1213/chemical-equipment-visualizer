// React hooks import
import { useState } from "react";
// Import axios for making API requests
import axios from "axios";
// Component imports
import Upload from "./components/Upload";
// Import chart component to visualize equipment types
import TypeDistributionChart from "./components/TypeDistributionChart";
// Import analytics component for advanced dashboards
import Analytics from "./components/Analytics";
// Import history component to display upload history
import History from "./components/History";
// Import new modern login page
import { LoginPage } from "./components/Login";
// Import Dashboard layout
import Dashboard from "./components/Dashboard";
// Import common components and layout
import { 
  ContentSection, 
  HeroSection, 
  Button, 
  ButtonGroup, 
  MetricCard, 
  MetricValue, 
  MetricLabel, 
  MetricIcon, 
  SummaryGrid,
  PageTransition,
  StaggerContainer,
  StaggerItem,
  FadeIn
} from "./components/common";
// Import config for API endpoints
import { API_ENDPOINTS } from "./utils/config";
// Styling import (keeping for backward compatibility during transition)
import "./App.css";

// React Component → function that returns UI
function App() {
  // token → stores JWT/Token from localStorage
  // Retrieved from localStorage on page load (persists across refreshes)
  // null = user not logged in
  const [token, setToken] = useState(localStorage.getItem("token"));

  // summary → stores backend response with statistics and type distribution
  // null → nothing uploaded yet
  // When data is uploaded, this state updates automatically
  const [summary, setSummary] = useState(null);

  // dataset → stores the complete backend response including dataset ID
  // null → nothing uploaded yet
  // We use dataset.id to generate PDF download link
  const [dataset, setDataset] = useState(null);

  // handleLogin → callback from LoginPage component
  const handleLogin = (token) => {
    setToken(token);
  };

  // handleLogout → removes token from storage and state
  const handleLogout = () => {
    // Remove token from browser's localStorage
    localStorage.removeItem("token");
    // Clear token from React state
    setToken(null);
    // Clear uploaded data
    setSummary(null);
    setDataset(null);
  };

  // handleUploadSuccess → callback from Upload component
  // Receives data from backend after successful upload
  const handleUploadSuccess = (data) => {
    // Store summary for displaying statistics and charts
    setSummary(data);
    // Store dataset for accessing dataset.id for PDF generation
    setDataset(data);
  };

  // downloadFile → reusable authenticated download function
  // url → full API endpoint URL for file download
  // filename → name to save file as locally
  // Sends token in headers for authentication
  // Downloads file as blob (binary data) and triggers browser download
  const downloadFile = async (url, filename) => {
    try {
      // Make GET request with authentication token
      const response = await axios.get(url, {
        headers: {
          Authorization: `Token ${token}`, // Include token for backend authentication
        },
        responseType: "blob", // VERY IMPORTANT - tells axios to return binary data, not JSON
      });

      // Create a Blob object from the response data
      const blob = new Blob([response.data]);
      
      // Create a temporary download link
      const link = document.createElement("a");
      
      // Generate a temporary URL pointing to the blob object
      link.href = window.URL.createObjectURL(blob);
      
      // Set the filename for the downloaded file
      link.download = filename;
      
      // Trigger the browser's download behavior
      link.click();
      
      // Clean up the temporary URL to free memory
      window.URL.revokeObjectURL(link.href);
    } catch (err) {
      // Show error message if download fails
      alert("Download failed: " + (err.response?.data?.error || err.message));
    }
  };

  // CONDITIONAL RENDERING: Show Login form OR Main App
  // !token = "if NOT logged in"
  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // If user IS logged in, show the main app content
  return (
    <PageTransition>
      <Dashboard onLogout={handleLogout} userName="Demo User">
        <HeroSection
          id="dashboard"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Welcome to Chemical Equipment Visualizer</h1>
          <p>
            This application enables chemical engineers to upload equipment datasets (CSV files), 
            automatically analyze key operating parameters (flowrate, pressure, temperature), 
            visualize equipment type distribution, and generate professional reports. 
            Download your analysis in PDF, CSV, or Excel format for further processing and documentation.
          </p>
        </HeroSection>

        {/* Upload section with modern styling */}
        <FadeIn delay={0.1} id="upload">
          <Upload onUploadSuccess={handleUploadSuccess} token={token} />
        </FadeIn>

        {/* Only show summary, chart, and history if data exists */}
        {summary && (
          <StaggerContainer id="analytics">
            {/* Summary section → displays statistics in modern metric cards */}
            <StaggerItem>
              <ContentSection>
                <h2>Equipment Summary</h2>
                <SummaryGrid>
                  <MetricCard
                    variant="primary"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.3,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MetricIcon>🏭</MetricIcon>
                    <MetricLabel>Total Equipment</MetricLabel>
                    <MetricValue variant="primary">{summary.total_equipment}</MetricValue>
                  </MetricCard>

                  <MetricCard
                    variant="info"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.4,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MetricIcon>💧</MetricIcon>
                    <MetricLabel>Average Flowrate</MetricLabel>
                    <MetricValue variant="info">
                      {typeof summary.avg_flowrate === 'number' 
                        ? summary.avg_flowrate.toFixed(2) 
                        : summary.avg_flowrate}
                    </MetricValue>
                  </MetricCard>

                  <MetricCard
                    variant="warning"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.5,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MetricIcon>⚡</MetricIcon>
                    <MetricLabel>Average Pressure</MetricLabel>
                    <MetricValue variant="warning">
                      {typeof summary.avg_pressure === 'number' 
                        ? summary.avg_pressure.toFixed(2) 
                        : summary.avg_pressure}
                    </MetricValue>
                  </MetricCard>

                  <MetricCard
                    variant="error"
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.6,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -8,
                      transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <MetricIcon>🌡️</MetricIcon>
                    <MetricLabel>Average Temperature</MetricLabel>
                    <MetricValue variant="error">
                      {typeof summary.avg_temperature === 'number' 
                        ? summary.avg_temperature.toFixed(2) 
                        : summary.avg_temperature}
                    </MetricValue>
                  </MetricCard>
                </SummaryGrid>
              </ContentSection>
            </StaggerItem>

            {/* Chart section → displays equipment type distribution */}
            <StaggerItem>
              <TypeDistributionChart data={summary.type_distribution} />
            </StaggerItem>

            {/* Advanced Analytics Dashboard */}
            <StaggerItem>
              <Analytics summary={summary} equipment_data={summary.equipment_data} />
            </StaggerItem>

            {/* Exports section → grouped download options for PDF, CSV, Excel */}
            {dataset && (
              <StaggerItem>
                <ContentSection>
                  <h2>Exports</h2>
                  {/* Download buttons using new styled components */}
                  <ButtonGroup>
                    <Button
                      variant="primary"
                      onClick={() =>
                        downloadFile(
                          API_ENDPOINTS.generatePdf(dataset.id),
                          "equipment_report.pdf"
                        )
                      }
                      whileHover={{ 
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                    >
                      📄 Download PDF Report
                    </Button>

                    <Button
                      variant="secondary"
                      onClick={() =>
                        downloadFile(
                          API_ENDPOINTS.exportCsv(dataset.id),
                          "equipment_summary.csv"
                        )
                      }
                      whileHover={{ 
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    >
                      📊 Export Summary as CSV
                    </Button>

                    <Button
                      variant="success"
                      onClick={() =>
                        downloadFile(
                          API_ENDPOINTS.exportExcel(dataset.id),
                          "equipment_summary.xlsx"
                        )
                      }
                      whileHover={{ 
                        scale: 1.05,
                        y: -2,
                        transition: { duration: 0.2 }
                      }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7, duration: 0.4 }}
                    >
                      📈 Export Summary as Excel
                    </Button>
                  </ButtonGroup>
                </ContentSection>
              </StaggerItem>
            )}
          </StaggerContainer>
        )}

        {/* History section → always visible, shows upload history */}
        <FadeIn delay={0.5} id="history">
          <History token={token} />
        </FadeIn>
      </Dashboard>
    </PageTransition>
  );
}

// Makes App usable by index.js
export default App;


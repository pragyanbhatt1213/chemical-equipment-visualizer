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
// Styling import
import "./App.css";

// React Component → function that returns UI
function App() {
  // token → stores JWT/Token from localStorage
  // Retrieved from localStorage on page load (persists across refreshes)
  // null = user not logged in
  const [token, setToken] = useState(localStorage.getItem("token"));

  // username → stores username input from login form
  // User types in input → state updates
  const [username, setUsername] = useState("");

  // password → stores password input from login form
  // User types in input → state updates
  const [password, setPassword] = useState("");

  // summary → stores backend response with statistics and type distribution
  // null → nothing uploaded yet
  // When data is uploaded, this state updates automatically
  const [summary, setSummary] = useState(null);

  // dataset → stores the complete backend response including dataset ID
  // null → nothing uploaded yet
  // We use dataset.id to generate PDF download link
  const [dataset, setDataset] = useState(null);

  // handleLogin → async function to authenticate user
  // Sends username/password to backend
  // Receives token if credentials are valid
  const handleLogin = async () => {
    // Check if user entered both username and password
    if (!username || !password) {
      alert("Please enter username and password");
      return;
    }

    try {
      // POST request to backend /login/ endpoint
      // Sends username and password as JSON
      const res = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      // If successful, backend returns {token: "xyz123..."}
      // Save token to localStorage (persists even after page close)
      localStorage.setItem("token", res.data.token);

      // Update React state with token
      // Component re-renders → Login form disappears, Upload form appears
      setToken(res.data.token);

      // Clear input fields for security
      setUsername("");
      setPassword("");
    } catch (err) {
      // If login fails (wrong credentials, server error, etc.)
      // Show error message to user
      alert("Login failed: " + (err.response?.data?.error || "Invalid credentials"));
    }
  };

  // handleLogout → removes token from storage and state
  const handleLogout = () => {
    // Remove token from browser's localStorage
    localStorage.removeItem("token");
    // Clear token from React state
    setToken(null);
    // Clear form inputs
    setUsername("");
    setPassword("");
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
    return (
      <div className="container">
        <h1>Chemical Equipment Visualizer</h1>

        {/* Login section → only shown when NOT authenticated */}
        <div className="section">
          <h2>Login</h2>

          {/* Username input field */}
          {/* value={username} → shows current username state */}
          {/* onChange → updates state as user types */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
          />

          {/* Password input field */}
          {/* type="password" → masks typed characters for security */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
          />

          {/* Login button → triggers handleLogin function */}
          <button onClick={handleLogin} style={{ padding: "8px 16px" }}>
            Login
          </button>
        </div>
      </div>
    );
  }

  // If user IS logged in, show the main app content
  return (
    // container → main wrapper with CSS styling
    <div className="container">
      <h1>Chemical Equipment Visualizer</h1>

      {/* Logout button → visible when logged in */}
      {/* Shows at top right, easy to find */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={handleLogout} style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "white" }}>
          Logout
        </button>
      </div>

      <div className="section hero">
        <h1>Chemical Equipment Visualizer</h1>
        <p className="hero-text">
          This application enables chemical engineers to upload equipment datasets (CSV files), 
          automatically analyze key operating parameters (flowrate, pressure, temperature), 
          visualize equipment type distribution, and generate professional reports. 
          Download your analysis in PDF, CSV, or Excel format for further processing and documentation.
        </p>
      </div>

      {/* section → upload area with its own styling */}
      {/* Pass token prop to Upload component */}
      {/* Upload component needs token to include in API request headers */}
      <div className="section">
        {/* onUploadSuccess={handleUploadSuccess} = passing function as prop */}
        <Upload onUploadSuccess={handleUploadSuccess} token={token} />
      </div>

      {/* Only show summary, chart, and history if data exists */}
      {summary && (
        // Fragment <> </> → groups multiple elements without extra div wrapper
        <>
          {/* Summary section → displays statistics in a grid layout */}
          <div className="section">
            <h2>Summary</h2>
            {/* summary-grid → CSS grid layout for cards */}
            <div className="summary-grid">
              {/* Each summary-card displays one metric */}
              <div className="summary-card">
                Total Equipment<br />{summary.total_equipment}
              </div>
              <div className="summary-card">
                Avg Flowrate<br />{summary.avg_flowrate}
              </div>
              <div className="summary-card">
                Avg Pressure<br />{summary.avg_pressure}
              </div>
              <div className="summary-card">
                Avg Temperature<br />{summary.avg_temperature}
              </div>
            </div>
          </div>

          {/* Chart section → displays equipment type distribution */}
          <div className="section">
            <h2>Equipment Type Distribution</h2>
            {/* Display chart with type distribution data from backend */}
            <TypeDistributionChart data={summary.type_distribution} />
          </div>

          {/* Advanced Analytics Dashboard */}
          <Analytics summary={summary} equipment_data={summary.equipment_data} />

          {/* Exports section → grouped download options for PDF, CSV, Excel */}
          {dataset && (
            <div className="section">
              <h2>Exports</h2>
              {/* Download buttons grouped together for clarity */}
              {/* Each button uses downloadFile function with authentication token */}
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {/* PDF Export Button */}
                <button
                  onClick={() =>
                    downloadFile(
                      `http://localhost:8000/api/generate-pdf/${dataset.id}/`,
                      "equipment_report.pdf"
                    )
                  }
                >
                  Download PDF Report
                </button>

                {/* CSV Export Button */}
                <button
                  onClick={() =>
                    downloadFile(
                      `http://localhost:8000/api/export/csv/${dataset.id}/`,
                      "equipment_summary.csv"
                    )
                  }
                >
                  Export Summary as CSV
                </button>

                {/* Excel Export Button */}
                <button
                  onClick={() =>
                    downloadFile(
                      `http://localhost:8000/api/export/excel/${dataset.id}/`,
                      "equipment_summary.xlsx"
                    )
                  }
                >
                  Export Summary as Excel
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* History section → always visible, shows upload history */}
      <div className="section">
        <History token={token} />
      </div>
    </div>
  );
}

// Makes App usable by index.js
export default App;


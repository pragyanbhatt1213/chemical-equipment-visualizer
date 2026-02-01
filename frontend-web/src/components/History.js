import { useEffect, useState } from "react";
import { fetchHistory } from "../services/api";

// History component → displays list of previous uploads
// token → authentication token passed from parent (App.js)
function History({ token }) {
  // history → stores array of previous uploads from database
  // [] → starts as empty array
  // Updates when API returns data
  const [history, setHistory] = useState([]);

  // useEffect → runs code when component loads
  // Called once when History component mounts (appears on page)
  // Fetches upload history from backend
  useEffect(() => {
    // Fetch history from backend with authentication token
    // token → proves user is authenticated
    fetchHistory(token)
      // If successful, store the data in state
      // res.data → array of uploads from Django database
      .then((res) => setHistory(res.data))
      // If error, log to console (network error, auth failed, etc.)
      .catch((err) => console.error(err));
  }, []); // Empty dependency array [] → runs only once on component load

  // If no history exists, show message
  if (history.length === 0) {
    return <p>No previous uploads</p>;
  }

  return (
    <div>
      <h2>Upload History (Last 5)</h2>
      {/* Table to display upload records */}
      {/* border="1" → visible table borders */}
      {/* cellPadding="8" → spacing inside cells */}
      <table border="1" cellPadding="8">
        <thead>
          {/* Table header row */}
          <tr>
            <th>File Name</th>
            <th>Total Equipment</th>
            <th>Avg Temperature</th>
            <th>Uploaded At</th>
          </tr>
        </thead>
        <tbody>
          {/* Map over history array → creates <tr> for each upload */}
          {/* item → one database record (one CSV upload) */}
          {/* key={item.id} → React requires unique key for list items */}
          {history.map((item) => (
            <tr key={item.id}>
              {/* Display filename */}
              <td>{item.name}</td>
              {/* Display total equipment count for this upload */}
              <td>{item.total_equipment}</td>
              {/* Display average temperature for this upload */}
              <td>{item.avg_temperature}</td>
              {/* Convert ISO timestamp (2024-01-29T10:30:00) → readable format */}
              {/* toLocaleString() → converts to "1/29/2024, 10:30:00 AM" */}
              <td>{new Date(item.uploaded_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default History;
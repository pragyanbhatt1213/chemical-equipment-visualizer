import { useState } from "react"; // useState → React memory for storing state
import { uploadCSV } from "../services/api"; // uploadCSV function from API service

// Upload component → receives token as prop from parent (App.js)
// onUploadSuccess → callback function to send data back to parent
function Upload({ onUploadSuccess, token }) {
  // file → stores selected CSV file
  // null → no file selected yet
  const [file, setFile] = useState(null);
  
  // error → stores error message if upload fails
  // empty string → no error initially
  const [error, setError] = useState("");

  // handleUpload → async function (takes time to complete)
  // Validates file, calls API, and sends response back to parent
  const handleUpload = async () => {
    // Check if user selected a file
    if (!file) { 
      // Show error message if no file selected
      setError("Please select a CSV file");
      return; // Stop execution
    }

    // Try to upload the file
    try { 
      // Call uploadCSV function with file AND token
      // token → proves user is authenticated
      const response = await uploadCSV(file, token);
      
      // If successful, send data to parent component (App.js)
      // response.data → the summary/dataset object from backend
      onUploadSuccess(response.data);
      
      // Clear any previous errors
      setError("");
    } 
    // If API call fails (network error, 401 unauthorized, etc.)
    catch (err) {
      // Show error message from backend or generic message
      // err.response?.data?.error → Django error message if available
      setError(err.response?.data?.error || "Upload failed");
    }
  };

  return (
    <div>
      {/* File input → user selects CSV file */}
      {/* accept=".csv" → only allows CSV files in file picker */}
      {/* onChange → when user selects file, store it in state */}
      <input 
        type="file"
        accept=".csv"
        onChange={(e) => setFile(e.target.files[0])} // e.target.files[0] → first selected file
      />
      
      {/* Upload button → triggers handleUpload function */}
      <button onClick={handleUpload}>Upload CSV</button>
      
      {/* Error message → only show if error state is not empty */}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Upload;
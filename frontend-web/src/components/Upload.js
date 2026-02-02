import { useState } from "react"; // useState → React memory for storing state
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadCSV } from "../services/api"; // uploadCSV function from API service
import { Button } from './common';

// Styled components for modern upload interface
const UploadContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  padding: ${({ theme }) => theme.spacing['2xl']};
  border: 2px dashed ${({ theme, isDragOver }) => 
    isDragOver ? theme.colors.primary.light : theme.colors.gray[300]
  };
  text-align: center;
  transition: all ${({ theme }) => theme.transitions.normal};
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary.light};
    background: ${({ theme }) => `linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.primary.lightest}20 100%)`};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, 
      transparent, 
      ${({ theme }) => theme.colors.primary.lightest}20, 
      transparent
    );
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const UploadIcon = styled(motion.div)`
  font-size: ${({ theme }) => theme.typography.fontSizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.primary.light};
  opacity: 0.7;
  line-height: 1;
`;

const UploadTitle = styled.h3`
  color: ${({ theme }) => theme.colors.primary.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

const UploadDescription = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const FileInput = styled.input`
  display: none;
`;

const FileLabel = styled(motion.label)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary.light};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  transition: all ${({ theme }) => theme.transitions.normal};
  margin-bottom: ${({ theme }) => theme.spacing.lg};

  &:hover {
    background: ${({ theme }) => theme.colors.primary.medium};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const SelectedFile = styled(motion.div)`
  background: ${({ theme }) => theme.colors.gray[50]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FileName = styled.span`
  color: ${({ theme }) => theme.colors.primary.dark};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  flex: 1;
  text-align: left;
`;

const FileSize = styled.span`
  color: ${({ theme }) => theme.colors.gray[500]};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const RemoveButton = styled(motion.button)`
  background: ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  cursor: pointer;
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  
  &:hover {
    background: ${({ theme }) => theme.colors.error}dd;
  }
`;

const ErrorMessage = styled(motion.div)`
  background: ${({ theme }) => theme.colors.error}10;
  border: 1px solid ${({ theme }) => theme.colors.error}40;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &::before {
    content: '⚠️';
  }
`;

const SuccessMessage = styled(motion.div)`
  background: ${({ theme }) => theme.colors.success}10;
  border: 1px solid ${({ theme }) => theme.colors.success}40;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.success};
  margin-top: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &::before {
    content: '✅';
  }
`;

// Upload component → receives token as prop from parent (App.js)
// onUploadSuccess → callback function to send data back to parent
function Upload({ onUploadSuccess, token }) {
  // file → stores selected CSV file
  // null → no file selected yet
  const [file, setFile] = useState(null);
  
  // error → stores error message if upload fails
  // empty string → no error initially
  const [error, setError] = useState("");

  // loading state for upload process
  const [isLoading, setIsLoading] = useState(false);

  // success state for upload completion
  const [isSuccess, setIsSuccess] = useState(false);

  // drag and drop state
  const [isDragOver, setIsDragOver] = useState(false);

  // Format file size for display
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      setFile(droppedFile);
      setError("");
      setIsSuccess(false);
    } else {
      setError("Please drop a valid CSV file");
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      setIsSuccess(false);
    }
  };

  // Remove selected file
  const removeFile = () => {
    setFile(null);
    setError("");
    setIsSuccess(false);
  };

  // handleUpload → async function (takes time to complete)
  // Validates file, calls API, and sends response back to parent
  const handleUpload = async () => {
    // Check if user selected a file
    if (!file) { 
      // Show error message if no file selected
      setError("Please select a CSV file");
      return; // Stop execution
    }

    setIsLoading(true);
    setError("");
    setIsSuccess(false);

    // Try to upload the file
    try { 
      // Call uploadCSV function with file AND token
      // token → proves user is authenticated
      const response = await uploadCSV(file, token);
      
      // If successful, send data to parent component (App.js)
      // response.data → the summary/dataset object from backend
      onUploadSuccess(response.data);
      
      // Clear any previous errors and show success
      setError("");
      setIsSuccess(true);
      
      // Clear file after successful upload
      setTimeout(() => {
        setFile(null);
        setIsSuccess(false);
      }, 3000);
    } 
    // If API call fails (network error, 401 unauthorized, etc.)
    catch (err) {
      // Show error message from backend or generic message
      // err.response?.data?.error → Django error message if available
      setError(err.response?.data?.error || "Upload failed");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UploadContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      isDragOver={isDragOver}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <UploadIcon
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        📁
      </UploadIcon>
      
      <UploadTitle>Upload Equipment Data</UploadTitle>
      <UploadDescription>
        Drag and drop your CSV file here, or click to browse
      </UploadDescription>

      <FileInput
        id="file-upload"
        type="file"
        accept=".csv"
        onChange={handleFileSelect}
      />
      
      <FileLabel
        htmlFor="file-upload"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        📎 Choose CSV File
      </FileLabel>

      <AnimatePresence>
        {file && (
          <SelectedFile
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FileName>{file.name}</FileName>
            <FileSize>{formatFileSize(file.size)}</FileSize>
            <RemoveButton
              onClick={removeFile}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ✕
            </RemoveButton>
          </SelectedFile>
        )}
      </AnimatePresence>

      {file && (
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={isLoading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{ marginTop: '1rem' }}
        >
          {isLoading ? '⏳ Uploading...' : '🚀 Upload & Analyze'}
        </Button>
      )}

      <AnimatePresence>
        {error && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {error}
          </ErrorMessage>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSuccess && (
          <SuccessMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            File uploaded successfully! Analysis complete.
          </SuccessMessage>
        )}
      </AnimatePresence>
    </UploadContainer>
  );
}

export default Upload;
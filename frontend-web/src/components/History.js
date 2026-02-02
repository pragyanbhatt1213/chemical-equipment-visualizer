import { useEffect, useState } from "react";
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchHistory } from "../services/api";

// Styled components for modern history interface
const HistoryContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  box-shadow: ${({ theme }) => theme.shadows.base};
`;

const HistoryTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primary.dark};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &::before {
    content: '📋';
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }
`;

const HistoryTable = styled(motion.table)`
  width: 100%;
  border-collapse: collapse;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.sm};

  thead {
    background: ${({ theme }) => theme.colors.primary.lightest};
  }

  th {
    padding: ${({ theme }) => theme.spacing.md};
    text-align: left;
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.primary.dark};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    padding: ${({ theme }) => theme.spacing.md};
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
    color: ${({ theme }) => theme.colors.gray[700]};
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.xs};
    
    th, td {
      padding: ${({ theme }) => theme.spacing.sm};
    }
  }
`;

const HistoryRow = styled(motion.tr)`
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    transform: scale(1.01);
  }

  &:last-child td {
    border-bottom: none;
  }
`;

const EmptyState = styled(motion.div)`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.gray[500]};
`;

const EmptyIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes['4xl']};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  opacity: 0.5;
`;

const EmptyText = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const EmptySubtext = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin: 0;
`;

const LoadingSpinner = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
`;

// History component → displays list of previous uploads
// token → authentication token passed from parent (App.js)
function History({ token }) {
  // history → stores array of previous uploads from database
  // [] → starts as empty array
  // Updates when API returns data
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect → runs code when component loads
  // Called once when History component mounts (appears on page)
  // Fetches upload history from backend
  useEffect(() => {
    // Fetch history from backend with authentication token
    // token → proves user is authenticated
    if (token) {
      setIsLoading(true);
      fetchHistory(token)
        // If successful, store the data in state
        // res.data → array of uploads from Django database
        .then((res) => {
          setHistory(res.data);
          setIsLoading(false);
        })
        // If error, log to console (network error, auth failed, etc.)
        .catch((err) => {
          console.error(err);
          setIsLoading(false);
        });
    }
  }, [token]); // Dependency array includes token → re-runs if token changes

  // Loading state
  if (isLoading) {
    return (
      <HistoryContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HistoryTitle>Upload History</HistoryTitle>
        <LoadingSpinner
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          ⏳ Loading history...
        </LoadingSpinner>
      </HistoryContainer>
    );
  }

  // If no history exists, show message
  if (history.length === 0) {
    return (
      <HistoryContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <HistoryTitle>Upload History</HistoryTitle>
        <EmptyState
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <EmptyIcon>📂</EmptyIcon>
          <EmptyText>No previous uploads</EmptyText>
          <EmptySubtext>Upload your first CSV file to see it here</EmptySubtext>
        </EmptyState>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <HistoryTitle>Upload History (Last 5)</HistoryTitle>
      
      <HistoryTable
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <thead>
          <tr>
            <th>File Name</th>
            <th>Total Equipment</th>
            <th>Avg Temperature</th>
            <th>Uploaded At</th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {/* Map over history array → creates <tr> for each upload */}
            {/* item → one database record (one CSV upload) */}
            {/* key={item.id} → React requires unique key for list items */}
            {history.map((item, index) => (
              <HistoryRow
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  delay: 0.3 + index * 0.1, 
                  duration: 0.4 
                }}
                whileHover={{ 
                  scale: 1.02,
                  transition: { duration: 0.2 }
                }}
              >
                {/* Display filename */}
                <td>
                  <strong>{item.name}</strong>
                </td>
                {/* Display total equipment count for this upload */}
                <td>{item.total_equipment}</td>
                {/* Display average temperature for this upload */}
                <td>{item.avg_temperature}°C</td>
                {/* Convert ISO timestamp (2024-01-29T10:30:00) → readable format */}
                {/* toLocaleString() → converts to "1/29/2024, 10:30:00 AM" */}
                <td>{new Date(item.uploaded_at).toLocaleString()}</td>
              </HistoryRow>
            ))}
          </AnimatePresence>
        </tbody>
      </HistoryTable>
    </HistoryContainer>
  );
}

export default History;
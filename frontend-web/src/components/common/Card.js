import styled from 'styled-components';
import { motion } from 'framer-motion';

// Base Card component with modern styling
export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.base};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: all ${({ theme }) => theme.transitions.normal};
  border: 1px solid ${({ theme }) => theme.colors.gray[100]};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-1px);
    border-color: ${({ theme }) => theme.colors.gray[200]};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

// Metric Card for displaying statistics
export const MetricCard = styled(Card)`
  text-align: center;
  position: relative;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing['2xl']};
  background: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.primary.lightest}40 100%)`;
      case 'success':
        return `linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.success}06 100%)`;
      case 'warning':
        return `linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.warning}06 100%)`;
      case 'error':
        return `linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.error}06 100%)`;
      case 'info':
        return `linear-gradient(135deg, ${theme.colors.white} 0%, ${theme.colors.info}06 100%)`;
      default:
        return theme.colors.white;
    }
  }};
  border-left: 3px solid ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary.light;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.primary.light;
    }
  }};

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    
    &::before {
      opacity: 1;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${({ variant, theme }) => {
      switch (variant) {
        case 'primary':
          return `linear-gradient(90deg, ${theme.colors.primary.light}, ${theme.colors.primary.accent})`;
        case 'success':
          return `linear-gradient(90deg, ${theme.colors.success}, ${theme.colors.primary.accent})`;
        case 'warning':
          return `linear-gradient(90deg, ${theme.colors.warning}, ${theme.colors.primary.accent})`;
        case 'error':
          return `linear-gradient(90deg, ${theme.colors.error}, ${theme.colors.primary.accent})`;
        case 'info':
          return `linear-gradient(90deg, ${theme.colors.info}, ${theme.colors.primary.accent})`;
        default:
          return `linear-gradient(90deg, ${theme.colors.primary.light}, ${theme.colors.primary.accent})`;
      }
    }};
    opacity: 0;
    transition: opacity ${({ theme }) => theme.transitions.normal};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

// Metric Value component for large numbers
export const MetricValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary.dark;
      case 'success':
        return theme.colors.success;
      case 'warning':
        return theme.colors.warning;
      case 'error':
        return theme.colors.error;
      case 'info':
        return theme.colors.info;
      default:
        return theme.colors.primary.dark;
    }
  }};
  margin: ${({ theme }) => theme.spacing.md} 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};
  letter-spacing: -0.02em;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }
`;

// Metric Label component for descriptions
export const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.gray[500]};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

// Metric Description component for additional info
export const MetricDescription = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.xs};
  color: ${({ theme }) => theme.colors.gray[500]};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-style: italic;
`;

// Summary Grid for organizing metric cards
export const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: ${({ theme }) => theme.spacing.xl};
  margin: ${({ theme }) => theme.spacing['2xl']} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

// Icon wrapper for metric cards
export const MetricIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  opacity: 0.7;
  line-height: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  }
`;

// Chart Card for wrapping visualizations
export const ChartCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing['2xl']};

  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.xl};
    color: ${({ theme }) => theme.colors.primary.dark};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    letter-spacing: -0.01em;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
    
    h3 {
      font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    }
  }
`;

// Section wrapper
export const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing['2xl']};

  &:last-child {
    margin-bottom: 0;
  }
`;

export default Card;
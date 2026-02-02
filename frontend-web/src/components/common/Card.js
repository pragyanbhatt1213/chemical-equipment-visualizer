import styled from 'styled-components';
import { motion } from 'framer-motion';

// Base Card component with modern styling
export const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.base};
  padding: ${({ theme }) => theme.spacing.lg};
  transition: all ${({ theme }) => theme.transitions.normal};

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

// Metric Card for displaying statistics
export const MetricCard = styled(Card)`
  text-align: center;
  position: relative;
  overflow: hidden;
  background: ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return theme.colors.primary.lightest;
      case 'success':
        return `${theme.colors.success}08`;
      case 'warning':
        return `${theme.colors.warning}08`;
      case 'error':
        return `${theme.colors.error}08`;
      case 'info':
        return `${theme.colors.info}08`;
      default:
        return theme.colors.white;
    }
  }};
  border-left: 4px solid ${({ variant, theme }) => {
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
    transform: translateY(-4px);
    box-shadow: ${({ theme }) => theme.shadows.xl};
    
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
    height: 2px;
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
  margin: ${({ theme }) => theme.spacing.sm} 0;
  line-height: ${({ theme }) => theme.typography.lineHeights.tight};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }
`;

// Metric Label component for descriptions
export const MetricLabel = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.gray[600]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
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
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

// Icon wrapper for metric cards
export const MetricIcon = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  opacity: 0.8;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }
`;

// Chart Card for wrapping visualizations
export const ChartCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};

  h3 {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    color: ${({ theme }) => theme.colors.primary.dark};
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
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
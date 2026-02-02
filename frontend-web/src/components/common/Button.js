import styled from 'styled-components';
import { motion } from 'framer-motion';

// Base Button component with variants
export const Button = styled(motion.button)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return `${theme.spacing.sm} ${theme.spacing.md}`;
      case 'lg':
        return `${theme.spacing.md} ${theme.spacing.xl}`;
      default:
        return `${theme.spacing.sm} ${theme.spacing.lg}`;
    }
  }};
  font-size: ${({ size, theme }) => {
    switch (size) {
      case 'sm':
        return theme.typography.fontSizes.sm;
      case 'lg':
        return theme.typography.fontSizes.lg;
      default:
        return theme.typography.fontSizes.base;
    }
  }};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 2px solid transparent;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  text-decoration: none;
  
  // Variant styles
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary.light};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.medium};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
          
          &:active {
            transform: translateY(0);
          }
        `;
      case 'secondary':
        return `
          background: ${theme.colors.white};
          color: ${theme.colors.primary.light};
          border-color: ${theme.colors.primary.light};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.lightest};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
        `;
      case 'success':
        return `
          background: ${theme.colors.success};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.success}dd;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.warning}dd;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
        `;
      case 'error':
        return `
          background: ${theme.colors.error};
          color: ${theme.colors.white};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.error}dd;
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
        `;
      case 'ghost':
        return `
          background: transparent;
          color: ${theme.colors.primary.light};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.primary.lightest};
          }
        `;
      default:
        return `
          background: ${theme.colors.gray[100]};
          color: ${theme.colors.gray[700]};
          
          &:hover:not(:disabled) {
            background: ${theme.colors.gray[200]};
            transform: translateY(-1px);
            box-shadow: ${theme.shadows.md};
          }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.lightest};
  }
`;

// Icon Button for actions with icons
export const IconButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  min-width: auto;
  width: 40px;
  height: 40px;
`;

// Button Group for related actions
export const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    
    ${Button} {
      width: 100%;
    }
  }
`;

export default Button;
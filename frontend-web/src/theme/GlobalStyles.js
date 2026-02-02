import { createGlobalStyle } from 'styled-components';

// Global styles for the application
export const GlobalStyles = createGlobalStyle`
  // CSS Reset and base styles
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: ${({ theme }) => theme.typography.fontFamily.primary};
    font-weight: ${({ theme }) => theme.typography.fontWeights.regular};
    line-height: ${({ theme }) => theme.typography.lineHeights.normal};
    color: ${({ theme }) => theme.colors.primary.darkest};
    background-color: ${({ theme }) => theme.colors.gray[50]};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  // Headings
  h1, h2, h3, h4, h5, h6 {
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    line-height: ${({ theme }) => theme.typography.lineHeights.tight};
    color: ${({ theme }) => theme.colors.primary.darkest};
  }

  h1 {
    font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  }

  h2 {
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  }

  h3 {
    font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  }

  h4 {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  }

  h5, h6 {
    font-size: ${({ theme }) => theme.typography.fontSizes.base};
  }

  // Links
  a {
    color: ${({ theme }) => theme.colors.info};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};

    &:hover {
      color: ${({ theme }) => theme.colors.primary.light};
    }
  }

  // Buttons base styles
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    outline: none;
    transition: all ${({ theme }) => theme.transitions.normal};

    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  // Form elements
  input, textarea, select {
    font-family: inherit;
    font-size: ${({ theme }) => theme.typography.fontSizes.base};
    border: 1px solid ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    transition: border-color ${({ theme }) => theme.transitions.fast};

    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary.light};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.lightest};
    }

    &::placeholder {
      color: ${({ theme }) => theme.colors.gray[400]};
    }
  }

  // Tables
  table {
    width: 100%;
    border-collapse: collapse;
    font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  }

  th, td {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  }

  th {
    font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.primary.dark};
    background-color: ${({ theme }) => theme.colors.gray[50]};
  }

  // Scrollbar styling
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.gray[100]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.gray[300]};
    border-radius: ${({ theme }) => theme.borderRadius.sm};

    &:hover {
      background: ${({ theme }) => theme.colors.gray[400]};
    }
  }

  // Utility classes
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .text-center {
    text-align: center;
  }

  .text-left {
    text-align: left;
  }

  .text-right {
    text-align: right;
  }

  // Animation keyframes
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes scaleIn {
    from {
      opacity: 0;
      transform: scale(0.95);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  // Responsive utilities
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    body {
      font-size: 14px;
    }

    h1 {
      font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
    }

    h2 {
      font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    }
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    body {
      font-size: 14px;
    }

    h1 {
      font-size: ${({ theme }) => theme.typography.fontSizes.xl};
    }

    h2 {
      font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    }
  }
`;
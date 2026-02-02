// Design System Theme Configuration
// Green Color Palette and Typography System

export const theme = {
  // Color Palette - Green Design System
  colors: {
    // Primary Green Palette
    primary: {
      darkest: '#051F20',    // deepest green for headers, primary text
      dark: '#0B2B26',       // secondary backgrounds, borders
      medium: '#163832',     // card backgrounds, subtle elements
      light: '#235347',      // interactive elements, buttons
      accent: '#8EB69B',     // highlights, success states
      lightest: '#DAF1DE',   // backgrounds, subtle highlights
    },
    
    // Accent Colors
    success: '#20D9A0',      // positive indicators, success messages
    warning: '#FFB020',      // warning states, medium risk indicators
    error: '#FF4444',        // error states, high risk indicators
    info: '#4A90E2',         // informational elements, links
    
    // Neutral Colors
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827',
    },
  },

  // Typography System
  typography: {
    fontFamily: {
      primary: '"Inter", "Segoe UI", "Roboto", system-ui, sans-serif',
      fallback: '"Segoe UI", "Roboto", system-ui, sans-serif',
    },
    fontWeights: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSizes: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '48px',
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },

  // Spacing System (8px base unit) - Enhanced for better breathing room
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
    '5xl': '128px',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Shadows - Softer and more subtle for modern 2026 look
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.06), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.03)',
  },

  // Breakpoints for responsive design
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1200px',
  },

  // Animation timing - Smoother and more refined
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Z-index scale
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modal: 1040,
    popover: 1050,
    tooltip: 1060,
  },
};

// Chart color palettes for consistent visualization
export const chartColors = {
  // Primary chart colors using green palette
  primary: [
    theme.colors.primary.light,
    theme.colors.primary.accent,
    theme.colors.primary.medium,
    theme.colors.success,
    theme.colors.info,
    theme.colors.primary.dark,
  ],
  
  // Risk-based colors
  risk: {
    high: theme.colors.error,
    medium: theme.colors.warning,
    low: theme.colors.success,
  },
  
  // Status colors
  status: {
    excellent: theme.colors.success,
    good: theme.colors.info,
    fair: theme.colors.warning,
    poor: theme.colors.error,
  },
};

export default theme;
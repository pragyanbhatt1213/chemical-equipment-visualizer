import { render, screen } from '@testing-library/react';
import App from './App';
import ThemeProvider from './theme/ThemeProvider';

// Helper function to render components with theme
const renderWithTheme = (component) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  );
};

test('renders login page when not authenticated', () => {
  // Clear any existing token
  localStorage.removeItem('token');
  
  renderWithTheme(<App />);
  
  // Check for login page elements
  const welcomeText = screen.getByText(/Welcome Back/i);
  const signInText = screen.getByText(/Sign in to access your dashboard/i);
  
  expect(welcomeText).toBeInTheDocument();
  expect(signInText).toBeInTheDocument();
});

test('renders branding panel with application title', () => {
  // Clear any existing token
  localStorage.removeItem('token');
  
  renderWithTheme(<App />);
  
  // Check for branding elements
  const appTitle = screen.getByText(/Chemical Equipment Visualizer/i);
  const subtitle = screen.getByText(/Advanced analytics and visualization platform/i);
  
  expect(appTitle).toBeInTheDocument();
  expect(subtitle).toBeInTheDocument();
});

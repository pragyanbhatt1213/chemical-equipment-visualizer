import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Button } from '../common';
import { API_ENDPOINTS } from '../../utils/config';
import axios from 'axios';

// Split-panel login layout
const LoginContainer = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

// Left panel with branding and gradient
const BrandingPanel = styled(motion.div)`
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary.darkest} 0%,
    ${({ theme }) => theme.colors.primary.dark} 25%,
    ${({ theme }) => theme.colors.primary.medium} 50%,
    ${({ theme }) => theme.colors.primary.light} 75%,
    ${({ theme }) => theme.colors.primary.accent} 100%
  );
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['3xl']};
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
    opacity: 0.3;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
    min-height: 200px;
  }
`;

const BrandingContent = styled.div`
  text-align: center;
  z-index: 1;
  max-width: 400px;
`;

const Logo = styled(motion.div)`
  width: 80px;
  height: 80px;
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary.light};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

const BrandTitle = styled(motion.h1)`
  font-size: ${({ theme }) => theme.typography.fontSizes['3xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  }
`;

const BrandSubtitle = styled(motion.p)`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  opacity: 0.9;
  line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    font-size: ${({ theme }) => theme.typography.fontSizes.base};
  }
`;

const FeatureList = styled(motion.ul)`
  list-style: none;
  text-align: left;
  
  li {
    display: flex;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.typography.fontSizes.base};
    opacity: 0.9;
    
    &::before {
      content: '✓';
      margin-right: ${({ theme }) => theme.spacing.sm};
      color: ${({ theme }) => theme.colors.success};
      font-weight: bold;
    }
  }
`;

// Right panel with login form
const FormPanel = styled(motion.div)`
  background: ${({ theme }) => theme.colors.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing['3xl']};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

const FormContainer = styled.div`
  width: 100%;
  max-width: 400px;
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSizes['2xl']};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.primary.darkest};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  text-align: center;
`;

const FormSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.gray[600]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  font-size: ${({ theme }) => theme.typography.fontSizes.base};
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Label = styled.label`
  display: block;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const Input = styled.input.withConfig({
  shouldForwardProp: (prop) => prop !== 'hasError',
})`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.base};
  transition: all ${({ theme }) => theme.transitions.normal};
  background: ${({ theme }) => theme.colors.white};

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.light};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary.lightest};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray[400]};
  }

  ${({ hasError, theme }) => hasError && `
    border-color: ${theme.colors.error};
    
    &:focus {
      border-color: ${theme.colors.error};
      box-shadow: 0 0 0 3px ${theme.colors.error}20;
    }
  `}
`;

const ErrorMessage = styled(motion.div)`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &::before {
    content: '⚠';
  }
`;

const LoginButton = styled(Button)`
  width: 100%;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSizes.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const DemoCredentials = styled(motion.div)`
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary.lightest};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ theme }) => theme.colors.primary.light};
`;

const DemoTitle = styled.h4`
  color: ${({ theme }) => theme.colors.primary.dark};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
`;

const DemoText = styled.p`
  color: ${({ theme }) => theme.colors.primary.medium};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
  margin: 0;
  
  code {
    background: ${({ theme }) => theme.colors.white};
    padding: 2px 6px;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
};

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(API_ENDPOINTS.login, {
        username,
        password,
      });

      // Save token and call parent callback
      localStorage.setItem('token', response.data.token);
      onLogin(response.data.token);
      
      // Clear form
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      <BrandingPanel
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <BrandingContent>
          <Logo
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
          >
            ⚗️
          </Logo>
          
          <BrandTitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Chemical Equipment Visualizer
          </BrandTitle>
          
          <BrandSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
          >
            Advanced analytics and visualization platform for chemical engineers
          </BrandSubtitle>
          
          <FeatureList
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.li variants={itemVariants}>Upload and analyze equipment datasets</motion.li>
            <motion.li variants={itemVariants}>Generate professional reports</motion.li>
            <motion.li variants={itemVariants}>Advanced health scoring and outlier detection</motion.li>
            <motion.li variants={itemVariants}>Export to PDF, CSV, and Excel formats</motion.li>
          </FeatureList>
        </BrandingContent>
      </BrandingPanel>

      <FormPanel
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
      >
        <FormContainer>
          <FormTitle>Welcome Back</FormTitle>
          <FormSubtitle>Sign in to access your dashboard</FormSubtitle>

          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                hasError={error && !username}
                disabled={isLoading}
              />
            </FormGroup>

            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                hasError={error && !password}
                disabled={isLoading}
              />
            </FormGroup>

            {error && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {error}
              </ErrorMessage>
            )}

            <LoginButton
              type="submit"
              variant="primary"
              disabled={isLoading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </LoginButton>
          </form>

          <DemoCredentials
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            <DemoTitle>Demo Credentials</DemoTitle>
            <DemoText>
              Username: <code>demo</code><br />
              Password: <code>demo123</code>
            </DemoText>
          </DemoCredentials>
        </FormContainer>
      </FormPanel>
    </LoginContainer>
  );
};

export default LoginPage;
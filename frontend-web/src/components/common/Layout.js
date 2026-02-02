import styled from 'styled-components';
import { motion } from 'framer-motion';

// Global scroll behavior
const GlobalStyles = `
  html {
    scroll-behavior: smooth;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = GlobalStyles;
  document.head.appendChild(style);
}

// Main container for the application
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

// Grid system for responsive layouts
export const Grid = styled.div`
  display: grid;
  grid-template-columns: ${({ columns }) => `repeat(${columns || 1}, 1fr)`};
  gap: ${({ gap, theme }) => gap || theme.spacing.lg};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: ${({ tabletColumns }) => 
      tabletColumns ? `repeat(${tabletColumns}, 1fr)` : '1fr'
    };
    gap: ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

// Flex utilities
export const Flex = styled.div`
  display: flex;
  align-items: ${({ align }) => align || 'stretch'};
  justify-content: ${({ justify }) => justify || 'flex-start'};
  gap: ${({ gap, theme }) => gap || theme.spacing.md};
  flex-direction: ${({ direction }) => direction || 'row'};
  flex-wrap: ${({ wrap }) => wrap || 'nowrap'};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    flex-direction: ${({ mobileDirection }) => mobileDirection || 'column'};
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

// Page wrapper with animations
export const PageWrapper = styled(motion.div)`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[50]};
`;

// Content section
export const ContentSection = styled(motion.section)`
  background: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.base};
  padding: ${({ theme }) => theme.spacing['2xl']};
  margin-bottom: ${({ theme }) => theme.spacing.xl};

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.xl};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.lg};
    border-radius: ${({ theme }) => theme.borderRadius.md};
  }
`;

// Hero section for landing/main content
export const HeroSection = styled(ContentSection)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.light}, ${({ theme }) => theme.colors.primary.accent});
  color: ${({ theme }) => theme.colors.white};
  text-align: center;

  h1 {
    color: ${({ theme }) => theme.colors.white};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }

  p {
    font-size: ${({ theme }) => theme.typography.fontSizes.lg};
    opacity: 0.95;
    max-width: 700px;
    margin: 0 auto;
    line-height: ${({ theme }) => theme.typography.lineHeights.relaxed};
  }
`;

// Sidebar layout
export const SidebarLayout = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100vh;
  gap: 0;
  background: ${({ theme }) => theme.colors.gray[50]};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

export const Sidebar = styled(motion.aside)`
  background: ${({ theme }) => theme.colors.primary.darkest};
  color: ${({ theme }) => theme.colors.white};
  padding: ${({ theme }) => theme.spacing.xl};
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width ${({ theme }) => theme.transitions.normal} ease-in-out;
  box-sizing: border-box;
  flex-shrink: 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    position: fixed;
    top: 0;
    left: ${({ isOpen }) => isOpen ? '0' : '-100%'};
    width: 250px;
    z-index: ${({ theme }) => theme.zIndex.modal};
    transition: left ${({ theme }) => theme.transitions.normal} ease-in-out;
    box-shadow: ${({ isOpen, theme }) => 
      isOpen ? theme.shadows.xl : 'none'
    };
    height: 100vh;
    padding: ${({ theme }) => theme.spacing.xl};
  }
`;

export const MainContent = styled.main`
  padding: 0;
  overflow-x: hidden;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.colors.gray[50]};
  transition: all 0.3s ease-in-out;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0;
  }
`;

// Top bar for dashboard
export const TopBar = styled.header`
  background: ${({ theme }) => theme.colors.white};
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray[200]};
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.xl};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.sm};
  }
`;

export default Container;
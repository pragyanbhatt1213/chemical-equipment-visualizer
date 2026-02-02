import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SidebarLayout, 
  Sidebar, 
  MainContent, 
  TopBar, 
  Flex 
} from './common/Layout';
import { Button, IconButton } from './common/Button';

// Dashboard-specific styled components
const DashboardContainer = styled.div`
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.gray[50]};
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const SidebarHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.lg} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.primary.dark};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Logo = styled.h1`
  color: ${({ theme }) => theme.colors.white};
  font-size: ${({ theme }) => theme.typography.fontSizes.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  margin: 0;
`;

const Navigation = styled.nav`
  flex: 1;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled(motion.li)`
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const NavLink = styled.button`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ isActive, theme }) => 
    isActive ? theme.colors.primary.light : 'transparent'
  };
  color: ${({ theme }) => theme.colors.white};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-align: left;
  font-size: ${({ theme }) => theme.typography.fontSizes.base};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.normal};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  &:hover {
    background: ${({ theme }) => theme.colors.primary.medium};
    transform: translateX(4px);
  }

  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary.accent};
    outline-offset: 2px;
  }
`;

const NavIcon = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSizes.lg};
  width: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CollapseButton = styled(IconButton)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.lg};
  right: -12px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.primary.darkest};
  border: 2px solid ${({ theme }) => theme.colors.gray[200]};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  
  &:hover {
    background: ${({ theme }) => theme.colors.gray[50]};
    border-color: ${({ theme }) => theme.colors.primary.light};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: none;
  }
`;

const MobileMenuButton = styled(IconButton)`
  display: none;
  background: ${({ theme }) => theme.colors.primary.light};
  color: ${({ theme }) => theme.colors.white};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: flex;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary.light};
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: ${({ theme }) => theme.typography.fontWeights.semibold};
  font-size: ${({ theme }) => theme.typography.fontSizes.sm};
`;

const UserName = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary.darkest};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    display: none;
  }
`;

const ContentArea = styled(motion.div)`
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const MobileOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: ${({ theme }) => theme.zIndex.modal - 1};
  display: none;

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    display: block;
  }
`;

// Navigation items configuration
const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/' },
  { id: 'upload', label: 'Upload Data', icon: '📤', path: '/upload' },
  { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
  { id: 'history', label: 'History', icon: '📋', path: '/history' },
  { id: 'reports', label: 'Reports', icon: '📄', path: '/reports' },
];

const Dashboard = ({ children, onLogout, userName = 'Demo User' }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('dashboard');

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavClick = (navId) => {
    setActiveNav(navId);
    setMobileMenuOpen(false);
    
    // Scroll to section
    const sectionId = navId === 'dashboard' ? 'hero-section' : navId;
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const sidebarVariants = {
    expanded: { width: 250 },
    collapsed: { width: 80 }
  };

  const contentVariants = {
    expanded: { marginLeft: 0 },
    collapsed: { marginLeft: 0 }
  };

  return (
    <DashboardContainer>
      <SidebarLayout>
        {/* Sidebar */}
        <Sidebar
          as={motion.aside}
          variants={sidebarVariants}
          animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          isOpen={mobileMenuOpen}
          style={{ position: 'relative' }}
        >
          <CollapseButton
            onClick={toggleSidebar}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </CollapseButton>

          <SidebarContent>
            <SidebarHeader>
              <Logo>
                {sidebarCollapsed ? 'CEV' : 'Chemical Equipment Visualizer'}
              </Logo>
            </SidebarHeader>

            <Navigation>
              <NavList>
                {navigationItems.map((item) => (
                  <NavItem
                    key={item.id}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <NavLink
                      isActive={activeNav === item.id}
                      onClick={() => handleNavClick(item.id)}
                      title={sidebarCollapsed ? item.label : undefined}
                    >
                      <NavIcon>{item.icon}</NavIcon>
                      <AnimatePresence>
                        {!sidebarCollapsed && (
                          <motion.span
                            initial={{ opacity: 0, width: 0 }}
                            animate={{ opacity: 1, width: 'auto' }}
                            exit={{ opacity: 0, width: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </NavLink>
                  </NavItem>
                ))}
              </NavList>
            </Navigation>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <motion.div
          variants={contentVariants}
          animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
        >
          {/* Top Bar */}
          <TopBar>
            <Flex align="center" gap="1rem">
              <MobileMenuButton
                onClick={toggleMobileMenu}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ☰
              </MobileMenuButton>
              <h2 style={{ margin: 0, color: '#051F20' }}>
                {navigationItems.find(item => item.id === activeNav)?.label || 'Dashboard'}
              </h2>
            </Flex>

            <Flex align="center" gap="1rem">
              <UserInfo>
                <UserAvatar>
                  {userName.split(' ').map(n => n[0]).join('').toUpperCase()}
                </UserAvatar>
                <UserName>{userName}</UserName>
              </UserInfo>
              <Button
                variant="error"
                onClick={onLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </Button>
            </Flex>
          </TopBar>

          {/* Main Content */}
          <MainContent>
            <ContentArea
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {children}
            </ContentArea>
          </MainContent>
        </motion.div>
      </SidebarLayout>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <MobileOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleMobileMenu}
          />
        )}
      </AnimatePresence>
    </DashboardContainer>
  );
};

export default Dashboard;
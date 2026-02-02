import { motion } from 'framer-motion';
import styled from 'styled-components';

// Page transition wrapper
const TransitionWrapper = styled(motion.div)`
  width: 100%;
  min-height: 100vh;
`;

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -20,
    scale: 1.02,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.6,
};

// Stagger container for child animations
const staggerContainer = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

// Individual item animation
const staggerItem = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.3,
    },
  },
};

// Page transition component
export const PageTransition = ({ children, ...props }) => {
  return (
    <TransitionWrapper
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      {...props}
    >
      {children}
    </TransitionWrapper>
  );
};

// Stagger container component for animating lists/grids
export const StaggerContainer = ({ children, ...props }) => {
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      exit="exit"
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger item component for individual items in lists/grids
export const StaggerItem = ({ children, ...props }) => {
  return (
    <motion.div
      variants={staggerItem}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Fade in animation component
export const FadeIn = ({ children, delay = 0, duration = 0.6, ...props }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ 
        duration, 
        delay,
        ease: 'easeOut'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Slide in animation component
export const SlideIn = ({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 0.6, 
  distance = 30,
  ...props 
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance };
      case 'down':
        return { y: -distance };
      case 'left':
        return { x: distance };
      case 'right':
        return { x: -distance };
      default:
        return { y: distance };
    }
  };

  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        ...getInitialPosition() 
      }}
      animate={{ 
        opacity: 1, 
        x: 0, 
        y: 0 
      }}
      exit={{ 
        opacity: 0, 
        ...getInitialPosition() 
      }}
      transition={{ 
        duration, 
        delay,
        ease: 'easeOut'
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scale in animation component
export const ScaleIn = ({ 
  children, 
  delay = 0, 
  duration = 0.5, 
  initialScale = 0.8,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: initialScale 
      }}
      animate={{ 
        opacity: 1, 
        scale: 1 
      }}
      exit={{ 
        opacity: 0, 
        scale: initialScale 
      }}
      transition={{ 
        duration, 
        delay,
        type: 'spring',
        stiffness: 100
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Bounce in animation component
export const BounceIn = ({ 
  children, 
  delay = 0, 
  duration = 0.8,
  ...props 
}) => {
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        scale: 0.3 
      }}
      animate={{ 
        opacity: 1, 
        scale: 1 
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.3 
      }}
      transition={{ 
        duration, 
        delay,
        type: 'spring',
        stiffness: 200,
        damping: 10
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
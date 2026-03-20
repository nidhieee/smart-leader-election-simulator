import { Variants } from 'framer-motion';

export const pulseAnimation: Variants = {
  initial: { scale: 1, opacity: 1 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.7, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const glowAnimation: Variants = {
  initial: { boxShadow: '0 0 0 rgba(59, 130, 246, 0)' },
  animate: {
    boxShadow: [
      '0 0 0 rgba(59, 130, 246, 0)',
      '0 0 20px rgba(59, 130, 246, 0.6)',
      '0 0 0 rgba(59, 130, 246, 0)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const messageFlowAnimation: Variants = {
  initial: { opacity: 0, scale: 0 },
  animate: {
    opacity: [0, 1, 1, 0],
    scale: [0, 1, 1, 0],
    transition: {
      duration: 1.5,
      times: [0, 0.2, 0.8, 1],
    },
  },
};

export const heartbeatPulse: Variants = {
  initial: { r: 3 },
  animate: {
    r: [3, 8, 3],
    opacity: [1, 0.3, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
    },
  },
};

export const electionMessageAnimation: Variants = {
  initial: { pathLength: 0 },
  animate: {
    pathLength: [0, 1],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};

export const nodeShakeAnimation: Variants = {
  initial: { x: 0 },
  shake: {
    x: [-5, 5, -5, 5, 0],
    transition: {
      duration: 0.4,
    },
  },
};

export const leaderChangeAnimation: Variants = {
  initial: { scale: 1, rotate: 0 },
  animate: {
    scale: [1, 1.1, 1],
    rotate: [0, 6, -6, 0],
    transition: {
      duration: 0.6,
    },
  },
};

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export const slideInLeft: Variants = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, x: 50, transition: { duration: 0.2 } },
};

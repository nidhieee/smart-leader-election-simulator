import { Variants } from 'framer-motion';

// Heartbeat pulse animation
export const heartbeatPulse: Variants = {
  initial: { opacity: 1, scale: 1 },
  animate: {
    opacity: [1, 0.5, 1],
    scale: [1, 1.1, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// Leader glow effect
export const leaderGlow: Variants = {
  initial: { boxShadow: '0 0 0 0px rgba(34, 197, 94, 0.7)' },
  animate: {
    boxShadow: [
      '0 0 0 0px rgba(34, 197, 94, 0.7)',
      '0 0 0 20px rgba(34, 197, 94, 0)',
    ],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// Message flow animation
export const messageFlow: Variants = {
  initial: { opacity: 0, pathLength: 0 },
  animate: {
    opacity: [0, 1, 0],
    pathLength: [0, 1, 1],
    transition: {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

// Node bounce
export const nodeBounce: Variants = {
  initial: { y: 0 },
  hover: {
    y: -8,
    transition: { type: 'spring', stiffness: 300, damping: 20 },
  },
};

// Degradation shake
export const degradationShake: Variants = {
  initial: { x: 0 },
  animate: {
    x: [-2, 2, -2, 2, 0],
    transition: {
      duration: 0.5,
      repeat: 3,
      repeatType: 'loop',
    },
  },
};

// Crash burst
export const crashBurst: Variants = {
  initial: { opacity: 1, scale: 1 },
  animate: {
    opacity: 0,
    scale: 1.5,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

// Connection line animation
export const connectionLine: Variants = {
  initial: { strokeDasharray: 1, strokeDashoffset: 1 },
  animate: {
    strokeDasharray: [1, 100],
    strokeDashoffset: [1, -100],
    transition: {
      duration: 2,
      ease: 'linear',
      repeat: Infinity,
    },
  },
};

// Stagger container for multiple items
export const staggerContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Stagger child items
export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

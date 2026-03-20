import React from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';

export const ControlPanel: React.FC = () => {
  const { isRunning, isPaused, isConnected, sendCommand } = useSimulation();

  const buttonClasses =
    'px-3 py-1.5 rounded font-semibold transition-all text-white text-sm';

  const dangerButton = `${buttonClasses} bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed`;
  const successButton = `${buttonClasses} bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed`;
  const warningButton = `${buttonClasses} bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 disabled:cursor-not-allowed`;

  return (
    <div className="w-full flex items-center justify-between gap-6 flex-wrap">
      {/* Simulation Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 font-medium">Simulation:</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={successButton}
          onClick={() => sendCommand('start')}
          disabled={isRunning || !isConnected}
        >
          Start
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={warningButton}
          onClick={() => sendCommand(isPaused ? 'resume' : 'pause')}
          disabled={!isRunning || !isConnected}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={dangerButton}
          onClick={() => sendCommand('reset')}
          disabled={!isConnected}
        >
          Reset
        </motion.button>
      </div>

      {/* Cluster Operations */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 font-medium">Cluster:</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClasses} bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed`}
          onClick={() => sendCommand('addNode')}
          disabled={!isRunning || !isConnected}
        >
          +Node
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClasses} bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed`}
          onClick={() => sendCommand('removeNode')}
          disabled={!isRunning || !isConnected}
        >
          -Node
        </motion.button>
      </div>

      {/* Failure Injection */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 font-medium">Inject:</span>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClasses} bg-orange-600 hover:bg-orange-700 disabled:bg-gray-600 disabled:cursor-not-allowed`}
          onClick={() => sendCommand('crashNode')}
          disabled={!isRunning || !isConnected}
        >
          Crash
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClasses} bg-lime-600 hover:bg-lime-700 disabled:bg-gray-600 disabled:cursor-not-allowed`}
          onClick={() => sendCommand('overloadNode')}
          disabled={!isRunning || !isConnected}
        >
          Degrade
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${buttonClasses} bg-teal-600 hover:bg-teal-700 disabled:bg-gray-600 disabled:cursor-not-allowed`}
          onClick={() => sendCommand('recoverNode')}
          disabled={!isRunning || !isConnected}
        >
          Recover
        </motion.button>
      </div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';

export const ControlPanel: React.FC = () => {
  const { isRunning, isPaused, isConnected, sendCommand } = useSimulation();

  const buttonClasses =
    'px-4 py-2 rounded-lg font-semibold transition-all text-white';

  const primaryButton = `${buttonClasses} bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400`;
  const dangerButton = `${buttonClasses} bg-red-600 hover:bg-red-700 disabled:bg-gray-400`;
  const successButton = `${buttonClasses} bg-green-600 hover:bg-green-700 disabled:bg-gray-400`;
  const warningButton = `${buttonClasses} bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Control Panel</h2>

      {/* Connection Status */}
      <div className="mb-6 flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
        <span className="text-sm text-gray-300">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      {/* Simulation Controls */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Simulation Control
          </h3>
          <div className="grid grid-cols-2 gap-3">
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
              onClick={() =>
                sendCommand(isPaused ? 'resume' : 'pause')
              }
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
        </div>

        {/* Cluster Operations */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Cluster Operations
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${buttonClasses} bg-cyan-600 hover:bg-cyan-700`}
              onClick={() => sendCommand('addNode')}
              disabled={!isRunning || !isConnected}
            >
              Add Node
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${buttonClasses} bg-purple-600 hover:bg-purple-700`}
              onClick={() => sendCommand('removeNode')}
              disabled={!isRunning || !isConnected}
            >
              Remove Node
            </motion.button>
          </div>
        </div>

        {/* Node Failure Injection */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Failure Injection
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${buttonClasses} bg-orange-600 hover:bg-orange-700`}
              onClick={() => sendCommand('crashNode')}
              disabled={!isRunning || !isConnected}
            >
              Crash Node
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${buttonClasses} bg-lime-600 hover:bg-lime-700`}
              onClick={() => sendCommand('overloadNode')}
              disabled={!isRunning || !isConnected}
            >
              Overload Node
            </motion.button>
          </div>
        </div>

        {/* Experimental */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">
            Recovery
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`${buttonClasses} bg-teal-600 hover:bg-teal-700`}
              onClick={() => sendCommand('recoverNode')}
              disabled={!isRunning || !isConnected}
            >
              Recover Node
            </motion.button>
          </div>
        </div>
      </div>

      <div className="mt-6 p-3 bg-blue-900/30 rounded border border-blue-500/30 text-sm text-blue-200">
        <p>
          <strong>Tip:</strong> Start a simulation to see leader election in action. Inject failures to observe how the algorithm handles partial failures and node degradation.
        </p>
      </div>
    </motion.div>
  );
};

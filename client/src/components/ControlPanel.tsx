import React from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';

export const ControlPanel: React.FC = () => {
  const { isRunning, isPaused, isConnected, sendCommand, selectedNode } = useSimulation();

  const baseButton =
    'px-4 py-2 rounded font-medium text-sm transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed';

  const primaryButton = `${baseButton} bg-gray-200 text-gray-900 border-gray-300 hover:bg-gray-300 hover:border-gray-400`;
  const successButton = `${baseButton} bg-green-700 text-white border-green-800 hover:bg-green-600 hover:border-green-700`;
  const warningButton = `${baseButton} bg-orange-600 text-white border-orange-700 hover:bg-orange-500 hover:border-orange-600`;
  const dangerButton = `${baseButton} bg-red-600 text-white border-red-700 hover:bg-red-500 hover:border-red-600`;
  const accentButton = `${baseButton} bg-blue-600 text-white border-blue-700 hover:bg-blue-500 hover:border-blue-600`;

  return (
    <div className="w-full flex items-center justify-start gap-8 flex-wrap">
      {/* Simulation Controls */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
          Simulation
        </span>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={successButton}
          onClick={() => sendCommand('start')}
          disabled={isRunning || !isConnected}
          title="Start the simulation"
        >
          Start
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={warningButton}
          onClick={() => sendCommand(isPaused ? 'resume' : 'pause')}
          disabled={!isRunning || !isConnected}
          title={isPaused ? 'Resume simulation' : 'Pause simulation'}
        >
          {isPaused ? 'Resume' : 'Pause'}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={dangerButton}
          onClick={() => sendCommand('reset')}
          disabled={!isConnected}
          title="Reset the simulation"
        >
          Reset
        </motion.button>
      </div>

      {/* Cluster Operations */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
          Cluster
        </span>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={accentButton}
          onClick={() => sendCommand('addNode')}
          disabled={!isRunning || !isConnected}
          title="Add a new node to cluster"
        >
          + Node
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={primaryButton}
          onClick={() => sendCommand('removeNode', selectedNode || undefined)}
          disabled={!isRunning || !isConnected || !selectedNode}
          title="Remove selected node from cluster"
        >
          − Node
        </motion.button>
      </div>

      {/* Failure Injection */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
          Inject Fault
        </span>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={dangerButton}
          onClick={() => sendCommand('crashNode', selectedNode || undefined)}
          disabled={!isRunning || !isConnected || !selectedNode}
          title="Crash the selected node"
        >
          Crash
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={warningButton}
          onClick={() => sendCommand('overloadNode', selectedNode || undefined)}
          disabled={!isRunning || !isConnected || !selectedNode}
          title="Degrade node performance"
        >
          Degrade
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={successButton}
          onClick={() => sendCommand('recoverNode', selectedNode || undefined)}
          disabled={!isRunning || !isConnected || !selectedNode}
          title="Recover the selected node"
        >
          Recover
        </motion.button>
      </div>
    </div>
  );
};

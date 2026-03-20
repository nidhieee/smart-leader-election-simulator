import React from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';

export const ControlPanel: React.FC = () => {
  const { isRunning, isPaused, isConnected, sendCommand, selectedNode } = useSimulation();

  const baseButton =
    'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 border border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed';

  const primaryButton = `${baseButton} bg-slate-700 text-slate-100 hover:bg-slate-600 hover:border-slate-500`;
  const successButton = `${baseButton} bg-emerald-700 text-emerald-50 hover:bg-emerald-600 hover:border-emerald-600`;
  const warningButton = `${baseButton} bg-amber-700 text-amber-50 hover:bg-amber-600 hover:border-amber-600`;
  const dangerButton = `${baseButton} bg-red-700 text-red-50 hover:bg-red-600 hover:border-red-600`;
  const accentButton = `${baseButton} bg-cyan-700 text-cyan-50 hover:bg-cyan-600 hover:border-cyan-600`;

  return (
    <div className="w-full flex items-center justify-start gap-8 flex-wrap">
      {/* Simulation Controls */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
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
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
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
        <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
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

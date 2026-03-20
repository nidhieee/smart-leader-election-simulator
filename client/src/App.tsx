import { motion } from 'framer-motion';
import { useSimulation } from './hooks/useSimulation';
import { NetworkCanvasEnhanced } from './components/NetworkCanvasEnhanced';
import { ControlPanel } from './components/ControlPanel';
import { LogPanel } from './components/LogPanel';
import { NodeDetails } from './components/NodeDetails';

function App() {
  const { isConnected, electionInProgress } = useSimulation();

  return (
    <div className="h-screen bg-gradient-to-b from-gray-50 to-white text-gray-900 flex flex-col overflow-hidden">
      {/* Header - Dark theme */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-gray-300 bg-gradient-to-r from-slate-800 to-slate-900 text-white"
      >
        <div className="px-8 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Smart Leader Election Simulator
              </h1>
            </div>
            <motion.div
              animate={{
                opacity: isConnected ? 1 : 0.6,
              }}
              className="flex items-center gap-2.5 px-4 py-2 bg-slate-700 border border-slate-600 rounded"
            >
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                }`}
              ></div>
              <span className="text-xs font-semibold tracking-wide text-gray-200">
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Top Control Panel - Light theme */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border-b border-gray-300 bg-gradient-to-r from-gray-50 to-white px-8 py-4 shadow-sm"
      >
        <ControlPanel />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden gap-0">
        {/* Left Panel - Event Stream (Full Height) - Light theme */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-80 border-r border-gray-300 flex flex-col overflow-hidden bg-white"
        >
          {/* Leader Election Status - Only show during active election */}
          {electionInProgress && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="px-4 py-3 bg-amber-50 border-b-2 border-amber-400 flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-amber-600"
              />
              <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                🔄 Electing New Leader...
              </span>
            </motion.div>
          )}

          <div className="flex-1 overflow-y-auto">
            <LogPanel />
          </div>
        </motion.div>

        {/* Center - Network Canvas - Dark theme */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex-1 border-r border-gray-300 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative"
        >
          <NetworkCanvasEnhanced />
        </motion.div>

        {/* Right Panel - Node Details (Full Height) - Light theme */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-96 border-l border-gray-300 overflow-hidden bg-white p-5 shadow-lg"
        >
          <div className="h-full overflow-y-auto">
            <NodeDetails />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default App;

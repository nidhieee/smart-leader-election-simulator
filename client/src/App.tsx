import { motion } from 'framer-motion';
import { useSimulation } from './hooks/useSimulation';
import { NetworkCanvasEnhanced } from './components/NetworkCanvasEnhanced';
import { ControlPanel } from './components/ControlPanel';
import { LogPanel } from './components/LogPanel';
import { NodeDetails } from './components/NodeDetails';

function App() {
  const { isConnected, logs } = useSimulation();

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-slate-700/50 bg-gradient-to-b from-slate-900/80 to-slate-900/40 backdrop-blur-md"
      >
        <div className="px-8 py-5">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text uppercase text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight">
                Smart Leader Election Simulator
              </h1>
            </div>
            <motion.div
              animate={{
                opacity: isConnected ? 1 : 0.6,
              }}
              className="flex items-center gap-2.5 px-5 py-2.5 bg-slate-800/50 border border-slate-700/60 rounded-lg backdrop-blur-sm"
            >
              <div
                className={`w-2 h-2 rounded-full transition-colors ${
                  isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-xs font-semibold tracking-wide">
                {isConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Top Control Panel */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="border-b border-slate-700/50 bg-slate-800/40 backdrop-blur-sm px-8 py-4"
      >
        <ControlPanel />
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden gap-0">
        {/* Left Panel - Event Stream (Full Height) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-80 border-r border-slate-700/50 flex flex-col overflow-hidden bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm"
        >
          {/* Leader Election Status */}
          {logs.some((log) => log.includes('[ELECTION]')) && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-3 bg-amber-900/40 border-b border-amber-700/50 flex items-center gap-2"
            >
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-amber-400"
              />
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">
                ⚡ Leader Election In Progress
              </span>
            </motion.div>
          )}

          <div className="flex-1 overflow-y-auto">
            <LogPanel />
          </div>
        </motion.div>

        {/* Center - Network Canvas */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex-1 border-r border-slate-700/50 bg-slate-900/20 relative"
        >
          <NetworkCanvasEnhanced />
        </motion.div>

        {/* Right Panel - Node Details (Full Height) */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-96 border-l border-slate-700/50 overflow-hidden bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-sm p-5"
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

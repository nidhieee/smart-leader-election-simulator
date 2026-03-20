import { motion } from 'framer-motion';
import { useSimulation } from './hooks/useSimulation';
import { NetworkCanvasEnhanced } from './components/NetworkCanvasEnhanced';
import { ControlPanel } from './components/ControlPanel';
import { LogPanel } from './components/LogPanel';
import { NodeDetails } from './components/NodeDetails';

function App() {
  const { isConnected } = useSimulation();

  return (
    <div className="h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-md"
      >
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Smart Leader Election Simulator
              </h1>
              <p className="text-gray-400 text-sm mt-1">Cisco Packet Tracer Style Network Visualization</p>
            </div>
            <motion.div
              animate={{
                opacity: isConnected ? 1 : 0.5,
              }}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg"
            >
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                }`}
              ></div>
              <span className="text-sm font-medium">
                {isConnected ? 'Connected' : 'Disconnected'}
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
        className="border-b border-slate-700 bg-slate-800/30 backdrop-blur-sm px-6 py-3"
      >
        <ControlPanel />
      </motion.div>

      {/* Main Content Area - Cisco Packet Tracer Layout */}
      <div className="flex-1 flex overflow-hidden gap-0">
        {/* Center - Network Canvas (Full Width) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex-1 border-r border-slate-700"
        >
          <NetworkCanvasEnhanced />
        </motion.div>

        {/* Right Panel - Node Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-80 border-l border-slate-700 bg-slate-800/50 backdrop-blur-sm overflow-y-auto"
        >
          <div className="p-6">
            <NodeDetails />
          </div>
        </motion.div>
      </div>

      {/* Bottom Log Panel */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="border-t border-slate-700 bg-slate-800/50 backdrop-blur-sm h-48 overflow-hidden"
      >
        <div className="p-4 h-full overflow-y-auto">
          <LogPanel />
        </div>
      </motion.div>
    </div>
  );
}

export default App;

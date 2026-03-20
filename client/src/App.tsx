import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from './hooks/useSimulation';
import { ClusterView } from './components/ClusterView';
import { ControlPanel } from './components/ControlPanel';
import { LogPanel } from './components/LogPanel';
import { NodeDetails } from './components/NodeDetails';

function App() {
  const { connect, disconnect, isConnected } = useSimulation();

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="border-b border-slate-700 bg-slate-900/50 backdrop-blur"
      >
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                Smart Leader Election Simulator
              </h1>
              <p className="text-gray-400 mt-2">
                Fault-aware distributed leader election under partial failures
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isConnected ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse`}
              ></div>
              <span className="text-sm">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <ClusterView />
            <LogPanel />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ControlPanel />
            <NodeDetails />
          </div>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="border-t border-slate-700 bg-slate-900/50 backdrop-blur mt-12"
      >
        <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-400 text-sm">
          <p>
            By Nidhi Tupe | NMIMS Sem 6 DC Project | Academic Project
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;

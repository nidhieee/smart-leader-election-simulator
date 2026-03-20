import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NetworkCanvas } from './NetworkCanvas';
import { useSimulation } from '../hooks/useSimulation';
import { NodeStatus } from '../types';

export const ClusterView: React.FC = () => {
  const { nodes, selectedNode, setSelectedNode } = useSimulation();

  const healthyCount = nodes.filter((n) => n.status === NodeStatus.HEALTHY).length;
  const degradedCount = nodes.filter((n) => n.status === NodeStatus.DEGRADED).length;
  const failedCount = nodes.filter((n) => n.status === NodeStatus.FAILED).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      {/* Network Topology */}
      <NetworkCanvas />

      {/* Stats and Node List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Cluster Status</h2>

        {/* Statistics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-green-500/10 border border-green-500/30 p-4 rounded-lg">
            <p className="text-xs text-green-300 mb-1">Healthy</p>
            <p className="text-2xl font-bold text-green-400">{healthyCount}</p>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 p-4 rounded-lg">
            <p className="text-xs text-yellow-300 mb-1">Degraded</p>
            <p className="text-2xl font-bold text-yellow-400">{degradedCount}</p>
          </div>
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-lg">
            <p className="text-xs text-red-300 mb-1">Failed</p>
            <p className="text-2xl font-bold text-red-400">{failedCount}</p>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 p-4 rounded-lg">
            <p className="text-xs text-blue-300 mb-1">Total</p>
            <p className="text-2xl font-bold text-blue-400">{nodes.length}</p>
          </div>
        </div>

        {/* Node Cards */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          <p className="text-sm text-gray-400 font-semibold mb-3">Nodes in Cluster</p>
          <AnimatePresence>
            {nodes.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No nodes in cluster. Start the simulation to begin.
              </p>
            ) : (
              nodes.map((node) => (
                <motion.div
                  key={node.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => setSelectedNode(node.id)}
                  className={`p-3 rounded-lg cursor-pointer transition-all ${
                    selectedNode === node.id
                      ? 'bg-blue-500/20 border border-blue-500 ring-1 ring-blue-500'
                      : 'bg-slate-700/50 border border-slate-600 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          node.status === 'healthy'
                            ? 'bg-green-500'
                            : node.status === 'degraded'
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                        }`}
                      ></div>
                      <div>
                        <p className="font-semibold text-white text-sm">{node.id}</p>
                        <p className="text-xs text-gray-400 capitalize">{node.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-white text-sm">
                        {node.healthScore.toFixed(1)}
                      </p>
                      <p className="text-xs text-gray-400">/100</p>
                    </div>
                    {node.isLeader && (
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, linear: true }}
                        className="text-yellow-400 text-lg ml-2"
                      >
                        ★
                      </motion.span>
                    )}
                  </div>

                  {/* Health bar */}
                  <div className="mt-2 w-full bg-slate-600 rounded-full h-1.5">
                    <motion.div
                      className="h-1.5 rounded-full bg-gradient-to-r from-red-500 to-green-500"
                      initial={{ width: 0 }}
                      animate={{
                        width: `${Math.max(0, Math.min(100, node.healthScore))}%`,
                      }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NodeCard } from './NodeCard';
import { useSimulation } from '../hooks/useSimulation';

export const ClusterView: React.FC = () => {
  const { nodes, selectedNode, setSelectedNode, leader } = useSimulation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl"
    >
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Cluster Nodes</h2>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Healthy</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Degraded</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-sm text-gray-300">Failed</span>
          </div>
          {leader && (
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-sm font-semibold text-yellow-400">Leader: {leader}</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {nodes.map((node) => (
            <NodeCard
              key={node.id}
              node={node}
              isSelected={selectedNode === node.id}
              onSelect={setSelectedNode}
            />
          ))}
        </AnimatePresence>
      </div>

      {nodes.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>No nodes in cluster. Start the simulation to begin.</p>
        </div>
      )}
    </motion.div>
  );
};

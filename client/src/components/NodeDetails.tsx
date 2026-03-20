import React from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';
import { NodeStatus } from '../types';
import { fadeInUp } from '../utils/animationVariants';

export const NodeDetails: React.FC = () => {
  const { nodes, selectedNode } = useSimulation();

  const node = nodes.find((n) => n.id === selectedNode);

  if (!selectedNode || !node) {
    return (
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="text-center py-8"
      >
        <div className="text-gray-500 text-sm">
          <div className="mb-2 text-2xl">👆</div>
          Click a node to view details
        </div>
      </motion.div>
    );
  }

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.HEALTHY:
        return 'text-green-400';
      case NodeStatus.DEGRADED:
        return 'text-yellow-400';
      case NodeStatus.FAILED:
        return 'text-red-400';
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-4"
    >
      {/* Node Header */}
      <div className="border-l-4 border-cyan-500 pl-4">
        <h3 className="text-lg font-bold text-white">{node.id}</h3>
        <div className="flex items-center gap-2 mt-1">
          <div
            className={`w-2 h-2 rounded-full ${
              node.status === NodeStatus.HEALTHY
                ? 'bg-green-500'
                : node.status === NodeStatus.DEGRADED
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
            }`}
          ></div>
          <span className={`text-xs font-semibold capitalize ${getStatusColor(node.status)}`}>
            {node.status}
          </span>
          {node.isLeader && (
            <span className="text-xs bg-cyan-500/30 text-cyan-300 px-2 py-0.5 rounded font-bold">
              ★ Leader
            </span>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-700/40 p-3 rounded border border-slate-600/50">
          <p className="text-xs text-gray-400 mb-1">Health</p>
          <p className={`text-lg font-bold ${
            node.healthScore > 50
              ? 'text-green-400'
              : node.healthScore > 0
                ? 'text-yellow-400'
                : 'text-red-400'
          }`}>
            {node.healthScore.toFixed(0)}
          </p>
        </div>

        <div className="bg-slate-700/40 p-3 rounded border border-slate-600/50">
          <p className="text-xs text-gray-400 mb-1">Uptime</p>
          <p className="text-lg font-bold text-blue-400">
            {node.uptime.toFixed(0)}%
          </p>
        </div>

        <div className="bg-slate-700/40 p-3 rounded border border-slate-600/50">
          <p className="text-xs text-gray-400 mb-1">CPU</p>
          <p className={`text-lg font-bold ${
            node.cpu > 70 ? 'text-red-400' : node.cpu > 40 ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {node.cpu.toFixed(0)}%
          </p>
        </div>

        <div className="bg-slate-700/40 p-3 rounded border border-slate-600/50">
          <p className="text-xs text-gray-400 mb-1">Memory</p>
          <p className={`text-lg font-bold ${
            node.memory > 70 ? 'text-red-400' : node.memory > 40 ? 'text-yellow-400' : 'text-green-400'
          }`}>
            {node.memory.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-2">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">CPU Usage</span>
            <span className={`text-xs font-semibold ${node.cpu > 70 ? 'text-red-400' : 'text-gray-400'}`}>
              {node.cpu.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full"
              animate={{ width: `${Math.min(100, node.cpu)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Memory Usage</span>
            <span className={`text-xs font-semibold ${node.memory > 70 ? 'text-red-400' : 'text-gray-400'}`}>
              {node.memory.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 h-full"
              animate={{ width: `${Math.min(100, node.memory)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Health Score</span>
            <span className={`text-xs font-semibold ${
              node.healthScore > 50
                ? 'text-green-400'
                : node.healthScore > 0
                  ? 'text-yellow-400'
                  : 'text-red-400'
            }`}>
              {node.healthScore.toFixed(1)}/100
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-1.5 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-full"
              animate={{ width: `${Math.max(0, Math.min(100, node.healthScore + 50))}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Last Heartbeat */}
      <div className="bg-slate-700/40 p-2 rounded border border-slate-600/50 text-xs">
        <span className="text-gray-400">Last Heartbeat: </span>
        <span className="text-gray-300">
          {new Date(node.lastHeartbeat).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};

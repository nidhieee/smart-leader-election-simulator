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
        className="h-full flex items-center justify-center"
      >
        <div className="text-center">
          <div className="mb-3 text-slate-500">
            <div className="text-3xl font-light tracking-wide">⊕</div>
          </div>
          <div className="text-slate-400 text-sm">
            Select a node on the canvas to view details
          </div>
        </div>
      </motion.div>
    );
  }

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.HEALTHY:
        return 'text-emerald-400';
      case NodeStatus.DEGRADED:
        return 'text-amber-400';
      case NodeStatus.FAILED:
        return 'text-red-400';
    }
  };

  const getStatusBg = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.HEALTHY:
        return 'bg-emerald-500/10 border-emerald-600/30';
      case NodeStatus.DEGRADED:
        return 'bg-amber-500/10 border-amber-600/30';
      case NodeStatus.FAILED:
        return 'bg-red-500/10 border-red-600/30';
    }
  };

  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="space-y-4 h-full overflow-y-auto"
    >
      {/* Node Header */}
      <div className={`border-l-4 border-cyan-500 pl-4 py-1 ${getStatusBg(node.status)} px-3 rounded-r border`}>
        <h3 className="text-base font-bold text-slate-100">{node.id}</h3>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <div
            className={`w-2 h-2 rounded-full ${
              node.status === NodeStatus.HEALTHY
                ? 'bg-emerald-500'
                : node.status === NodeStatus.DEGRADED
                  ? 'bg-amber-500'
                  : 'bg-red-500'
            }`}
          ></div>
          <span className={`text-xs font-semibold capitalize ${getStatusColor(node.status)}`}>
            {node.status}
          </span>
          {node.isLeader && (
            <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-semibold border border-cyan-600/30">
              ★ LEADER
            </span>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Health</p>
          <p className={`text-lg font-bold ${
            node.healthScore > 50
              ? 'text-emerald-400'
              : node.healthScore > 0
                ? 'text-amber-400'
                : 'text-red-400'
          }`}>
            {node.healthScore.toFixed(0)}
          </p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Uptime</p>
          <p className="text-lg font-bold text-cyan-400">
            {node.uptime.toFixed(0)}%
          </p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">CPU</p>
          <p className={`text-lg font-bold ${
            node.cpu > 70 ? 'text-red-400' : node.cpu > 40 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {node.cpu.toFixed(0)}%
          </p>
        </div>

        <div className="bg-slate-800/50 p-3 rounded border border-slate-700/50">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Memory</p>
          <p className={`text-lg font-bold ${
            node.memory > 70 ? 'text-red-400' : node.memory > 40 ? 'text-amber-400' : 'text-emerald-400'
          }`}>
            {node.memory.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">CPU Usage</span>
            <span className={`text-xs font-semibold ${node.cpu > 70 ? 'text-red-400' : 'text-slate-400'}`}>
              {node.cpu.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 h-full"
              animate={{ width: `${Math.min(100, node.cpu)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Memory Usage</span>
            <span className={`text-xs font-semibold ${node.memory > 70 ? 'text-red-400' : 'text-slate-400'}`}>
              {node.memory.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <motion.div
              className="bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 h-full"
              animate={{ width: `${Math.min(100, node.memory)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Health Score</span>
            <span className={`text-xs font-semibold ${
              node.healthScore > 50
                ? 'text-emerald-400'
                : node.healthScore > 0
                  ? 'text-amber-400'
                  : 'text-red-400'
            }`}>
              {node.healthScore.toFixed(1)}/100
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700/50">
            <motion.div
              className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 h-full"
              animate={{ width: `${Math.max(0, Math.min(100, node.healthScore + 50))}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Last Heartbeat */}
      <div className="bg-slate-800/50 p-2.5 rounded border border-slate-700/50 text-xs">
        <span className="text-slate-500">Last Heartbeat: </span>
        <span className="text-slate-300 font-mono">
          {new Date(node.lastHeartbeat).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};

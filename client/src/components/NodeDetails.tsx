import React from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';
import { NodeStatus } from '../types';

export const NodeDetails: React.FC = () => {
  const { nodes, selectedNode } = useSimulation();

  const node = nodes.find((n) => n.id === selectedNode);

  if (!selectedNode || !node) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl"
      >
        <h2 className="text-2xl font-bold text-white mb-4">Node Details</h2>
        <div className="text-gray-400 text-center py-12">
          Select a node to view detailed information
        </div>
      </motion.div>
    );
  }

  const getStatusBgColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.HEALTHY:
        return 'bg-green-500/20 border-green-500/50';
      case NodeStatus.DEGRADED:
        return 'bg-yellow-500/20 border-yellow-500/50';
      case NodeStatus.FAILED:
        return 'bg-red-500/20 border-red-500/50';
    }
  };

  const metrics = [
    {
      label: 'Health Score',
      value: node.healthScore.toFixed(2),
      unit: '/100',
      color: node.healthScore > 50 ? 'text-green-400' : node.healthScore > 0 ? 'text-yellow-400' : 'text-red-400',
    },
    {
      label: 'CPU Usage',
      value: node.cpu.toFixed(2),
      unit: '%',
      color: node.cpu > 70 ? 'text-red-400' : node.cpu > 40 ? 'text-yellow-400' : 'text-green-400',
    },
    {
      label: 'Memory Usage',
      value: node.memory.toFixed(2),
      unit: '%',
      color: node.memory > 70 ? 'text-red-400' : node.memory > 40 ? 'text-yellow-400' : 'text-green-400',
    },
    {
      label: 'Uptime',
      value: node.uptime.toFixed(2),
      unit: '%',
      color: 'text-blue-400',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-6">Node Details</h2>

      {/* Node Header */}
      <div
        className={`p-4 rounded-lg border mb-6 ${getStatusBgColor(node.status)}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white">{node.id}</h3>
            <p className="text-sm text-gray-300 mt-1">
              Status: <span className="font-semibold">{node.status}</span>
            </p>
          </div>
          {node.isLeader && (
            <div className="bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">
              LEADER
            </div>
          )}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="bg-slate-700/50 p-4 rounded-lg border border-slate-600"
          >
            <p className="text-xs text-gray-400 mb-2">{metric.label}</p>
            <p className={`text-2xl font-bold ${metric.color}`}>
              {metric.value}
              <span className="text-sm ml-1">{metric.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Info */}
      <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
        <h4 className="text-sm font-semibold text-white mb-3">
          Additional Information
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">Last Heartbeat:</span>
            <span className="text-gray-200">
              {new Date(node.lastHeartbeat).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status:</span>
            <span className="text-gray-200 capitalize">{node.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Leader:</span>
            <span className="text-gray-200">
              {node.isLeader ? 'Yes' : 'No'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="mt-6 space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">CPU Utilization</span>
            <span className="text-xs text-gray-400">
              {node.cpu.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, node.cpu)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Memory Utilization</span>
            <span className="text-xs text-gray-400">
              {node.memory.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full transition-all"
              style={{ width: `${Math.min(100, node.memory)}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-400">Health Score</span>
            <span className="text-xs text-gray-400">
              {node.healthScore.toFixed(1)}/100
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-red-500 to-green-500 h-2 rounded-full transition-all"
              style={{
                width: `${Math.max(0, Math.min(100, node.healthScore))}%`,
              }}
            ></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

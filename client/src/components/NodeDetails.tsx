import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';
import { NodeStatus } from '../types';
import { fadeInUp } from '../utils/animationVariants';

export const NodeDetails: React.FC = () => {
  const { nodes, selectedNode, sendCommand } = useSimulation();
  
  // State for manual controls
  const [manualCPU, setManualCPU] = useState<string>('');
  const [manualMemory, setManualMemory] = useState<string>('');
  const [manualUptime, setManualUptime] = useState<string>('');
  const [autoDegrade, setAutoDegrade] = useState<boolean>(false);

  const node = nodes.find((n) => n.id === selectedNode);

  // Update manual control values only when selected node changes, not on every server update
  useEffect(() => {
    if (node) {
      setManualCPU(node.cpu.toFixed(1));
      setManualMemory(node.memory.toFixed(1));
      setManualUptime(node.uptime.toFixed(1));
      // Note: autoDegrade state would be better stored in context, defaulting to false
      setAutoDegrade(false);
    }
  }, [selectedNode]);

  const handleApplyChanges = () => {
    if (!selectedNode) return;

    const cpuValue = parseFloat(manualCPU);
    const memoryValue = parseFloat(manualMemory);
    const uptimeValue = parseFloat(manualUptime);

    // Validate values
    if (isNaN(cpuValue) || isNaN(memoryValue) || isNaN(uptimeValue)) {
      alert('Please enter valid numbers');
      return;
    }

    // Send commands to server
    if (cpuValue !== node?.cpu) {
      sendCommand('setNodeCPU', selectedNode, { value: cpuValue });
    }
    if (memoryValue !== node?.memory) {
      sendCommand('setNodeMemory', selectedNode, { value: memoryValue });
    }
    if (uptimeValue !== node?.uptime) {
      sendCommand('setNodeUptime', selectedNode, { value: uptimeValue });
    }
  };

  const handleToggleAutoDegrade = () => {
    if (!selectedNode) return;
    sendCommand('toggleAutoDegrade', selectedNode);
  };

  if (!selectedNode || !node) {
    return (
      <motion.div
        variants={fadeInUp}
        initial="initial"
        animate="animate"
        className="h-full flex items-center justify-center"
      >
        <div className="text-center">
          <div className="mb-3 text-gray-400">
            <div className="text-3xl font-light tracking-wide">⊕</div>
          </div>
          <div className="text-gray-500 text-sm">
            Select a node on the canvas to view details
          </div>
        </div>
      </motion.div>
    );
  }

  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.HEALTHY:
        return 'text-green-700';
      case NodeStatus.DEGRADED:
        return 'text-orange-600';
      case NodeStatus.FAILED:
        return 'text-red-600';
    }
  };

  const getStatusBg = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.HEALTHY:
        return 'bg-green-50 border-green-200';
      case NodeStatus.DEGRADED:
        return 'bg-orange-50 border-orange-200';
      case NodeStatus.FAILED:
        return 'bg-red-50 border-red-200';
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
      <div className={`border-l-4 border-blue-600 pl-4 py-1 ${getStatusBg(node.status)} px-3 rounded-r border`}>
        <h3 className="text-base font-bold text-gray-900">{node.id}</h3>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <div
            className={`w-2 h-2 rounded-full ${
              node.status === NodeStatus.HEALTHY
                ? 'bg-green-600'
                : node.status === NodeStatus.DEGRADED
                  ? 'bg-orange-500'
                  : 'bg-red-600'
            }`}
          ></div>
          <span className={`text-xs font-semibold capitalize ${getStatusColor(node.status)}`}>
            {node.status}
          </span>
          {node.isLeader && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold border border-blue-300">
              ★ LEADER
            </span>
          )}
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Health</p>
          <p className={`text-lg font-bold ${
            node.healthScore > 50
              ? 'text-green-700'
              : node.healthScore > 0
                ? 'text-orange-600'
                : 'text-red-600'
          }`}>
            {node.healthScore.toFixed(0)}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Uptime</p>
          <p className="text-lg font-bold text-blue-600">
            {node.uptime.toFixed(0)}%
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">CPU</p>
          <p className={`text-lg font-bold ${
            node.cpu > 70 ? 'text-red-600' : node.cpu > 40 ? 'text-orange-600' : 'text-green-700'
          }`}>
            {node.cpu.toFixed(0)}%
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded border border-gray-200">
          <p className="text-xs text-gray-600 font-semibold uppercase tracking-wider mb-1">Memory</p>
          <p className={`text-lg font-bold ${
            node.memory > 70 ? 'text-red-600' : node.memory > 40 ? 'text-orange-600' : 'text-green-700'
          }`}>
            {node.memory.toFixed(0)}%
          </p>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">CPU Usage</span>
            <span className={`text-xs font-semibold ${node.cpu > 70 ? 'text-red-600' : 'text-gray-600'}`}>
              {node.cpu.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden border border-gray-300">
            <motion.div
              className="bg-gradient-to-r from-green-600 via-orange-500 to-red-600 h-full"
              animate={{ width: `${Math.min(100, node.cpu)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Memory Usage</span>
            <span className={`text-xs font-semibold ${node.memory > 70 ? 'text-red-600' : 'text-gray-600'}`}>
              {node.memory.toFixed(1)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden border border-gray-300">
            <motion.div
              className="bg-gradient-to-r from-green-600 via-orange-500 to-red-600 h-full"
              animate={{ width: `${Math.min(100, node.memory)}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-1">
            <span className="text-xs text-gray-600 font-semibold uppercase tracking-wider">Health Score</span>
            <span className={`text-xs font-semibold ${
              node.healthScore > 50
                ? 'text-green-700'
                : node.healthScore > 0
                  ? 'text-orange-600'
                  : 'text-red-600'
            }`}>
              {node.healthScore.toFixed(1)}/100
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden border border-gray-300">
            <motion.div
              className="bg-gradient-to-r from-red-600 via-orange-500 to-green-600 h-full"
              animate={{ width: `${Math.max(0, Math.min(100, node.healthScore + 50))}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Manual Control Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 space-y-4"
      >
        <h4 className="text-sm font-bold text-blue-900 uppercase tracking-wider">Manual Control</h4>

        {/* CPU Control */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-gray-700">CPU Load</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={manualCPU}
              onChange={(e) => setManualCPU(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-600">%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={manualCPU}
            onChange={(e) => setManualCPU(e.target.value)}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Memory Control */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-gray-700">Memory Usage</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={manualMemory}
              onChange={(e) => setManualMemory(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-600">%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={manualMemory}
            onChange={(e) => setManualMemory(e.target.value)}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Uptime Control */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-xs font-semibold text-gray-700">Uptime</label>
            <input
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={manualUptime}
              onChange={(e) => setManualUptime(e.target.value)}
              className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-xs text-gray-600">%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="0.1"
            value={manualUptime}
            onChange={(e) => setManualUptime(e.target.value)}
            className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Auto-Degradation Toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleAutoDegrade}
          className={`w-full py-3 px-4 rounded font-bold text-sm transition-all border-2 ${
            autoDegrade
              ? 'bg-orange-500 text-white border-orange-600 shadow-lg'
              : 'bg-gray-200 text-gray-800 border-gray-400'
          }`}
        >
          <span className="text-xs uppercase tracking-wider">Auto-Degradation: </span>
          <span className="text-sm font-bold">{autoDegrade ? '🔴 ON' : '⭕ OFF'}</span>
        </motion.button>

        {/* Apply Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleApplyChanges}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded font-semibold text-sm hover:bg-blue-700 transition-colors border border-blue-700"
        >
          Apply Changes
        </motion.button>
      </motion.div>

      {/* Last Heartbeat */}
      <div className="bg-gray-50 p-2.5 rounded border border-gray-200 text-xs">
        <span className="text-gray-600">Last Heartbeat: </span>
        <span className="text-gray-900 font-mono">
          {new Date(node.lastHeartbeat).toLocaleTimeString()}
        </span>
      </div>
    </motion.div>
  );
};

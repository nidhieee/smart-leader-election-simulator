import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../hooks/useSimulation';
import { NodeStatus } from '../types';

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

export const NetworkCanvas: React.FC = () => {
  const { nodes, leader, selectedNode, setSelectedNode } = useSimulation();

  // Calculate node positions in a circle
  const nodePositions: NodePosition[] = useMemo(() => {
    const centerX = 300;
    const centerY = 150;
    const radius = 120;
    const angleSlice = (Math.PI * 2) / Math.max(nodes.length, 1);

    return nodes.map((node, index) => ({
      id: node.id,
      x: centerX + radius * Math.cos(index * angleSlice - Math.PI / 2),
      y: centerY + radius * Math.sin(index * angleSlice - Math.PI / 2),
    }));
  }, [nodes]);

  const getNodeColor = (nodeId: string) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return '#94a3b8';

    switch (node.status) {
      case NodeStatus.HEALTHY:
        return '#22c55e';
      case NodeStatus.DEGRADED:
        return '#eab308';
      case NodeStatus.FAILED:
        return '#ef4444';
      default:
        return '#94a3b8';
    }
  };

  const renderNetworkEdges = () => {
    if (nodePositions.length === 0) return null;

    return (
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 0 }}
      >
        {/* Draw edges from each node to leader */}
        {leader &&
          nodePositions.map((pos, idx) => {
            const leaderPos = nodePositions.find((p) => p.id === leader);
            if (!leaderPos || pos.id === leader) return null;

            return (
              <line
                key={`edge-${pos.id}`}
                x1={pos.x}
                y1={pos.y}
                x2={leaderPos.x}
                y2={leaderPos.y}
                stroke="#64748b"
                strokeWidth="1"
                strokeDasharray="4"
                opacity="0.5"
              />
            );
          })}
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg shadow-xl"
    >
      <h2 className="text-2xl font-bold text-white mb-4">Network Topology</h2>

      <div className="relative w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-700" style={{ height: '400px' }}>
        {/* Network SVG background */}
        {renderNetworkEdges()}

        {/* Nodes container */}
        <div className="absolute inset-0 w-full h-full">
          {nodePositions.map((pos) => {
            const node = nodes.find((n) => n.id === pos.id);
            const isLeader = pos.id === leader;
            const isSelected = pos.id === selectedNode;

            if (!node) return null;

            const color = getNodeColor(pos.id);

            return (
              <motion.div
                key={pos.id}
                className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${(pos.x / 600) * 100}%`,
                  top: `${(pos.y / 300) * 100}%`,
                }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedNode(pos.id)}
              >
                {/* Node circle with glow */}
                <motion.div
                  className="relative w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-lg"
                  style={{
                    borderColor: color,
                    backgroundColor: `${color}20`,
                  }}
                  animate={
                    isLeader
                      ? {
                          boxShadow: [
                            `0 0 0 0px ${color}80`,
                            `0 0 0 15px ${color}00`,
                          ],
                        }
                      : {}
                  }
                  transition={{
                    duration: 1.5,
                    repeat: isLeader ? Infinity : 0,
                  }}
                >
                  {/* Inner circle */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs"
                    style={{ backgroundColor: color }}
                  >
                    {pos.id.split('-')[1]}
                  </div>

                  {/* Leader badge */}
                  {isLeader && (
                    <motion.div
                      className="absolute -top-3 -right-3 bg-yellow-400 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, linear: true }}
                    >
                      ★
                    </motion.div>
                  )}

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue-400"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </motion.div>

                {/* Node label */}
                <div className="text-center mt-2">
                  <p className="text-white text-xs font-semibold">{pos.id}</p>
                  <p className="text-gray-400 text-xs capitalize">{node.status}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">
            <p>No nodes in cluster. Start simulation to begin.</p>
          </div>
        )}
      </div>

      {/* Topology info */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
          <p className="text-xs text-gray-400">Nodes</p>
          <p className="text-lg font-bold text-white">{nodes.length}</p>
        </div>
        <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
          <p className="text-xs text-gray-400">Leader</p>
          <p className="text-lg font-bold text-yellow-400">{leader || 'None'}</p>
        </div>
        <div className="bg-slate-700/50 p-3 rounded border border-slate-600">
          <p className="text-xs text-gray-400">Healthy</p>
          <p className="text-lg font-bold text-green-400">
            {nodes.filter((n) => n.status === NodeStatus.HEALTHY).length}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { NodeState, NodeStatus } from '../types';

interface NodeCardProps {
  node: NodeState;
  isSelected: boolean;
  onSelect: (nodeId: string) => void;
}

export const NodeCard: React.FC<NodeCardProps> = ({
  node,
  isSelected,
  onSelect,
}) => {
  const getStatusColor = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.HEALTHY:
        return 'from-green-400 to-green-600';
      case NodeStatus.DEGRADED:
        return 'from-yellow-400 to-yellow-600';
      case NodeStatus.FAILED:
        return 'from-red-400 to-red-600';
    }
  };

  const getStatusLabel = (status: NodeStatus) => {
    switch (status) {
      case NodeStatus.HEALTHY:
        return 'Healthy';
      case NodeStatus.DEGRADED:
        return 'Degraded';
      case NodeStatus.FAILED:
        return 'Failed';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onSelect(node.id)}
      className={`relative p-4 rounded-lg cursor-pointer transition-all ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className={`bg-gradient-to-br ${getStatusColor(node.status)} p-4 rounded-lg h-40 flex flex-col justify-between text-white shadow-lg`}>
        <div>
          <h3 className="font-bold text-lg">{node.id}</h3>
          {node.isLeader && (
            <span className="inline-block bg-yellow-300 text-black text-xs font-bold px-2 py-1 rounded mt-1">
              LEADER
            </span>
          )}
        </div>

        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Status:</span>
            <span className="font-semibold">{getStatusLabel(node.status)}</span>
          </div>
          <div className="flex justify-between">
            <span>Health:</span>
            <span className="font-semibold">{node.healthScore.toFixed(1)}</span>
          </div>
          <div className="flex justify-between">
            <span>CPU:</span>
            <span className="font-semibold">{node.cpu.toFixed(1)}%</span>
          </div>
          <div className="flex justify-between">
            <span>Memory:</span>
            <span className="font-semibold">{node.memory.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

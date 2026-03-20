import React, { useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationContext } from '../context/SimulationContext';
import { NodeStatus } from '../types';

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;

export const NetworkCanvasEnhanced: React.FC = () => {
  const { nodes, leader, selectedNode, setSelectedNode, animationEvents } =
    useSimulationContext();
  const svgRef = useRef<SVGSVGElement>(null);

  // Calculate node positions in a circular topology
  const nodePositions: NodePosition[] = useMemo(() => {
    if (nodes.length === 0) return [];

    const centerX = CANVAS_WIDTH / 2;
    const centerY = CANVAS_HEIGHT / 2;
    const radius = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.35;
    const angleSlice = (Math.PI * 2) / Math.max(nodes.length, 1);

    return nodes.map((node, index) => ({
      id: node.id,
      x: centerX + radius * Math.cos(index * angleSlice - Math.PI / 2),
      y: centerY + radius * Math.sin(index * angleSlice - Math.PI / 2),
    }));
  }, [nodes]);

  const getNodeColor = (nodeId: string, isLeader: boolean) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return '#64748b';

    if (isLeader) {
      return '#06b6d4'; // Cyan for leader
    }

    switch (node.status) {
      case NodeStatus.HEALTHY:
        return '#22c55e'; // Green
      case NodeStatus.DEGRADED:
        return '#eab308'; // Yellow
      case NodeStatus.FAILED:
        return '#ef4444'; // Red
      default:
        return '#64748b'; // Gray
    }
  };

  const renderNetworkEdges = () => {
    if (nodePositions.length < 2) return null;

    return (
      <>
        {/* Draw edges from all nodes to leader */}
        {leader &&
          nodePositions.map((pos) => {
            const leaderPos = nodePositions.find((p) => p.id === leader);
            if (!leaderPos || pos.id === leader) return null;

            const distance = Math.sqrt(
              Math.pow(leaderPos.x - pos.x, 2) +
              Math.pow(leaderPos.y - pos.y, 2)
            );
            const dashLength = 4;
            const dashGap = 4;
            const totalDash = dashLength + dashGap;
            const dashOffset = (distance % totalDash) - totalDash;

            return (
              <motion.line
                key={`edge-${pos.id}`}
                x1={pos.x}
                y1={pos.y}
                x2={leaderPos.x}
                y2={leaderPos.y}
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray={`${dashLength},${dashGap}`}
                opacity="0.4"
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            );
          })}

        {/* Draw edges between adjacent nodes */}
        {nodePositions.map((pos, idx) => {
          const nextIdx = (idx + 1) % nodePositions.length;
          const nextPos = nodePositions[nextIdx];

          return (
            <line
              key={`ring-edge-${pos.id}`}
              x1={pos.x}
              y1={pos.y}
              x2={nextPos.x}
              y2={nextPos.y}
              stroke="#475569"
              strokeWidth="1"
              opacity="0.2"
            />
          );
        })}
      </>
    );
  };

  const renderAnimationEvents = () => {
    return animationEvents.map((event, idx) => {
      const nodePos = nodePositions.find((p) => p.id === event.nodeId);
      if (!nodePos) return null;

      if (event.type === 'HEARTBEAT') {
        return (
          <motion.g key={`heartbeat-${idx}`}>
            <motion.circle
              cx={nodePos.x}
              cy={nodePos.y}
              r="0"
              fill="none"
              stroke="#22c55e"
              strokeWidth="2"
              animate={{
                r: [0, 40],
                opacity: [1, 0],
              }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          </motion.g>
        );
      }

      if (event.type === 'COORDINATOR') {
        return (
          <motion.g key={`coordinator-${idx}`}>
            <motion.path
              d={`M ${nodePos.x - 20} ${nodePos.y} L ${nodePos.x + 20} ${nodePos.y} M ${nodePos.x} ${nodePos.y - 20} L ${nodePos.x} ${nodePos.y + 20}`}
              stroke="#06b6d4"
              strokeWidth="2"
              fill="none"
              strokeLinecap="round"
              animate={{
                opacity: [1, 0.5, 1],
                scale: [1, 1.3, 1],
              }}
              transition={{ duration: 0.8, repeat: 2 }}
            />
          </motion.g>
        );
      }

      return null;
    });
  };

  const renderNodes = () => {
    return nodePositions.map((pos) => {
      const node = nodes.find((n) => n.id === pos.id);
      const isLeader = pos.id === leader;
      const isSelected = pos.id === selectedNode;

      if (!node) return null;

      const color = getNodeColor(pos.id, isLeader);

      return (
        <motion.g
          key={pos.id}
          onClick={() => setSelectedNode(pos.id)}
          style={{ cursor: 'pointer' }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Leader glow effect */}
          {isLeader && (
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r="45"
              fill="none"
              stroke="#06b6d4"
              strokeWidth="1"
              opacity="0.3"
              animate={{
                r: [45, 55, 45] as unknown as number,
                opacity: [0.3, 0.1, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Node circle */}
          <motion.circle
            cx={pos.x}
            cy={pos.y}
            r="28"
            fill="rgba(15, 23, 42, 0.8)"
            stroke={color}
            strokeWidth={isLeader ? '3' : isSelected ? '2.5' : '2'}
            filter={isLeader ? 'url(#nodeShadow)' : undefined}
          />

          {/* Status indicator dot */}
          <motion.circle
            cx={pos.x + 18}
            cy={pos.y - 18}
            r="5"
            fill={color}
            animate={
              node.status === NodeStatus.HEALTHY
                ? { r: [5, 7, 5] }
                : undefined
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Node label */}
          <text
            x={pos.x}
            y={pos.y}
            textAnchor="middle"
            dy="0.3em"
            className="text-xs font-bold select-none pointer-events-none"
            fill={color}
          >
            {pos.id.split('-')[1]}
          </text>

          {/* Leader badge */}
          {isLeader && (
            <g>
              <circle
                cx={pos.x}
                cy={pos.y - 40}
                r="12"
                fill="#06b6d4"
                opacity="0.2"
              />
              <text
                x={pos.x}
                y={pos.y - 36}
                textAnchor="middle"
                dy="0.3em"
                className="text-xs font-bold select-none pointer-events-none"
                fill="#06b6d4"
              >
                ★
              </text>
            </g>
          )}

          {/* Selection highlight */}
          {isSelected && (
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r="40"
              fill="none"
              stroke="#3b82f6"
              strokeWidth="2"
              animate={{ r: [40, 45, 40] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}
        </motion.g>
      );
    });
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 relative p-4">
      {/* Background grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10 pointer-events-none"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke="white"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width={CANVAS_WIDTH} height={CANVAS_HEIGHT} fill="url(#grid)" />
      </svg>

      {/* Main SVG Canvas */}
      <svg
        ref={svgRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="relative z-10 drop-shadow-lg"
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
      >
        <defs>
          <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodOpacity="0.6"
              floodColor="#06b6d4"
            />
          </filter>
          <linearGradient id="backgroundGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(30, 41, 59, 0.05)" />
            <stop offset="100%" stopColor="rgba(15, 23, 42, 0.05)" />
          </linearGradient>
        </defs>

        {/* Background */}
        <rect
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          fill="url(#backgroundGradient)"
        />

        {/* Network edges */}
        {renderNetworkEdges()}

        {/* Animation events layer */}
        <AnimatePresence>{renderAnimationEvents()}</AnimatePresence>

        {/* Nodes */}
        {renderNodes()}
      </svg>

      {/* Empty state */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center z-20">
          <div className="text-center">
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-lg text-gray-500 font-semibold"
            >
              Start simulation to visualize the network
            </motion.div>
          </div>
        </div>
      )}

      {/* Stats overlay */}
      <div className="absolute top-6 left-6 text-xs space-y-2 z-20">
        <div className="bg-slate-900/70 backdrop-blur px-3 py-2 rounded border border-slate-700">
          <div className="text-gray-400">Nodes: <span className="text-white font-semibold">{nodes.length}</span></div>
        </div>
        <div className="bg-slate-900/70 backdrop-blur px-3 py-2 rounded border border-slate-700">
          <div className="text-gray-400">Leader: <span className="text-cyan-400 font-semibold">{leader || 'None'}</span></div>
        </div>
      </div>
    </div>
  );
};

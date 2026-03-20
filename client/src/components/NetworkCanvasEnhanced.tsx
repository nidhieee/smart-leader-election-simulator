import React, { useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSimulationContext } from '../context/SimulationContext';
import { NodeStatus } from '../types';

interface NodePosition {
  id: string;
  x: number;
  y: number;
}

interface DragState {
  [key: string]: { x: number; y: number };
}

const CANVAS_WIDTH = 1200;
const CANVAS_HEIGHT = 600;
const PADDING = 60;

export const NetworkCanvasEnhanced: React.FC = () => {
  const { nodes, leader, selectedNode, setSelectedNode, animationEvents } =
    useSimulationContext();
  const svgRef = useRef<SVGSVGElement>(null);
  const [dragState, setDragState] = useState<DragState>({});
  const [draggingNode, setDraggingNode] = useState<string | null>(null);

  // Calculate node positions in a circular topology
  const nodePositions: NodePosition[] = useMemo(() => {
    if (nodes.length === 0) return [];

    const centerX = (CANVAS_WIDTH - 2 * PADDING) / 2 + PADDING;
    const centerY = (CANVAS_HEIGHT - 2 * PADDING) / 2 + PADDING;
    const radius = Math.min(CANVAS_WIDTH, CANVAS_HEIGHT) * 0.3 - PADDING;
    const angleSlice = (Math.PI * 2) / Math.max(nodes.length, 1);

    return nodes.map((node, index) => {
      if (dragState[node.id]) {
        return {
          id: node.id,
          x: dragState[node.id].x,
          y: dragState[node.id].y,
        };
      }

      return {
        id: node.id,
        x: centerX + radius * Math.cos(index * angleSlice - Math.PI / 2),
        y: centerY + radius * Math.sin(index * angleSlice - Math.PI / 2),
      };
    });
  }, [nodes, dragState]);

  const handleMouseDown = (nodeId: string, e: React.MouseEvent) => {
    e.preventDefault();
    setDraggingNode(nodeId);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!draggingNode || !svgRef.current) return;

    const svg = svgRef.current;
    const rect = svg.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Constrain within canvas
    const constrainedX = Math.max(PADDING + 28, Math.min(CANVAS_WIDTH - PADDING - 28, x));
    const constrainedY = Math.max(PADDING + 28, Math.min(CANVAS_HEIGHT - PADDING - 28, y));

    setDragState((prev) => ({
      ...prev,
      [draggingNode]: { x: constrainedX, y: constrainedY },
    }));
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const getNodeColor = (nodeId: string, isLeader: boolean) => {
    const node = nodes.find((n) => n.id === nodeId);
    if (!node) return '#9ca3af';

    if (isLeader) {
      return '#60a5fa'; // Bright blue for leader
    }

    switch (node.status) {
      case NodeStatus.HEALTHY:
        return '#4ade80'; // Bright green
      case NodeStatus.DEGRADED:
        return '#fbbf24'; // Bright amber
      case NodeStatus.FAILED:
        return '#f87171'; // Bright red
      default:
        return '#9ca3af'; // Gray
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
                stroke="#d1d5db"
                strokeWidth="1.5"
                strokeDasharray={`${dashLength},${dashGap}`}
                opacity="0.3"
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              />
            );
          })}

        {/* Draw edges between adjacent nodes */}
        {nodePositions.map((pos) => {
          const nextIdx = (nodePositions.indexOf(pos) + 1) % nodePositions.length;
          const nextPos = nodePositions[nextIdx];

          return (
            <line
              key={`ring-edge-${pos.id}`}
              x1={pos.x}
              y1={pos.y}
              x2={nextPos.x}
              y2={nextPos.y}
              stroke="#d1d5db"
              strokeWidth="1"
              opacity="0.15"
            />
          );
        })}
      </>
    );
  };

  const renderAnimationEvents = () => {
    const heartbeatEvents = animationEvents.filter((e) => e.type === 'HEARTBEAT');
    
    return animationEvents.map((event, idx) => {
      const nodePos = nodePositions.find((p) => p.id === event.nodeId);
      if (!nodePos) return null;

      if (event.type === 'HEARTBEAT') {
        return (
          <motion.g key={`heartbeat-${idx}-${event.timestamp}`}>
            {/* Multiple ripple waves */}
            {[0, 0.33, 0.66].map((delay) => (
              <motion.circle
                key={`ripple-${delay}`}
                cx={nodePos.x}
                cy={nodePos.y}
                r="0"
                fill="none"
                stroke="#4ade80"
                strokeWidth="2"
                animate={{
                  r: [0, 50],
                  opacity: [1, 0],
                }}
                transition={{
                  duration: 1.2,
                  ease: 'easeOut',
                  delay: delay * 0.3,
                }}
              />
            ))}
            
            {/* Center pulse */}
            <motion.circle
              cx={nodePos.x}
              cy={nodePos.y}
              r="4"
              fill="#4ade80"
              animate={{
                r: [4, 8, 4],
                opacity: [1, 0.5, 1],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
              }}
            />
          </motion.g>
        );
      }

      if (event.type === 'COORDINATOR') {
        return (
          <motion.g key={`coordinator-${idx}-${event.timestamp}`}>
            <motion.path
              d={`M ${nodePos.x - 20} ${nodePos.y} L ${nodePos.x + 20} ${nodePos.y} M ${nodePos.x} ${nodePos.y - 20} L ${nodePos.x} ${nodePos.y + 20}`}
              stroke="#2563eb"
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

  const renderHeartbeatPaths = () => {
    // Show heartbeat signals as red dots traveling from leader to follower nodes
    if (!leader || animationEvents.length === 0) return null;

    const hasHeartbeat = animationEvents.some((e) => e.type === 'HEARTBEAT');
    if (!hasHeartbeat) return null;

    const leaderPos = nodePositions.find((p) => p.id === leader);
    if (!leaderPos) return null;

    return nodePositions.map((followerPos) => {
      if (followerPos.id === leader) return null;

      return (
        <g key={`heartbeat-path-${followerPos.id}`}>
          {/* Animated red dot moving from leader to follower */}
          <motion.circle
            cx={leaderPos.x}
            cy={leaderPos.y}
            r="3"
            fill="#ef4444"
            opacity="0.8"
            animate={{
              cx: [leaderPos.x, followerPos.x],
              cy: [leaderPos.y, followerPos.y],
              opacity: [1, 0],
            }}
            transition={{
              duration: 0.8,
              ease: 'easeInOut',
              repeat: Infinity,
              repeatDelay: 0.2,
            }}
          />
        </g>
      );
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
          onMouseDown={(e) => handleMouseDown(pos.id, e as any)}
          style={{ cursor: draggingNode === pos.id ? 'grabbing' : 'grab' }}
          whileHover={{ scale: 1.1 }}
        >
          {/* Leader glow effect */}
          {isLeader && (
            <motion.circle
              cx={pos.x}
              cy={pos.y}
              r="45"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1"
              opacity="0.2"
              animate={{
                r: [45, 55, 45],
                opacity: [0.2, 0.05, 0.2],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          )}

          {/* Node circle */}
          <circle
            cx={pos.x}
            cy={pos.y}
            r="28"
            fill="rgba(30, 41, 59, 0.9)"
            stroke={color}
            strokeWidth={isLeader ? '3' : isSelected ? '2.5' : '2'}
            filter={isLeader ? 'url(#nodeShadow)' : undefined}
          />

          {/* Health score display */}
          <text
            x={pos.x}
            y={pos.y - 8}
            textAnchor="middle"
            className="text-xs font-bold select-none pointer-events-none"
            fill={color}
            fontSize="10"
          >
            {node.healthScore.toFixed(0)}
          </text>

          {/* Node ID */}
          <text
            x={pos.x}
            y={pos.y + 6}
            textAnchor="middle"
            className="text-xs font-bold select-none pointer-events-none"
            fill="#f3f4f6"
            fontSize="11"
          >
            N{pos.id.split('-')[1]}
          </text>

          {/* Status indicator dot */}
          <motion.circle
            cx={pos.x + 20}
            cy={pos.y - 20}
            r="5"
            fill={color}
            animate={
              node.status === NodeStatus.HEALTHY
                ? { r: [5, 7, 5] }
                : undefined
            }
            transition={{ duration: 1.5, repeat: Infinity }}
          />

          {/* Leader badge */}
          {isLeader && (
            <g>
              <circle
                cx={pos.x}
                cy={pos.y - 42}
                r="10"
                fill="#60a5fa"
                opacity="0.3"
              />
              <text
                x={pos.x}
                y={pos.y - 38}
                textAnchor="middle"
                dy="0.3em"
                className="text-xs font-bold select-none pointer-events-none"
                fill="#60a5fa"
                fontSize="12"
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
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 relative p-0">
      {/* Background pattern */}
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
        className="relative z-10"
        viewBox={`0 0 ${CANVAS_WIDTH} ${CANVAS_HEIGHT}`}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="0"
              stdDeviation="4"
              floodOpacity="0.6"
              floodColor="#60a5fa"
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

        {/* Heartbeat path signals */}
        {renderHeartbeatPaths()}

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
              className="text-sm text-slate-500 font-semibold tracking-wide"
            >
              START SIMULATION TO BEGIN
            </motion.div>
          </div>
        </div>
      )}

      {/* Stats overlay */}
      <div className="absolute top-4 left-4 text-xs space-y-2 z-20">
        <div className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded border border-slate-700/50">
          <div className="text-slate-400">NODES: <span className="text-white font-semibold">{nodes.length}</span></div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur px-3 py-1.5 rounded border border-slate-700/50">
          <div className="text-slate-400">LEADER: <span className="text-cyan-400 font-semibold">{leader ? leader.split('-')[1] : '–'}</span></div>
        </div>
      </div>

      {/* Hint */}
      {nodes.length > 0 && (
        <div className="absolute bottom-4 left-4 text-xs text-slate-500 tracking-wider">
          DRAG NODES TO REPOSITION
        </div>
      )}
    </div>
  );
};

export default NetworkCanvasEnhanced;
import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { NodeState, ClusterUpdate } from '../types';

export interface AnimationEvent {
  type: 'HEARTBEAT' | 'ELECTION' | 'RESPONSE' | 'COORDINATOR';
  nodeId: string;
  fromNode?: string;
  toNode?: string;
  timestamp: number;
  positions?: { from: { x: number; y: number }; to: { x: number; y: number } };
}

interface SimulationContextType {
  nodes: NodeState[];
  leader: string | null;
  isRunning: boolean;
  isPaused: boolean;
  logs: string[];
  selectedNode: string | null;
  setSelectedNode: (nodeId: string | null) => void;
  updateCluster: (update: ClusterUpdate) => void;
  sendCommand: (command: string, nodeId?: string) => void;
  isConnected: boolean;
  animationEvents: AnimationEvent[];
  clearAnimationEvent: (index: number) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(
  undefined
);

export const useSimulationContext = () => {
  const context = useContext(SimulationContext);
  if (!context) {
    throw new Error(
      'useSimulationContext must be used within SimulationProvider'
    );
  }
  return context;
};

interface SimulationProviderProps {
  children: React.ReactNode;
}

export const SimulationProvider: React.FC<SimulationProviderProps> = ({
  children,
}) => {
  const [nodes, setNodes] = useState<NodeState[]>([]);
  const [leader, setLeader] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [animationEvents, setAnimationEvents] = useState<AnimationEvent[]>([]);
  
  // Use ref to hold WebSocket instance and prevent recreation
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isConnectingRef = useRef(false);
  const connectionAttempts = useRef(0);
  const MAX_RECONNECT_ATTEMPTS = 10;
  const RECONNECT_DELAY = 2000;

  const updateCluster = useCallback((update: ClusterUpdate) => {
    setNodes(update.nodes);
    setLeader(update.leader);

    if (update.log) {
      setLogs((prev) => [...prev.slice(-99), update.log]);
    }
  }, []);

  const clearAnimationEvent = useCallback((index: number) => {
    setAnimationEvents((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const sendCommand = useCallback(
    (command: string, nodeId?: string) => {
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            command,
            nodeId,
          })
        );
      } else {
        console.warn('WebSocket not connected. Command not sent:', command);
      }
    },
    []
  );

  // Connect only once using useEffect with empty dependency array
  useEffect(() => {
    // Only connect if not already connecting
    if (isConnectingRef.current) return;
    if (connectionAttempts.current >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      return;
    }

    isConnectingRef.current = true;

    const connectWebSocket = () => {
      try {
        const websocket = new WebSocket('ws://localhost:3001');

        websocket.onopen = () => {
          console.log('✓ Connected to server');
          setIsConnected(true);
          wsRef.current = websocket;
          isConnectingRef.current = false;
          connectionAttempts.current = 0;

          // Clear any pending reconnect timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        websocket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);

            if (message.type === 'cluster-update') {
              updateCluster(message.data);
            } else if (message.type === 'animation-event') {
              // Add animation event with auto-clear after 2 seconds
              setAnimationEvents((prev) => [
                ...prev,
                message.event as AnimationEvent,
              ]);

              setTimeout(() => {
                setAnimationEvents((prev) =>
                  prev.filter((e) => e.timestamp !== message.event.timestamp)
                );
              }, 2000);
            }
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        websocket.onclose = () => {
          console.log('✗ Disconnected from server');
          setIsConnected(false);
          wsRef.current = null;
          isConnectingRef.current = false;

          // Attempt to reconnect after delay
          if (connectionAttempts.current < MAX_RECONNECT_ATTEMPTS) {
            connectionAttempts.current += 1;
            console.log(
              `Reconnection attempt ${connectionAttempts.current}/${MAX_RECONNECT_ATTEMPTS}...`
            );
            reconnectTimeoutRef.current = setTimeout(() => {
              connectWebSocket();
            }, RECONNECT_DELAY);
          }
        };

        websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
        };
      } catch (error) {
        console.error('Failed to create WebSocket:', error);
        isConnectingRef.current = false;
      }
    };

    connectWebSocket();

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      isConnectingRef.current = false;
    };
  }, []); // Empty dependency array - connect only once

  const value: SimulationContextType = {
    nodes,
    leader,
    isRunning: nodes.length > 0,
    isPaused: false,
    logs,
    selectedNode,
    setSelectedNode,
    updateCluster,
    sendCommand,
    isConnected,
    animationEvents,
    clearAnimationEvent,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

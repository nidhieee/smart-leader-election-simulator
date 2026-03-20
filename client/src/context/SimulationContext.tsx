import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { NodeState, ClusterUpdate } from '../types';

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
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // Use ref to hold WebSocket instance and prevent recreation
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false);

  const updateCluster = useCallback((update: ClusterUpdate) => {
    setNodes(update.nodes);
    setLeader(update.leader);

    if (update.log) {
      setLogs((prev) => [...prev.slice(-99), update.log]);
    }
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
    isConnectingRef.current = true;

    const connectWebSocket = () => {
      try {
        const websocket = new WebSocket('ws://localhost:3001');

        websocket.onopen = () => {
          console.log('✓ Connected to server');
          setIsConnected(true);
          wsRef.current = websocket;
          isConnectingRef.current = false;

          // Clear any pending reconnect timeout
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = null;
          }
        };

        websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            updateCluster(data);
          } catch (error) {
            console.error('Error parsing message:', error);
          }
        };

        websocket.onclose = () => {
          console.log('✗ Disconnected from server');
          setIsConnected(false);
          wsRef.current = null;
          isConnectingRef.current = false;

          // Attempt to reconnect after 2 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('Attempting to reconnect...');
            connectWebSocket();
          }, 2000);
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
    isPaused,
    logs,
    selectedNode,
    setSelectedNode,
    updateCluster,
    sendCommand,
    isConnected,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

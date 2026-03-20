import React, { createContext, useContext, useState, useCallback } from 'react';
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
  connect: () => void;
  disconnect: () => void;
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
  const [ws, setWs] = useState<WebSocket | null>(null);

  const sendCommand = useCallback(
    (command: string, nodeId?: string) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(
          JSON.stringify({
            command,
            nodeId,
          })
        );
      }
    },
    [ws]
  );

  const updateCluster = useCallback((update: ClusterUpdate) => {
    setNodes(update.nodes);
    setLeader(update.leader);

    if (update.log) {
      setLogs((prev) => [...prev.slice(-99), update.log]);
    }

    // Update running and paused states based on server state
    if (update.nodes.length === 0) {
      setIsRunning(false);
      setIsPaused(false);
    } else {
      setIsRunning(true);
    }
  }, []);

  const connect = useCallback(() => {
    try {
      const websocket = new WebSocket('ws://localhost:3001');

      websocket.onopen = () => {
        console.log('Connected to server');
        setIsConnected(true);
        setWs(websocket);
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
        console.log('Disconnected from server');
        setIsConnected(false);
        setWs(null);
      };

      websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  }, [updateCluster]);

  const disconnect = useCallback(() => {
    if (ws) {
      ws.close();
      setWs(null);
      setIsConnected(false);
    }
  }, [ws]);

  const value: SimulationContextType = {
    nodes,
    leader,
    isRunning,
    isPaused,
    logs,
    selectedNode,
    setSelectedNode,
    updateCluster,
    sendCommand,
    connect,
    disconnect,
    isConnected,
  };

  return (
    <SimulationContext.Provider value={value}>
      {children}
    </SimulationContext.Provider>
  );
};

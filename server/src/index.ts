import express, { Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { ClusterManager } from './simulation/ClusterManager';
import { ElectionService } from './simulation/ElectionService';
import { HeartbeatService } from './simulation/HeartbeatService';
import { ClusterUpdate, NodeStatus } from './simulation/types';

const app = express();
const httpServer = createServer(app);
const wss = new WebSocketServer({ server: httpServer });

// Simulation components
const clusterManager = new ClusterManager();
const electionService = new ElectionService(clusterManager);
const heartbeatService = new HeartbeatService(clusterManager, electionService);

// State
let isRunning = false;
let isPaused = false;
const eventLog: string[] = [];
let clients: Set<WebSocket> = new Set();

// Initialize cluster with some nodes
function initializeCluster(): void {
  clusterManager.clear();
  eventLog.length = 0;

  for (let i = 0; i < 5; i++) {
    clusterManager.addNode(`Node-${i + 1}`);
  }

  // Run initial election
  const leaderId = electionService.selectLeader();
  addLog(`[INIT] Leader elected: ${leaderId}`);
}

function addLog(message: string): void {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] ${message}`;
  eventLog.push(logMessage);

  // Keep only last 100 logs
  if (eventLog.length > 100) {
    eventLog.shift();
  }
}

function broadcastUpdate(): void {
  const update: ClusterUpdate = {
    nodes: clusterManager.getNodeStates(),
    leader: clusterManager.getLeader(),
    election: false,
    log: eventLog[eventLog.length - 1] || '',
  };

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(update));
    }
  });
}

// WebSocket handlers
wss.on('connection', (ws: WebSocket) => {
  clients.add(ws);
  console.log('Client connected. Total clients:', clients.size);

  // Send initial state
  const update: ClusterUpdate = {
    nodes: clusterManager.getNodeStates(),
    leader: clusterManager.getLeader(),
    election: false,
    log: '',
  };
  ws.send(JSON.stringify(update));

  ws.on('message', (message: string) => {
    try {
      const data = JSON.parse(message);
      handleCommand(data, ws);
    } catch (error) {
      console.error('Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected. Total clients:', clients.size);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

function handleCommand(data: any, ws: WebSocket): void {
  const { command, nodeId } = data;

  switch (command) {
    case 'start':
      if (!isRunning) {
        isRunning = true;
        isPaused = false;
        initializeCluster();
        heartbeatService.startLoop();
        heartbeatService.setElectionCallback(() => {
          addLog(`[ELECTION] New leader elected: ${clusterManager.getLeader()}`);
          broadcastUpdate();
        });
        addLog('[SIM] Simulation started');
        broadcastUpdate();
      }
      break;

    case 'pause':
      if (isRunning && !isPaused) {
        isPaused = true;
        heartbeatService.stopLoop();
        addLog('[SIM] Simulation paused');
        broadcastUpdate();
      }
      break;

    case 'resume':
      if (isRunning && isPaused) {
        isPaused = false;
        heartbeatService.startLoop();
        addLog('[SIM] Simulation resumed');
        broadcastUpdate();
      }
      break;

    case 'reset':
      isRunning = false;
      isPaused = false;
      heartbeatService.stopLoop();
      clusterManager.clear();
      eventLog.length = 0;
      addLog('[SIM] Simulation reset');
      broadcastUpdate();
      break;

    case 'addNode':
      if (isRunning) {
        const nodeId = `Node-${clusterManager.getNodeCount() + 1}`;
        clusterManager.addNode(nodeId);
        addLog(`[NODE] Added node: ${nodeId}`);

        // Re-run election if needed
        if (!clusterManager.getLeader()) {
          electionService.selectLeader();
          addLog(`[ELECTION] New leader elected: ${clusterManager.getLeader()}`);
        }

        broadcastUpdate();
      }
      break;

    case 'removeNode':
      if (isRunning && nodeId) {
        clusterManager.removeNode(nodeId);
        addLog(`[NODE] Removed node: ${nodeId}`);

        // Re-run election if leader was removed
        if (!clusterManager.getLeader()) {
          electionService.selectLeader();
          addLog(`[ELECTION] New leader elected: ${clusterManager.getLeader()}`);
        }

        broadcastUpdate();
      }
      break;

    case 'crashNode':
      if (isRunning && nodeId) {
        clusterManager.crashNode(nodeId);
        addLog(`[FAILURE] Node crashed: ${nodeId}`);

        // Check if leader crashed
        if (nodeId === clusterManager.getLeader()) {
          addLog('[ELECTION] Leader crashed, starting new election');
          electionService.selectLeader();
          addLog(`[ELECTION] New leader elected: ${clusterManager.getLeader()}`);
        }

        broadcastUpdate();
      }
      break;

    case 'overloadNode':
      if (isRunning && nodeId) {
        clusterManager.overloadNode(nodeId);
        addLog(`[DEGRADATION] Node overloaded: ${nodeId}`);

        // Check if leader became degraded
        if (nodeId === clusterManager.getLeader()) {
          const leader = clusterManager.getNode(nodeId);
          if (leader && leader.getHealthScore() < 20) {
            addLog('[ELECTION] Leader degraded, starting new election');
            electionService.selectLeader();
            addLog(`[ELECTION] New leader elected: ${clusterManager.getLeader()}`);
          }
        }

        broadcastUpdate();
      }
      break;

    case 'recoverNode':
      if (isRunning && nodeId) {
        clusterManager.recoverNode(nodeId);
        addLog(`[RECOVERY] Node recovered: ${nodeId}`);
        broadcastUpdate();
      }
      break;

    default:
      console.warn('Unknown command:', command);
  }
}

// REST endpoints
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', running: isRunning });
});

app.get('/api/cluster', (_req: Request, res: Response) => {
  res.json({
    nodes: clusterManager.getNodeStates(),
    leader: clusterManager.getLeader(),
    isRunning,
    isPaused,
    logs: eventLog,
  });
});

// Start server
const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`WebSocket server ready on ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  heartbeatService.stopLoop();
  httpServer.close();
  process.exit(0);
});

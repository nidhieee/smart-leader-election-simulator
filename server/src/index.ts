import express, { Request, Response } from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer } from 'http';
import { ClusterManager } from './simulation/ClusterManager';
import { ElectionService } from './simulation/ElectionService';
import { HeartbeatService } from './simulation/HeartbeatService';
import { ClusterUpdate, NodeStatus, ElectionMessage } from './simulation/types';

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
let broadcastInterval: NodeJS.Timeout | null = null;
let electionInProgress = false;
let lastSentLogIndex = -1; // Track which log was last sent
let lastElectionTime = 0; // Track when last election occurred
const ELECTION_COOLDOWN = 5000; // 5 seconds minimum between elections

// Initialize cluster with some nodes
function initializeCluster(): void {
  clusterManager.clear();
  eventLog.length = 0;
  lastSentLogIndex = -1;
  electionInProgress = false;

  for (let i = 0; i < 5; i++) {
    clusterManager.addNode(`Node-${i + 1}`);
  }

  // Run initial election
  const leaderId = electionService.selectLeader();
  addLog(`[INIT] Leader elected: ${leaderId}`);
  broadcastAnimationEvent({
    type: 'COORDINATOR',
    nodeId: leaderId || '',
    timestamp: Date.now(),
  });
}

function addLog(message: string): void {
  const timestamp = new Date().toLocaleTimeString();
  const logMessage = `[${timestamp}] ${message}`;
  eventLog.push(logMessage);

  // Keep only last 100 logs
  if (eventLog.length > 100) {
    eventLog.shift();
  }

  console.log(logMessage);
}

interface AnimationEvent {
  type: 'HEARTBEAT' | 'ELECTION' | 'RESPONSE' | 'COORDINATOR';
  nodeId: string;
  fromNode?: string;
  toNode?: string;
  timestamp: number;
  positions?: { from: { x: number; y: number }; to: { x: number; y: number } };
}

function broadcastAnimationEvent(event: AnimationEvent): void {
  const message = JSON.stringify({
    type: 'animation-event',
    event,
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (error) {
        console.error('Error sending animation event:', error);
        clients.delete(client);
      }
    }
  });
}

function broadcastUpdate(): void {
  const latestLogIndex = eventLog.length - 1;
  const latestLog = eventLog[latestLogIndex] || '';

  // Only include log if it's new (different from last sent)
  const logToSend = latestLogIndex > lastSentLogIndex ? latestLog : '';

  const update: ClusterUpdate = {
    nodes: clusterManager.getNodeStates(),
    leader: clusterManager.getLeader(),
    election: electionInProgress,
    log: logToSend,
  };

  const message = JSON.stringify({
    type: 'cluster-update',
    data: update,
  });

  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      try {
        client.send(message);
      } catch (error) {
        console.error('Error sending message:', error);
        clients.delete(client);
      }
    }
  });

  // Update last sent log index
  if (logToSend) {
    lastSentLogIndex = latestLogIndex;
  }
}

function startBroadcastLoop(): void {
  if (broadcastInterval) clearInterval(broadcastInterval);
  
  let heartbeatCounter = 0;

  broadcastInterval = setInterval(() => {
    if (isRunning && !isPaused) {
      heartbeatCounter++;

      // Send heartbeat from leader every 2 seconds
      if (heartbeatCounter % 2 === 0) {
        const leaderId = clusterManager.getLeader();
        if (leaderId) {
          broadcastAnimationEvent({
            type: 'HEARTBEAT',
            nodeId: leaderId,
            timestamp: Date.now(),
          });
        }
      }

      // Update node states
      clusterManager.updateNodes();

      // Check for leader failure and trigger election if needed
      const now = Date.now();
      if (!electionInProgress && (now - lastElectionTime) > ELECTION_COOLDOWN) {
        if (electionService.shouldTriggerElection()) {
          electionInProgress = true;
          lastElectionTime = now;
          addLog('[ELECTION] Initiating leader election...');

          // Simulate election process
          setTimeout(() => {
            const newLeaderId = electionService.selectLeader();
            addLog(`[ELECTION] Leader elected: ${newLeaderId}`);
            broadcastAnimationEvent({
              type: 'COORDINATOR',
              nodeId: newLeaderId || '',
              timestamp: Date.now(),
            });
            electionInProgress = false;
            broadcastUpdate();
          }, 1000);
        }
      }

      // Regular broadcast
      broadcastUpdate();
    }
  }, 500); // Update every 500ms for smoother animations
}

function stopBroadcastLoop(): void {
  if (broadcastInterval) {
    clearInterval(broadcastInterval);
    broadcastInterval = null;
  }
}

// WebSocket handlers
wss.on('connection', (ws: WebSocket) => {
  clients.add(ws);
  console.log(`✓ Client connected. Total clients: ${clients.size}`);

  // Send initial state immediately
  const update: ClusterUpdate = {
    nodes: clusterManager.getNodeStates(),
    leader: clusterManager.getLeader(),
    election: electionInProgress,
    log: '',
  };
  
  try {
    ws.send(JSON.stringify({
      type: 'cluster-update',
      data: update,
    }));
  } catch (error) {
    console.error('Error sending initial state:', error);
  }

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
    console.log(`✗ Client disconnected. Total clients: ${clients.size}`);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });

  // Send ping to keep connection alive
  const pingInterval = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.ping();
    } else {
      clearInterval(pingInterval);
    }
  }, 30000);
});

function handleCommand(data: any, ws: WebSocket): void {
  const { command, nodeId } = data;

  switch (command) {
    case 'start':
      if (!isRunning) {
        isRunning = true;
        isPaused = false;
        electionInProgress = false;
        initializeCluster();
        heartbeatService.startLoop();
        heartbeatService.setElectionCallback(() => {
          if (!electionInProgress) {
            electionInProgress = true;
            addLog(`[ELECTION] Detecting failed leader...`);
            const newLeader = clusterManager.getLeader();
            if (newLeader) {
              addLog(`[ELECTION] New leader elected: ${newLeader}`);
              broadcastAnimationEvent({
                type: 'COORDINATOR',
                nodeId: newLeader,
                timestamp: Date.now(),
              });
            }
            electionInProgress = false;
          }
        });
        startBroadcastLoop();
        addLog('[SIM] Simulation started');
        broadcastUpdate();
      }
      break;

    case 'pause':
      if (isRunning && !isPaused) {
        isPaused = true;
        addLog('[SIM] Simulation paused');
        broadcastUpdate();
      }
      break;

    case 'resume':
      if (isRunning && isPaused) {
        isPaused = false;
        addLog('[SIM] Simulation resumed');
        broadcastUpdate();
      }
      break;

    case 'reset':
      isRunning = false;
      isPaused = false;
      electionInProgress = false;
      lastSentLogIndex = -1;
      lastElectionTime = 0;
      heartbeatService.stopLoop();
      stopBroadcastLoop();
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

        if (!clusterManager.getLeader()) {
          electionService.selectLeader();
          addLog(`[ELECTION] New leader elected: ${clusterManager.getLeader()}`);
        }

        broadcastUpdate();
      }
      break;

    case 'removeNode':
      if (isRunning && nodeId) {
        const removedNode = clusterManager.getNode(nodeId);
        const wasLeader = nodeId === clusterManager.getLeader();
        
        clusterManager.removeNode(nodeId);
        addLog(`[NODE] Removed node: ${nodeId}`);

        if (wasLeader) {
          addLog(`[ELECTION] Leader removed, triggering election...`);
          if (!electionInProgress) {
            electionInProgress = true;
            lastElectionTime = Date.now();
            
            setTimeout(() => {
              const newLeaderId = electionService.selectLeader();
              addLog(`[ELECTION] New leader elected: ${newLeaderId}`);
              broadcastAnimationEvent({
                type: 'COORDINATOR',
                nodeId: newLeaderId || '',
                timestamp: Date.now(),
              });
              electionInProgress = false;
              broadcastUpdate();
            }, 1000);
          }
        } else if (!clusterManager.getLeader()) {
          if (!electionInProgress) {
            electionInProgress = true;
            lastElectionTime = Date.now();
            
            setTimeout(() => {
              const newLeaderId = electionService.selectLeader();
              addLog(`[ELECTION] New leader elected: ${newLeaderId}`);
              broadcastAnimationEvent({
                type: 'COORDINATOR',
                nodeId: newLeaderId || '',
                timestamp: Date.now(),
              });
              electionInProgress = false;
              broadcastUpdate();
            }, 1000);
          }
        }

        broadcastUpdate();
      }
      break;

    case 'crashNode':
      if (isRunning && nodeId) {
        clusterManager.crashNode(nodeId);
        addLog(`[FAILURE] Node crashed: ${nodeId}`);

        if (nodeId === clusterManager.getLeader()) {
          addLog('[ELECTION] Leader crashed, starting new election');
          if (!electionInProgress) {
            electionInProgress = true;
            electionService.selectLeader();
            const newLeader = clusterManager.getLeader();
            addLog(`[ELECTION] New leader elected: ${newLeader}`);
            broadcastAnimationEvent({
              type: 'COORDINATOR',
              nodeId: newLeader || '',
              timestamp: Date.now(),
            });
            electionInProgress = false;
          }
        }

        broadcastUpdate();
      }
      break;

    case 'overloadNode':
      if (isRunning && nodeId) {
        clusterManager.overloadNode(nodeId);
        addLog(`[DEGRADATION] Node overloaded: ${nodeId}`);

        if (nodeId === clusterManager.getLeader()) {
          const leader = clusterManager.getNode(nodeId);
          if (leader && leader.getHealthScore() < 20) {
            addLog('[ELECTION] Leader degraded, starting new election');
            if (!electionInProgress) {
              electionInProgress = true;
              electionService.selectLeader();
              const newLeader = clusterManager.getLeader();
              addLog(`[ELECTION] New leader elected: ${newLeader}`);
              broadcastAnimationEvent({
                type: 'COORDINATOR',
                nodeId: newLeader || '',
                timestamp: Date.now(),
              });
              electionInProgress = false;
            }
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
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ WebSocket server ready on ws://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  stopBroadcastLoop();
  heartbeatService.stopLoop();
  httpServer.close();
  process.exit(0);
});

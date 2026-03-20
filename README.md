# Smart Leader Election in Distributed Cloud Clusters under Partial Failures

## Overview

This project presents a fault-aware leader election mechanism designed for distributed cloud environments where nodes may experience both complete failures and partial degradation due to resource constraints such as high CPU utilization, memory pressure, or network delays.

Traditional leader election algorithms such as the Bully Algorithm and Ring Algorithm rely on static identifiers and binary failure detection (alive or failed). These approaches are not suitable for modern cloud systems where nodes may remain operational but perform inefficiently.

This system introduces a dynamic, health-aware leader election strategy that selects the most reliable node based on real-time performance metrics, thereby improving system stability, reducing recovery time, and minimizing unnecessary elections.

## Problem Statement

In distributed cloud clusters, nodes frequently experience partial failures due to fluctuating workloads and resource contention. Existing leader election algorithms do not consider node performance or health, elect leaders based solely on static priorities, fail to handle degraded nodes effectively, and can lead to inefficient coordination.

## Proposed Solution

The system integrates heartbeat monitoring, dynamic health scoring, and partial failure handling.

**Health Score Formula:**
```
HealthScore = (Uptime * 0.40) - (CPU * 0.35) - (Memory * 0.25)
```

Nodes with low scores are considered degraded. Elections are triggered when the leader fails or becomes inefficient.

## Key Features

- **Real-time Cluster Simulation** - Visualize live cluster state with node health metrics
- **Leader Election Algorithm** - Dynamic health-based leader selection
- **Heartbeat Monitoring** - Continuous node health monitoring and failure detection
- **Partial Failure Handling** - Detects and handles both complete and partial node failures
- **Interactive Node Inspection** - Detailed metrics for each node
- **Event Logging** - Real-time event log tracking
- **Failure Injection** - Simulate node crashes and resource overload scenarios

## Scenarios Demonstrated

1. **Initial Election** - Cluster formation with initial leader election
2. **Leader Crash** - Complete failure of the leader node and re-election
3. **Leader Overload** - Partial degradation and degraded leader election
4. **Multiple Failures** - Handling cascading node failures
5. **Node Recovery** - Recovery and re-integration of nodes

## Architecture

### Frontend Stack
- **React 18** - UI library
- **TypeScript** - Type-safe development
- **TailwindCSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Vite** - Fast build tool

### Backend Stack
- **Node.js** - Runtime
- **Express** - HTTP server framework
- **WebSocket** - Real-time bidirectional communication
- **TypeScript** - Type-safe backend

### Data Flow

```
Frontend (React)
    ↓ WebSocket
Backend (Node.js + Express)
    ↓
Simulation Engine (Cluster Manager)
    ↓
Election Service + Heartbeat Service
    ↓ WebSocket
Frontend (Real-time updates)
```

## Installation

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/smart-leader-election-simulator.git
cd smart-leader-election-simulator
```

2. Install server dependencies:
```bash
cd server
npm install
```

3. Install client dependencies:
```bash
cd ../client
npm install
```

## Running the Project

### Start the Backend Server

In one terminal:
```bash
cd server
npm run dev
```

The server will start on `http://localhost:3001` with WebSocket server on `ws://localhost:3001`.

### Start the Frontend Client

In another terminal:
```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173` (or next available port).

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

## Usage Guide

### Control Panel

| Control | Effect |
|---------|--------|
| **Start** | Initialize cluster and begin simulation |
| **Pause** | Pause the simulation |
| **Resume** | Resume paused simulation |
| **Reset** | Stop and reset simulation |
| **Add Node** | Add a new node to the cluster |
| **Remove Node** | Remove last node from cluster |
| **Crash Node** | Force a node failure |
| **Overload Node** | Degrade node performance |
| **Recover Node** | Restore degraded node |

### Cluster Visualization

- **Node Cards** - Display current node status with key metrics
- **Color Coding** - Green (Healthy), Yellow (Degraded), Red (Failed)
- **Leader Badge** - Highlighted on the current leader node
- **Real-time Updates** - Metrics update every 2 seconds

### Event Log

- **Timestamped Events** - All cluster events logged with timestamps
- **Color-coded Messages** - Different colors for different event types
- **Auto-scroll** - Automatically scrolls to latest events

### Node Details Panel

- **Detailed Metrics** - CPU, Memory, Uptime, Health Score
- **Progress Bars** - Visual representation of resource usage
- **Status Information** - Complete node state information

## Algorithm Details

### Health Score Calculation

```typescript
healthScore = (uptime * 0.40) - (cpu * 0.35) - (memory * 0.25)
```

**Weights:**
- **Uptime (40%)** - Most important factor for reliability
- **CPU (35%)** - Resource constraint indicator
- **Memory (25%)** - Secondary resource constraint

**Thresholds:**
- Health Score ≥ 20: Healthy
- Health Score < 20: Degraded
- Not responding or failed: Failed

### Election Algorithm

1. **Trigger Event**
   - No leader present
   - Leader crashed (not responding)
   - Leader degraded (health < threshold)
   - Heartbeat timeout (> 3000ms)

2. **Election Process**
   - Broadcast ELECTION message with node ID and current health score
   - Collect RESPONSE messages from all alive nodes
   - Select node with highest health score as new leader
   - Broadcast COORDINATOR message to all nodes

3. **Recovery**
   - New leader sends periodic heartbeats (every 2 seconds)
   - Nodes update health metrics based on resource usage
   - Re-election triggered if leader becomes unhealthy

### Heartbeat Mechanism

- **Interval**: 2000ms (2 seconds)
- **Grace Period**: 3000ms (3 seconds)
- **Timeout**: Node considered failed after grace period without heartbeat
- **Health Check**: All nodes update status during heartbeat cycle

## Configuration

### Backend Configuration (server/src/simulation/types.ts)

```typescript
HEALTH_WEIGHTS = {
  UPTIME: 0.4,
  CPU: 0.35,
  MEMORY: 0.25,
}

HEALTH_THRESHOLD = 20
HEARTBEAT_INTERVAL = 2000
HEARTBEAT_GRACE_PERIOD = 3000
```

### Frontend Port Configuration (client/vite.config.ts)

```typescript
server: {
  port: 5173,
  strictPort: false,
}
```

### WebSocket Configuration

- **Backend**: `ws://localhost:3001`
- **Auto-reconnect**: Not implemented (for demo purposes)

## Project Structure

```
smart-leader-election-simulator/
├── client/                      # React frontend
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── ClusterView.tsx
│   │   │   ├── NodeCard.tsx
│   │   │   ├── ControlPanel.tsx
│   │   │   ├── LogPanel.tsx
│   │   │   └── NodeDetails.tsx
│   │   ├── context/             # React context
│   │   │   └── SimulationContext.tsx
│   │   ├── hooks/               # Custom hooks
│   │   │   └── useSimulation.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html               # HTML entry point
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                      # Node.js backend
│   ├── src/
│   │   ├── simulation/
│   │   │   ├── types.ts         # Type definitions
│   │   │   ├── Node.ts          # Node class
│   │   │   ├── ClusterManager.ts
│   │   │   ├── ElectionService.ts
│   │   │   └── HeartbeatService.ts
│   │   └── index.ts             # Express server
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                    # This file
```

## Implementation Details

### Node State Management (server/src/simulation/Node.ts)

- **Attributes**: CPU, Memory, Uptime, Health Score, Status
- **Methods**: calculateHealthScore(), updateStatus(), crash(), overload(), recover()
- **Status Transitions**: HEALTHY → DEGRADED → FAILED

### Cluster Management (server/src/simulation/ClusterManager.ts)

- **Operations**: Add/Remove nodes, Set leader, Update nodes
- **Leader Tracking**: Single leader per cluster
- **State Queries**: Get all nodes, get leader, get alive nodes

### Election Service (server/src/simulation/ElectionService.ts)

- **Algorithm**: Highest health score wins
- **Sorting**: Nodes sorted by health score (descending)
- **Selection**: First node after sorting becomes leader

### Heartbeat Service (server/src/simulation/HeartbeatService.ts)

- **Monitoring**: Continuous leader health check
- **Triggers**: Checks leader status every 2 seconds
- **Re-election**: Automatic re-election on leader failure

### WebSocket Communication (server/src/index.ts)

- **Commands**: START, PAUSE, RESUME, RESET, ADDNODE, REMOVENODE, CRASHNODE, OVERLOADNODE, RECOVERNODE
- **Messages**: JSON-encoded ClusterUpdate objects
- **Updates**: Broadcast to all connected clients

## Performance Considerations

- **Update Frequency**: 2-second heartbeat interval (configurable)
- **Log Retention**: Last 100 events kept in memory
- **Client Limit**: No hard limit (scales with WebSocket capacity)
- **Message Size**: ~1KB per update

## Limitations & Future Work

### Current Limitations
- No persistent storage (in-memory only)
- No authentication/authorization
- Single server instance (no clustering)
- No automatic client reconnection

### Potential Enhancements
- [ ] Persistent event logging to database
- [ ] Advanced failure scenarios (network partition, Byzantine failures)
- [ ] Multi-leader consensus algorithms
- [ ] Load balancing based on health scores
- [ ] Historical metrics and trend analysis
- [ ] Export simulation results
- [ ] Configurable algorithm parameters from UI
- [ ] Multiple election algorithms (Bully, Ring, Raft)

## Testing

### Manual Testing Scenarios

1. **Basic Election**
   - Start simulation → observe initial election
   - One leader selected with highest score

2. **Leader Failure**
   - Start simulation → Crash leader → observe re-election
   - New leader elected within heartbeat grace period

3. **Node Degradation**
   - Start simulation → Overload leader → observe re-election
   - New leader elected when old leader health < threshold

4. **Cascading Failures**
   - Start simulation → Crash multiple nodes → observe cluster stability
   - System continues with remaining healthy nodes

## Contributing

This is an academic project. Modifications and extensions are welcome for educational purposes.

## Author

**Nidhi Tupe**  
NMIMS Sem 6 - Distributed Computing  
Academic Project

## License

Academic Project - NMIMS University

## References

- Bully Algorithm (Garcia-Molina, 1982)
- Ring Algorithm (Chang & Roberts, 1979)
- Raft Consensus Algorithm (Ongaro & Ousterhout, 2014)
- Distributed Systems: Principles and Paradigms (Tanenbaum & Van Steen)

## Acknowledgments

- Guided by distributed systems principles and consensus algorithms
- Inspired by real-world cloud orchestration systems
- Built with modern web technologies for interactive visualization

---

**Last Updated**: 2024  
**Version**: 1.0.0

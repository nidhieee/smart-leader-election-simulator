# Environment setup instructions for smart-leader-election-simulator

## Quick Start

### 1. Install Server Dependencies
```bash
cd server
npm install
```

### 2. Install Client Dependencies
```bash
cd ../client
npm install
```

### 3. Run in Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd server
npm run dev
```

**Terminal 2 - Start Frontend Client:**
```bash
cd client
npm run dev
```

### 4. Open in Browser

Navigate to: `http://localhost:5173`

## Features

- **Real-time cluster visualization** - See nodes and health metrics
- **Interactive controls** - Start, pause, reset simulation
- **Failure injection** - Crash or overload nodes
- **Event logging** - Real-time event tracking
- **Node inspection** - Detailed metrics per node

## Commands

### Simulation Control
- **Start**: Initialize and run cluster with 5 nodes
- **Pause/Resume**: Control simulation flow
- **Reset**: Stop and clear simulation

### Node Operations
- **Add Node**: Add new node to cluster
- **Remove Node**: Remove node from cluster
- **Crash Node**: Simulate complete failure
- **Overload Node**: Simulate performance degradation
- **Recover Node**: Restore degraded node

## Algorithm

**Health Score** = (Uptime × 0.40) - (CPU × 0.35) - (Memory × 0.25)

- Leader elected with highest health score
- Re-election triggered when leader fails or degrades
- Heartbeat every 2 seconds to monitor health

## System Requirements

- Node.js v18+
- npm v9+
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Troubleshooting

**WebSocket Connection Error**
- Ensure server is running on port 3001
- Check browser console for errors

**Port Already in Use**
- Vite will auto-select next available port
- Server port can be changed in `server/src/index.ts`

**Missing Dependencies**
- Run `npm install` in both client and server directories
- Clear node_modules and try again if issues persist

---

**Project**: Smart Leader Election Simulator  
**Author**: Nidhi Tupe  
**Course**: NMIMS Sem 6 - Distributed Computing

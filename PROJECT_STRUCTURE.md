# Project Structure

```
smart-leader-election-simulator/
│
├── README.md                          # Comprehensive project documentation
├── SETUP.md                          # Quick setup guide
│
├── client/                           # React TypeScript Frontend
│   ├── public/                       # Static assets
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClusterView.tsx       # Main cluster visualization
│   │   │   ├── NodeCard.tsx          # Individual node card component
│   │   │   ├── ControlPanel.tsx      # Simulation control buttons
│   │   │   ├── LogPanel.tsx          # Real-time event log
│   │   │   └── NodeDetails.tsx       # Node inspection panel
│   │   ├── context/
│   │   │   └── SimulationContext.tsx # Global simulation state
│   │   ├── hooks/
│   │   │   └── useSimulation.ts      # Custom hook for simulation context
│   │   ├── types/
│   │   │   └── index.ts              # TypeScript type definitions
│   │   ├── App.tsx                   # Main app component
│   │   ├── main.tsx                  # React entry point
│   │   └── index.css                 # Global styles + Tailwind
│   ├── index.html                    # HTML entry point
│   ├── package.json                  # Client dependencies
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── vite.config.ts                # Vite build configuration
│   ├── tailwind.config.js            # Tailwind CSS configuration
│   ├── postcss.config.js             # PostCSS configuration
│   └── tsconfig.node.json            # TypeScript config for tools
│
├── server/                           # Node.js Express Backend
│   ├── src/
│   │   ├── simulation/
│   │   │   ├── types.ts              # Enum and interface definitions
│   │   │   ├── Node.ts               # Node class with health calculation
│   │   │   ├── ClusterManager.ts     # Cluster state management
│   │   │   ├── ElectionService.ts    # Leader election algorithm
│   │   │   └── HeartbeatService.ts   # Heartbeat monitoring service
│   │   └── index.ts                  # Express server + WebSocket
│   ├── package.json                  # Server dependencies
│   └── tsconfig.json                 # TypeScript configuration
│
└── [dist/]                          # Build output (generated)
    ├── client/dist/                 # Frontend build
    └── server/dist/                 # Backend build
```

## File Descriptions

### Frontend Files

- **components/**: Reusable React components
  - ClusterView: Grid of all nodes
  - NodeCard: Individual node visualization
  - ControlPanel: Simulation controls
  - LogPanel: Event log display
  - NodeDetails: Detailed node inspection

- **context/SimulationContext.tsx**: 
  - Global state management
  - WebSocket connection handling
  - Command dispatcher

- **types/index.ts**: 
  - NodeStatus enum
  - NodeState interface
  - ClusterUpdate interface

- **App.tsx**: Main application component with layout

- **main.tsx**: React DOM render entry point

### Backend Files

- **simulation/types.ts**: 
  - NodeStatus enum
  - Constants (weights, thresholds)
  - Message interfaces

- **simulation/Node.ts**: 
  - Node state: CPU, Memory, Uptime
  - Health score calculation
  - Status transitions

- **simulation/ClusterManager.ts**: 
  - Node management (add, remove, crash)
  - Leader tracking
  - State queries

- **simulation/ElectionService.ts**: 
  - Leader election algorithm
  - Health-based node ranking
  - Leader validation

- **simulation/HeartbeatService.ts**: 
  - Periodic health checks
  - Election triggering
  - Grace period handling

- **index.ts**: 
  - Express server setup
  - WebSocket server
  - Command handlers
  - Event broadcasting

## Data Flow

```
Frontend (User Action)
    ↓
Send command via WebSocket
    ↓
Backend (Command Handler)
    ↓
Update Simulation State
    ↓
Broadcast ClusterUpdate
    ↓
Frontend (Receive Update)
    ↓
Update React State
    ↓
Re-render Components
```

## Build Output

```
dist/
├── index.html              # Frontend served by Vite
├── assets/                 # Bundled JS, CSS, assets
└── server/                 # Optional: compiled backend
```

## Key Dependencies

### Frontend
- react@18: UI library
- framer-motion@10: Animations
- tailwindcss@3: Styling
- vite@5: Build tool

### Backend
- express@4: HTTP server
- ws@8: WebSocket server
- typescript@5: Type safety

---

Generated for: Smart Leader Election Simulator  
Author: Nidhi Tupe

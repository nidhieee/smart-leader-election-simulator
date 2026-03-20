export enum NodeStatus {
  HEALTHY = 'healthy',
  DEGRADED = 'degraded',
  FAILED = 'failed',
}

export interface NodeState {
  id: string;
  status: NodeStatus;
  healthScore: number;
  uptime: number;
  cpu: number;
  memory: number;
  isLeader: boolean;
  lastHeartbeat: number;
}

export interface ElectionMessage {
  type: 'ELECTION' | 'RESPONSE' | 'COORDINATOR' | 'HEARTBEAT';
  nodeId: string;
  score?: number;
  timestamp: number;
}

export interface ClusterUpdate {
  nodes: NodeState[];
  leader: string | null;
  election: boolean;
  log: string;
}

export const HEALTH_WEIGHTS = {
  UPTIME: 0.4,
  CPU: 0.35,
  MEMORY: 0.25,
};

export const HEALTH_THRESHOLD = 20;
export const HEARTBEAT_INTERVAL = 2000;
export const HEARTBEAT_GRACE_PERIOD = 3000;

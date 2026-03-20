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

export interface ClusterUpdate {
  nodes: NodeState[];
  leader: string | null;
  election: boolean;
  log: string;
}

export interface AnimationEvent {
  type: 'HEARTBEAT' | 'ELECTION' | 'RESPONSE' | 'COORDINATOR';
  nodeId: string;
  fromNode?: string;
  toNode?: string;
  timestamp: number;
  positions?: { from: { x: number; y: number }; to: { x: number; y: number } };
}

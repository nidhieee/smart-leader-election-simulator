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

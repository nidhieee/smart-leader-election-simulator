import { ClusterManager } from './ClusterManager';
import { ElectionService } from './ElectionService';
import { HEARTBEAT_INTERVAL, HEARTBEAT_GRACE_PERIOD } from './types';

export type HeartbeatEventCallback = (event: {
  type: 'heartbeat' | 'election' | 'election_result';
  leaderId?: string;
  reason?: string;
  timestamp: number;
}) => void;

export class HeartbeatService {
  protected clusterManager: ClusterManager;
  protected electionService: ElectionService;
  protected intervalId: NodeJS.Timeout | null;
  protected onElection: (() => void) | null;
  protected onEvent: HeartbeatEventCallback | null;
  protected lastHeartbeatTime: number = 0;

  constructor(
    clusterManager: ClusterManager,
    electionService: ElectionService
  ) {
    this.clusterManager = clusterManager;
    this.electionService = electionService;
    this.intervalId = null;
    this.onElection = null;
    this.onEvent = null;
  }

  setElectionCallback(callback: () => void): void {
    this.onElection = callback;
  }

  setEventCallback(callback: HeartbeatEventCallback): void {
    this.onEvent = callback;
  }

  startLoop(): void {
    if (this.intervalId) {
      return;
    }

    this.intervalId = setInterval(() => {
      this.checkLeader();
    }, HEARTBEAT_INTERVAL);
  }

  stopLoop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  checkLeader(): void {
    const now = Date.now();
    const leaderId = this.clusterManager.getLeader();

    // Send heartbeat signal (simulated)
    if (leaderId && this.onEvent) {
      this.onEvent({
        type: 'heartbeat',
        leaderId,
        timestamp: now,
      });
    }

    // Check if leader is still alive
    if (leaderId) {
      const leader = this.clusterManager.getNode(leaderId);

      if (
        !leader ||
        !leader.isAlive() ||
        now - leader.getState().lastHeartbeat > HEARTBEAT_GRACE_PERIOD ||
        leader.getHealthScore() < 20
      ) {
        const reason = !leader
          ? 'Leader not found'
          : !leader.isAlive()
            ? 'Leader is dead'
            : leader.getHealthScore() < 20
              ? 'Leader is degraded'
              : 'Heartbeat timeout';

        this.triggerElection(reason);
        return;
      }
    } else {
      this.triggerElection('No leader present');
      return;
    }

    // Regular health checks
    this.clusterManager.updateNodes();
  }

  triggerElection(reason: string): void {
    const newLeaderId = this.electionService.selectLeader();

    if (this.onEvent) {
      this.onEvent({
        type: 'election_result',
        leaderId: newLeaderId || undefined,
        reason,
        timestamp: Date.now(),
      });
    }

    if (this.onElection) {
      this.onElection();
    }
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }
}

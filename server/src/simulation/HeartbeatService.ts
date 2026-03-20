import { ClusterManager } from './ClusterManager';
import { ElectionService } from './ElectionService';
import { HEARTBEAT_INTERVAL, HEARTBEAT_GRACE_PERIOD } from './types';

export class HeartbeatService {
  protected clusterManager: ClusterManager;
  protected electionService: ElectionService;
  protected intervalId: NodeJS.Timeout | null;
  protected onElection: (() => void) | null;

  constructor(
    clusterManager: ClusterManager,
    electionService: ElectionService
  ) {
    this.clusterManager = clusterManager;
    this.electionService = electionService;
    this.intervalId = null;
    this.onElection = null;
  }

  setElectionCallback(callback: () => void): void {
    this.onElection = callback;
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

    // Check if leader is still alive
    if (leaderId) {
      const leader = this.clusterManager.getNode(leaderId);

      if (
        !leader ||
        !leader.isAlive() ||
        now - leader.getState().lastHeartbeat > HEARTBEAT_GRACE_PERIOD ||
        leader.getHealthScore() < 20
      ) {
        this.triggerElection('Leader failed or degraded');
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
    if (this.onElection) {
      this.onElection();
    }
  }

  isRunning(): boolean {
    return this.intervalId !== null;
  }
}

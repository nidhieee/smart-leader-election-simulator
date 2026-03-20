import { ClusterManager } from './ClusterManager';
import { Node } from './Node';

export class ElectionService {
  protected clusterManager: ClusterManager;

  constructor(clusterManager: ClusterManager) {
    this.clusterManager = clusterManager;
  }

  runElection(): string | null {
    const aliveNodes = this.clusterManager.getAliveNodes();

    if (aliveNodes.length === 0) {
      return null;
    }

    // Sort nodes by health score (highest first)
    aliveNodes.sort((a, b) => b.getHealthScore() - a.getHealthScore());

    const selectedLeader = aliveNodes[0];
    this.clusterManager.setLeader(selectedLeader.getId());

    return selectedLeader.getId();
  }

  broadcastElection(): void {
    const aliveNodes = this.clusterManager.getAliveNodes();
    // In a real system, this would broadcast election messages
    // For simulation, we just simulate the election process
  }

  selectLeader(): string | null {
    return this.runElection();
  }

  isLeaderHealthy(): boolean {
    const leaderId = this.clusterManager.getLeader();
    if (!leaderId) {
      return false;
    }

    const leader = this.clusterManager.getNode(leaderId);
    return leader ? leader.isAlive() && leader.getHealthScore() >= 20 : false;
  }

  shouldTriggerElection(): boolean {
    return !this.isLeaderHealthy();
  }
}

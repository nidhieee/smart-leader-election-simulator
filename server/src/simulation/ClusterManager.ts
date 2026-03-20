import { Node } from './Node';
import { NodeState, NodeStatus } from './types';

export class ClusterManager {
  protected nodes: Map<string, Node>;
  protected leaderId: string | null;

  constructor() {
    this.nodes = new Map();
    this.leaderId = null;
  }

  addNode(nodeId: string): Node {
    if (!this.nodes.has(nodeId)) {
      const node = new Node(nodeId);
      this.nodes.set(nodeId, node);
      return node;
    }
    return this.nodes.get(nodeId)!;
  }

  removeNode(nodeId: string): boolean {
    if (this.nodes.has(nodeId)) {
      if (this.leaderId === nodeId) {
        this.leaderId = null;
      }
      this.nodes.delete(nodeId);
      return true;
    }
    return false;
  }

  getNode(nodeId: string): Node | undefined {
    return this.nodes.get(nodeId);
  }

  getLeader(): string | null {
    return this.leaderId;
  }

  setLeader(nodeId: string): void {
    if (this.nodes.has(nodeId)) {
      // Remove leader status from previous leader
      if (this.leaderId) {
        const oldLeader = this.nodes.get(this.leaderId);
        if (oldLeader) {
          oldLeader.setLeader(false);
        }
      }

      // Set new leader
      const newLeader = this.nodes.get(nodeId);
      if (newLeader) {
        newLeader.setLeader(true);
        this.leaderId = nodeId;
      }
    }
  }

  updateNodes(): void {
    this.nodes.forEach((node) => {
      node.updateStatus();
    });
  }

  getAllNodes(): Node[] {
    return Array.from(this.nodes.values());
  }

  getNodeStates(): NodeState[] {
    return this.getAllNodes().map((node) => node.getState());
  }

  getAliveNodes(): Node[] {
    return this.getAllNodes().filter((node) => node.isAlive());
  }

  getNodeCount(): number {
    return this.nodes.size;
  }

  crashNode(nodeId: string): boolean {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.crash();
      if (this.leaderId === nodeId) {
        this.leaderId = null;
      }
      return true;
    }
    return false;
  }

  overloadNode(nodeId: string): boolean {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.overload();
      return true;
    }
    return false;
  }

  recoverNode(nodeId: string): boolean {
    const node = this.nodes.get(nodeId);
    if (node) {
      node.recover();
      return true;
    }
    return false;
  }

  clear(): void {
    this.nodes.clear();
    this.leaderId = null;
  }
}

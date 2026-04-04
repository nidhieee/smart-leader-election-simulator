import { NodeStatus, NodeState, HEALTH_WEIGHTS, HEALTH_THRESHOLD } from './types';

export class Node {
  protected id: string;
  protected status: NodeStatus;
  protected healthScore: number;
  protected uptime: number;
  protected cpu: number;
  protected memory: number;
  protected isLeader: boolean;
  protected lastHeartbeat: number;
  protected isCrashed: boolean;
  protected autoDegrade: boolean;  // ← NEW: Control automatic degradation

  constructor(id: string) {
    this.id = id;
    this.status = NodeStatus.HEALTHY;
    this.healthScore = 100;
    this.uptime = 100;
    this.cpu = Math.random() * 30;
    this.memory = Math.random() * 40;
    this.isLeader = false;
    this.lastHeartbeat = Date.now();
    this.isCrashed = false;
    this.autoDegrade = false;  // ← NEW: Disabled by default
  }

  calculateHealthScore(): number {
    if (this.isCrashed) return -100;
    
    const score =
      this.uptime * HEALTH_WEIGHTS.UPTIME -
      this.cpu * HEALTH_WEIGHTS.CPU -
      this.memory * HEALTH_WEIGHTS.MEMORY;

    this.healthScore = Math.max(-100, Math.min(100, score));
    
    // Update status based on health score
    if (this.healthScore < HEALTH_THRESHOLD) {
      this.status = NodeStatus.DEGRADED;
    } else {
      this.status = NodeStatus.HEALTHY;
    }

    return this.healthScore;
  }

  updateStatus(): void {
    if (this.isCrashed) {
      this.status = NodeStatus.FAILED;
      this.healthScore = -100;
      return;
    }

    // Only apply automatic degradation if enabled
    if (this.autoDegrade) {
      // Simulate uptime degradation (only if auto-degrade is ON)
      this.uptime = Math.max(0, this.uptime - Math.random() * 2);

      // Simulate CPU and memory fluctuations
      this.cpu = Math.max(0, Math.min(100, this.cpu + (Math.random() - 0.5) * 10));
      this.memory = Math.max(0, Math.min(100, this.memory + (Math.random() - 0.5) * 8));
    }

    this.calculateHealthScore();
    this.lastHeartbeat = Date.now();
  }

  crash(): void {
    this.isCrashed = true;
    this.status = NodeStatus.FAILED;
    this.healthScore = -100;
    this.isLeader = false;
  }

  overload(): void {
    this.cpu = 85 + Math.random() * 15;
    this.memory = 80 + Math.random() * 20;
    this.calculateHealthScore();
  }

  recover(): void {
    this.isCrashed = false;
    this.uptime = 100;
    this.cpu = Math.random() * 30;
    this.memory = Math.random() * 40;
    this.calculateHealthScore();
  }

  setLeader(isLeader: boolean): void {
    this.isLeader = isLeader;
  }

  // NEW: Manual control methods
  setCPU(value: number): void {
    this.cpu = Math.max(0, Math.min(100, value));
    this.calculateHealthScore();
  }

  setMemory(value: number): void {
    this.memory = Math.max(0, Math.min(100, value));
    this.calculateHealthScore();
  }

  setUptime(value: number): void {
    this.uptime = Math.max(0, Math.min(100, value));
    this.calculateHealthScore();
  }

  setAutoDegrade(enabled: boolean): void {
    this.autoDegrade = enabled;
  }

  getAutoDegrade(): boolean {
    return this.autoDegrade;
  }

  getState(): NodeState {
    return {
      id: this.id,
      status: this.status,
      healthScore: this.healthScore,
      uptime: this.uptime,
      cpu: this.cpu,
      memory: this.memory,
      isLeader: this.isLeader,
      lastHeartbeat: this.lastHeartbeat,
      autoDegrade: this.autoDegrade,  // ← Include in state
    };
  }

  getId(): string {
    return this.id;
  }

  getHealthScore(): number {
    return this.healthScore;
  }

  isAlive(): boolean {
    return this.status !== NodeStatus.FAILED && !this.isCrashed;
  }

  getStatus(): NodeStatus {
    return this.status;
  }
}

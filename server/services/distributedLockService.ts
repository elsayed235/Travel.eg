import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { db, Database } from '../db/database';
import { DistributedLockEntity } from '../db/schema';
import { lockRepository } from '../db/repositories/DistributedLockRepository';

export interface LockLease {
  lockKey: string;
  leaseId: string;
  owner: string;
  acquiredAt: number;
  expiresAt: number;
  fencingToken: number;
  version: number;
}

export class DistributedLockService {
  private static instance: DistributedLockService;
  private waitQueues: Map<string, Array<() => void>> = new Map();
  private defaultOwner: string;
  private locksDir: string;

  private constructor(customOwner?: string) {
    this.defaultOwner = customOwner || `proc-${process.pid}-${crypto.randomBytes(3).toString('hex')}`;
    this.locksDir = path.join(process.cwd(), 'data', 'locks');
    try {
      if (!fs.existsSync(this.locksDir)) {
        fs.mkdirSync(this.locksDir, { recursive: true });
      }
    } catch {}
    // Background garbage collection of expired leases every 5 seconds
    setInterval(() => this.cleanupExpiredLocks(), 5000).unref();
  }

  private getLockFilePath(lockKey: string): string {
    const safeName = crypto.createHash('sha256').update(lockKey).digest('hex');
    return path.join(this.locksDir, `${safeName}.lock`);
  }

  public static getInstance(owner?: string): DistributedLockService {
    if (!DistributedLockService.instance) {
      DistributedLockService.instance = new DistributedLockService(owner);
    }
    return DistributedLockService.instance;
  }

  /**
   * Factory method to create isolated service instances for multi-process or multi-client simulation.
   */
  public static createInstance(owner: string): DistributedLockService {
    return new DistributedLockService(owner);
  }

  /**
   * Non-blocking attempt to acquire a lock backed by kernel-level atomic lockfiles and persistence layer.
   */
  public tryAcquire(
    lockKey: string,
    ttlMs: number = 10000,
    owner: string = this.defaultOwner
  ): LockLease | null {
    const now = Date.now();
    const lockFilePath = this.getLockFilePath(lockKey);
    let fd: number | null = null;

    try {
      fd = fs.openSync(lockFilePath, 'wx');
    } catch (err: any) {
      if (err.code === 'EEXIST') {
        // Inspect if existing file is truly expired
        try {
          const content = fs.readFileSync(lockFilePath, 'utf-8');
          if (content && content.trim().length > 0) {
            const parsed = JSON.parse(content);
            if (parsed && typeof parsed.expiresAt === 'number' && parsed.expiresAt <= now) {
              try { fs.unlinkSync(lockFilePath); } catch {}
              try { fd = fs.openSync(lockFilePath, 'wx'); } catch {}
            }
          }
        } catch {
          // If parse fails (e.g. file is actively being written by winner), lock is busy, safely reject
          return null;
        }
      }
    }

    if (fd === null) {
      return null;
    }

    const leaseId = `LEASE-${crypto.randomBytes(8).toString('hex')}`;
    const fencingToken = db.nextFencingToken();
    const expiresAt = now + ttlMs;
    const existingIdx = db.locks.findIndex(l => l.lockKey === lockKey);
    const existing = existingIdx >= 0 ? db.locks[existingIdx] : null;
    const version = existing ? existing.version + 1 : 1;

    const leaseRecord: DistributedLockEntity = {
      id: lockKey,
      lockKey,
      leaseId,
      owner,
      acquiredAt: now,
      expiresAt,
      fencingToken,
      version
    };

    try {
      fs.writeFileSync(fd, JSON.stringify(leaseRecord), 'utf-8');
      fs.closeSync(fd);
    } catch {
      try { fs.closeSync(fd); } catch {}
    }

    // Mirror to database in-memory/disk state
    db.runInTransaction(() => {
      if (existingIdx >= 0) {
        db.locks[existingIdx] = leaseRecord;
      } else {
        db.locks.push(leaseRecord);
      }
      db.saveToDisk();
    });

    return { ...leaseRecord };
  }

  /**
   * Validates if a fencing token is still active and valid for the given lock key.
   * Protects against stale commits from preempted or expired workers.
   */
  public validateFencingToken(lockKey: string, fencingToken: number): boolean {
    const lockFilePath = this.getLockFilePath(lockKey);
    try {
      if (fs.existsSync(lockFilePath)) {
        const raw = fs.readFileSync(lockFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.fencingToken === fencingToken && parsed.expiresAt > Date.now()) {
          return true;
        }
      }
    } catch {}

    (db.getAdapter() as any).reloadFromDisk?.();
    const currentLock = db.locks.find(l => l.lockKey === lockKey);
    if (!currentLock) return false;
    return currentLock.fencingToken === fencingToken && currentLock.expiresAt > Date.now();
  }

  /**
   * Acquire lock with retry, exponential backoff and timeout queueing.
   */
  public async acquireWithTimeout(
    lockKey: string,
    ttlMs: number = 10000,
    timeoutMs: number = 5000,
    owner: string = this.defaultOwner
  ): Promise<LockLease> {
    const startTime = Date.now();
    let attempt = 0;

    while (Date.now() - startTime < timeoutMs) {
      const lease = this.tryAcquire(lockKey, ttlMs, owner);
      if (lease) {
        return lease;
      }

      attempt++;
      const backoff = Math.min(200, 20 + Math.pow(1.5, attempt) * 10);

      // Wait for release notification or backoff timer
      await new Promise<void>(resolve => {
        const timer = setTimeout(resolve, backoff);
        if (!this.waitQueues.has(lockKey)) {
          this.waitQueues.set(lockKey, []);
        }
        this.waitQueues.get(lockKey)!.push(() => {
          clearTimeout(timer);
          resolve();
        });
      });
    }

    throw new Error(`Timeout: Failed to acquire distributed lock '${lockKey}' within ${timeoutMs}ms.`);
  }

  /**
   * Release lock safely with leaseId validation.
   */
  public release(lease: LockLease): boolean {
    let released = false;

    const lockFilePath = this.getLockFilePath(lease.lockKey);
    try {
      if (fs.existsSync(lockFilePath)) {
        const raw = fs.readFileSync(lockFilePath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.leaseId === lease.leaseId) {
          fs.unlinkSync(lockFilePath);
        }
      }
    } catch {}

    db.runInTransaction(() => {
      const idx = db.locks.findIndex(l => l.lockKey === lease.lockKey);
      if (idx >= 0 && db.locks[idx].leaseId === lease.leaseId) {
        db.locks.splice(idx, 1);
        db.saveToDisk();
        released = true;
      }
    });

    if (released) {
      this.notifyWaiters(lease.lockKey);
    }
    return released;
  }

  /**
   * Renews an active lock lease, extending its TTL if the leaseId is valid and active.
   */
  public renew(lease: LockLease, extensionTtlMs: number = 10000): boolean {
    const now = Date.now();
    let renewed = false;

    db.runInTransaction(() => {
      const idx = db.locks.findIndex(l => l.lockKey === lease.lockKey);
      if (idx >= 0 && db.locks[idx].leaseId === lease.leaseId) {
        if (db.locks[idx].expiresAt > now) {
          db.locks[idx].expiresAt = now + extensionTtlMs;
          db.locks[idx].version += 1;
          lease.expiresAt = db.locks[idx].expiresAt;
          lease.version = db.locks[idx].version;
          db.saveToDisk();
          renewed = true;
        }
      }
    });

    return renewed;
  }

  /**
   * Execute critical section under distributed lock with fencing token support.
   */
  public async runWithLock<T>(
    lockKey: string,
    work: (lease: LockLease) => Promise<T> | T,
    ttlMs: number = 10000,
    timeoutMs: number = 5000,
    owner: string = this.defaultOwner
  ): Promise<T> {
    const lease = await this.acquireWithTimeout(lockKey, ttlMs, timeoutMs, owner);
    try {
      return await work(lease);
    } finally {
      this.release(lease);
    }
  }

  /**
   * Check if key is currently locked by an active lease.
   */
  public isLocked(lockKey: string): boolean {
    const now = Date.now();
    const lock = db.locks.find(l => l.lockKey === lockKey);
    if (!lock) return false;
    if (lock.expiresAt <= now) {
      this.cleanupKeyIfExpired(lockKey);
      return false;
    }
    return true;
  }

  /**
   * Get current lock entity if active.
   */
  public getLock(lockKey: string): DistributedLockEntity | null {
    const now = Date.now();
    const lock = db.locks.find(l => l.lockKey === lockKey);
    if (!lock || lock.expiresAt <= now) return null;
    return { ...lock };
  }

  private cleanupKeyIfExpired(lockKey: string) {
    const now = Date.now();
    let cleaned = false;

    db.runInTransaction(() => {
      const idx = db.locks.findIndex(l => l.lockKey === lockKey);
      if (idx >= 0 && db.locks[idx].expiresAt <= now) {
        db.locks.splice(idx, 1);
        db.saveToDisk();
        cleaned = true;
      }
    });

    if (cleaned) {
      this.notifyWaiters(lockKey);
    }
  }

  private cleanupExpiredLocks() {
    const now = Date.now();
    const expiredKeys: string[] = [];

    db.runInTransaction(() => {
      const remaining: DistributedLockEntity[] = [];
      for (const lock of db.locks) {
        if (lock.expiresAt <= now) {
          expiredKeys.push(lock.lockKey);
        } else {
          remaining.push(lock);
        }
      }
      if (expiredKeys.length > 0) {
        db.locks.length = 0;
        db.locks.push(...remaining);
        db.saveToDisk();
      }
    });

    for (const key of expiredKeys) {
      this.notifyWaiters(key);
    }
  }

  private notifyWaiters(lockKey: string) {
    const queue = this.waitQueues.get(lockKey);
    if (queue && queue.length > 0) {
      const next = queue.shift();
      if (next) next();
    }
  }
}

export const distributedLockService = DistributedLockService.getInstance();

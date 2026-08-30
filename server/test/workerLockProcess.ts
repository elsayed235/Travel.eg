import { distributedLockService } from '../services/distributedLockService';
import { db } from '../db/database';

const workerId = process.argv[2] || `worker-${process.pid}`;

process.on('message', async (msg: any) => {
  try {
    const { action, payload } = msg;

    if (action === 'TRY_ACQUIRE') {
      const { lockKey, ttlMs } = payload;
      const lease = distributedLockService.tryAcquire(lockKey, ttlMs, workerId);
      process.send?.({
        success: true,
        action,
        workerId,
        lease: lease ? { lockKey: lease.lockKey, leaseId: lease.leaseId, fencingToken: lease.fencingToken, expiresAt: lease.expiresAt } : null
      });
    } else if (action === 'ACQUIRE_WITH_TIMEOUT') {
      const { lockKey, ttlMs, timeoutMs } = payload;
      try {
        const lease = await distributedLockService.acquireWithTimeout(lockKey, ttlMs, timeoutMs, workerId);
        process.send?.({
          success: true,
          action,
          workerId,
          lease: { lockKey: lease.lockKey, leaseId: lease.leaseId, fencingToken: lease.fencingToken, expiresAt: lease.expiresAt }
        });
      } catch (err: any) {
        process.send?.({
          success: false,
          action,
          workerId,
          error: err.message
        });
      }
    } else if (action === 'RELEASE') {
      const { lease } = payload;
      const released = distributedLockService.release(lease);
      process.send?.({
        success: true,
        action,
        workerId,
        released
      });
    } else if (action === 'VALIDATE_FENCING') {
      const { lockKey, fencingToken } = payload;
      const valid = distributedLockService.validateFencingToken(lockKey, fencingToken);
      process.send?.({
        success: true,
        action,
        workerId,
        valid
      });
    } else {
      process.send?.({ success: false, error: `Unknown action ${action}` });
    }
  } catch (err: any) {
    process.send?.({ success: false, error: err.message });
  }
});

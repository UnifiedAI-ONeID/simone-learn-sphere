
interface RateLimitConfig {
  maxAttempts: number;
  windowMs: number;
  blockDurationMs: number;
  escalationFactor: number;
}

interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lastAttempt: number;
  blockUntil?: number;
  escalationLevel: number;
}

class EnhancedRateLimiter {
  private attempts = new Map<string, AttemptRecord>();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
    
    // Clean up old records periodically
    setInterval(() => this.cleanup(), 60000); // Every minute
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, record] of this.attempts) {
      // Remove records older than 24 hours
      if (now - record.lastAttempt > 24 * 60 * 60 * 1000) {
        this.attempts.delete(key);
      }
    }
  }

  recordAttempt(identifier: string, failed: boolean): boolean {
    const now = Date.now();
    const record = this.attempts.get(identifier) || {
      count: 0,
      firstAttempt: now,
      lastAttempt: now,
      escalationLevel: 0
    };

    // Check if currently blocked
    if (record.blockUntil && now < record.blockUntil) {
      return false; // Still blocked
    }

    // Reset window if enough time has passed
    if (now - record.firstAttempt > this.config.windowMs) {
      record.count = 0;
      record.firstAttempt = now;
      record.escalationLevel = Math.max(0, record.escalationLevel - 1);
    }

    if (failed) {
      record.count++;
      record.lastAttempt = now;

      // Check if limit exceeded
      if (record.count >= this.config.maxAttempts) {
        record.escalationLevel++;
        const blockDuration = this.config.blockDurationMs * Math.pow(this.config.escalationFactor, record.escalationLevel - 1);
        record.blockUntil = now + blockDuration;
        
        // Log security event for repeated failures
        this.logSecurityEvent(identifier, record);
      }
    } else {
      // Successful attempt - reduce escalation level
      record.escalationLevel = Math.max(0, record.escalationLevel - 0.5);
      if (record.escalationLevel === 0) {
        record.count = 0;
      }
    }

    this.attempts.set(identifier, record);
    return !record.blockUntil || now >= record.blockUntil;
  }

  isBlocked(identifier: string): boolean {
    const record = this.attempts.get(identifier);
    if (!record || !record.blockUntil) return false;
    
    const now = Date.now();
    if (now >= record.blockUntil) {
      // Block period has ended
      delete record.blockUntil;
      this.attempts.set(identifier, record);
      return false;
    }
    
    return true;
  }

  getBlockTimeRemaining(identifier: string): number {
    const record = this.attempts.get(identifier);
    if (!record || !record.blockUntil) return 0;
    
    return Math.max(0, record.blockUntil - Date.now());
  }

  getAttemptCount(identifier: string): number {
    const record = this.attempts.get(identifier);
    return record ? record.count : 0;
  }

  private logSecurityEvent(identifier: string, record: AttemptRecord) {
    // This would integrate with your security audit system
    console.warn('Rate limit exceeded', {
      identifier,
      attempts: record.count,
      escalationLevel: record.escalationLevel,
      blockDuration: record.blockUntil ? record.blockUntil - Date.now() : 0
    });
  }

  // Get statistics for monitoring
  getStats() {
    const stats = {
      totalIdentifiers: this.attempts.size,
      blockedCount: 0,
      highRiskCount: 0
    };

    for (const record of this.attempts.values()) {
      if (record.blockUntil && Date.now() < record.blockUntil) {
        stats.blockedCount++;
      }
      if (record.escalationLevel >= 2) {
        stats.highRiskCount++;
      }
    }

    return stats;
  }
}

// Enhanced rate limiters for different types of requests
export const authRateLimiter = new EnhancedRateLimiter({
  maxAttempts: 5,
  windowMs: 15 * 60 * 1000, // 15 minutes
  blockDurationMs: 15 * 60 * 1000, // 15 minutes initial block
  escalationFactor: 2 // Double block time with each escalation
});

export const apiRateLimiter = new EnhancedRateLimiter({
  maxAttempts: 100,
  windowMs: 60 * 1000, // 1 minute
  blockDurationMs: 60 * 1000, // 1 minute block
  escalationFactor: 1.5
});

export const impersonationRateLimiter = new EnhancedRateLimiter({
  maxAttempts: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  blockDurationMs: 60 * 60 * 1000, // 1 hour block
  escalationFactor: 3
});

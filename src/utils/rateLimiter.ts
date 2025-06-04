
interface RateLimitAttempt {
  count: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const ATTEMPT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5;
const BLOCK_DURATION = 30 * 60 * 1000; // 30 minutes

export class RateLimiter {
  private attempts: Map<string, RateLimitAttempt> = new Map();

  isBlocked(identifier: string): boolean {
    const attempt = this.attempts.get(identifier);
    if (!attempt) return false;

    const now = Date.now();
    
    // Clear old attempts
    if (now - attempt.lastAttempt > ATTEMPT_WINDOW) {
      this.attempts.delete(identifier);
      return false;
    }

    // Check if currently blocked
    if (attempt.blockedUntil && now < attempt.blockedUntil) {
      return true;
    }

    // Clear block if expired
    if (attempt.blockedUntil && now >= attempt.blockedUntil) {
      this.attempts.delete(identifier);
      return false;
    }

    return false;
  }

  recordAttempt(identifier: string, failed: boolean): void {
    const now = Date.now();
    const attempt = this.attempts.get(identifier) || { count: 0, lastAttempt: 0 };

    // Reset if outside window
    if (now - attempt.lastAttempt > ATTEMPT_WINDOW) {
      attempt.count = 0;
    }

    if (failed) {
      attempt.count++;
      attempt.lastAttempt = now;

      // Block if too many attempts
      if (attempt.count >= MAX_ATTEMPTS) {
        attempt.blockedUntil = now + BLOCK_DURATION;
      }

      this.attempts.set(identifier, attempt);
    } else {
      // Success - clear attempts
      this.attempts.delete(identifier);
    }
  }

  getBlockTimeRemaining(identifier: string): number {
    const attempt = this.attempts.get(identifier);
    if (!attempt?.blockedUntil) return 0;

    const remaining = attempt.blockedUntil - Date.now();
    return Math.max(0, remaining);
  }
}

export const authRateLimiter = new RateLimiter();

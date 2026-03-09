// Utility to track attempt counts for different actions
// Implements the pattern: odd attempts fail, even attempts succeed

const isProductionBuild = () => {
  // Reason: webpack apps typically inline `process.env.NODE_ENV` at build time, but
  // we defensively guard to avoid crashing in unusual runtimes.
  try {
    const nodeEnv = typeof globalThis !== 'undefined'
      && globalThis.process
      && globalThis.process.env
      && globalThis.process.env.NODE_ENV;
    return nodeEnv === 'production';
  } catch {
    return false;
  }
};

class AttemptTracker {
  constructor() {
    // Store attempt counts in localStorage for persistence across sessions
    this.storageKey = 'ecommerce_attempt_counts';
    this.counts = this.loadCounts();
    
    // Global toggle for fail/success pattern
    this.failModeEnabled = this.loadFailMode();

    // Reason: fail mode intentionally triggers runtime errors for demo/debug flows.
    // It must never be enabled in production builds (including if a user has a stale
    // localStorage flag from prior development sessions).
    this._warnedProdFailMode = false;
    if (isProductionBuild() && this.failModeEnabled) {
      this.failModeEnabled = false;
      this.clearPersistedFailMode();
      // Minimal signal for production debugging; avoids noisy logs on every page load.
      console.warn('[AttemptTracker] Fail mode was persisted but is disabled in production.');
    }
  }

  // Load attempt counts from localStorage
  loadCounts() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      return saved ? JSON.parse(saved) : {};
    } catch {
      // Error loading attempt counts.
      return {};
    }
  }

  // Save attempt counts to localStorage
  saveCounts() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.counts));
    } catch {
      // Error saving attempt counts.
    }
  }

  // Get current attempt count for an action
  getAttemptCount(action) {
    return this.counts[action] || 0;
  }

  // Increment attempt count for an action
  incrementAttempt(action) {
    this.counts[action] = (this.counts[action] || 0) + 1;
    this.saveCounts();
    return this.counts[action];
  }

  // Load fail mode setting from localStorage
  loadFailMode() {
    try {
      const saved = localStorage.getItem('ecommerce_fail_mode');
      return saved ? JSON.parse(saved) : false; // Default to false (success mode)
    } catch {
      // Error loading fail mode setting.
      return false;
    }
  }

  // Save fail mode setting to localStorage
  saveFailMode() {
    try {
      localStorage.setItem('ecommerce_fail_mode', JSON.stringify(this.failModeEnabled));
    } catch {
      // Error saving fail mode setting.
    }
  }

  // Clear persisted fail mode setting (used to prevent production crashes)
  clearPersistedFailMode() {
    try {
      localStorage.removeItem('ecommerce_fail_mode');
    } catch {
      // Error clearing fail mode setting.
    }
  }

  // Toggle fail mode
  toggleFailMode() {
    if (isProductionBuild()) {
      // Reason: prevent enabling crash-simulation behavior in production.
      if (!this._warnedProdFailMode) {
        this._warnedProdFailMode = true;
        console.warn('[AttemptTracker] Ignoring fail mode toggle in production.');
      }
      return false;
    }
    this.failModeEnabled = !this.failModeEnabled;
    this.saveFailMode();
    return this.failModeEnabled;
  }

  // Explicitly set fail mode
  setFailMode(enabled) {
    if (isProductionBuild()) {
      // Reason: prevent enabling crash-simulation behavior in production.
      if (!this._warnedProdFailMode) {
        this._warnedProdFailMode = true;
        console.warn('[AttemptTracker] Ignoring fail mode change in production.');
      }
      return false;
    }
    this.failModeEnabled = Boolean(enabled);
    this.saveFailMode();
    return this.failModeEnabled;
  }

  // Get current fail mode status
  getFailMode() {
    // Reason: even if something toggles the in-memory flag, production must always be safe.
    if (isProductionBuild()) return false;
    return this.failModeEnabled;
  }

  // Check if current attempt should fail (odd attempts fail, even attempts succeed)
  shouldFail() {
    // New behavior:
    // - If fail mode is enabled → ALWAYS fail
    // - If fail mode is disabled → ALWAYS succeed
    if (this.failModeEnabled) {
      return true;
    }
    return false;
  }

  // Get attempt info for an action
  getAttemptInfo(action) {
    const count = this.getAttemptCount(action);
    const shouldFail = this.shouldFail(action);
    return {
      count,
      shouldFail,
      isOdd: count % 2 === 1,
      isEven: count % 2 === 0,
    };
  }

  // Reset attempt count for an action (useful for testing)
  resetAttempt(action) {
    delete this.counts[action];
    this.saveCounts();
  }

  // Reset all attempt counts
  resetAllAttempts() {
    this.counts = {};
    this.saveCounts();
  }

  // Get all attempt counts (for debugging)
  getAllCounts() {
    return { ...this.counts };
  }
}

// Create singleton instance
const attemptTracker = new AttemptTracker();

export default attemptTracker;

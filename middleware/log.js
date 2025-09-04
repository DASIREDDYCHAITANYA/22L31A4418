/**
 * A simple, in-memory logging utility for Node.js applications.
 *
 * This logger provides structured logging levels (INFO, ERROR, WARN, DEBUG)
 * and stores log entries in memory up to a defined limit to prevent
 * memory overflow. It's designed to be used as a singleton throughout
 * the application.
 */
class Logger {
  #maxLogs = 1000;
  #logs = [];
  #listeners = [];

  /**
   * Internal method to add a log entry.
   * @param {string} level - The log level (e.g., 'INFO').
   * @param {string} message - The message to log.
   * @param {object} [data={}] - Additional data.
   */
  #log(level, message, data = {}) {
    const entry = {
      timestamp: new Date().toISOString(),
      id: this.#generateId(),
      level,
      message,
      data,
    };

    this.#logs.unshift(entry);

    if (this.#logs.length > this.#maxLogs) {
      this.#logs.pop();
    }

    this.#emit(entry);
  }

  /**
   * Internal method to generate a unique log ID.
   * @returns {string} A unique ID.
   */
  #generateId() {
    return `log_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Internal method to notify all registered listeners.
   * @param {object} entry - The log entry to emit.
   */
  #emit(entry) {
    this.#listeners.forEach(listener => {
      try {
        listener(entry);
      } catch (err) {
        // Fail gracefully if a listener crashes
      }
    });
  }

  // Public logging methods
  info(message, data) { this.#log('INFO', message, data); }
  error(message, data) { this.#log('ERROR', message, data); }
  warn(message, data) { this.#log('WARN', message, data); }
  debug(message, data) { this.#log('DEBUG', message, data); }

  // Public management methods
  getLogs() { return [...this.#logs]; }
  getLogsByLevel(level) { return this.#logs.filter(log => log.level === level.toUpperCase()); }
  clear() {
    this.#logs = [];
    this.#emit({ type: 'CLEAR' });
  }

  addListener(callback) { this.#listeners.push(callback); }
  removeListener(callback) {
    this.#listeners = this.#listeners.filter(listener => listener !== callback);
  }

  exportLogs() { return JSON.stringify(this.#logs, null, 2); }
  importLogs(jsonLogs) {
    try {
      const imported = JSON.parse(jsonLogs);
      if (Array.isArray(imported)) {
        this.#logs = imported;
        this.#emit({ type: 'IMPORT', count: imported.length });
      }
    } catch (err) {
      this.error('Failed to import logs', { error: err.message });
    }
  }
}

// Singleton instance
const logger = new Logger();

export default logger;

export { Logger };
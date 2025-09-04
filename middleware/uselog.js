/**
 * React Hook for Logging Middleware Integration
 * Provides easy access to logging functionality within React components
 */

import { useEffect, useState, useCallback, useMemo } from 'react';
import logger from './logger.js';

/**
 * Custom hook for logging functionality
 * @returns {object} Logger utilities, log state, and metadata
 */
export const useLogger = () => {
  const [logs, setLogs] = useState(() => logger.getLogs());

  useEffect(() => {
    const handleLogUpdate = () => {
      setLogs(logger.getLogs());
    };

    // Subscribe to logger updates
    logger.addListener(handleLogUpdate);

    // Cleanup on unmount
    return () => {
      logger.removeListener(handleLogUpdate);
    };
  }, []);

  /** === Log Actions === */
  const logInfo = useCallback((message, data) => logger.info(message, data), []);
  const logError = useCallback((message, data) => logger.error(message, data), []);
  const logWarn = useCallback((message, data) => logger.warn(message, data), []);
  const logDebug = useCallback((message, data) => logger.debug(message, data), []);

  /** === Log Management === */
  const clearLogs = useCallback(() => logger.clearLogs(), []);
  const exportLogs = useCallback(() => logger.exportLogs(), []);
  const getLogsByLevel = useCallback((level) => logger.getLogsByLevel(level), []);

  /** === Derived State === */
  const { hasErrors, hasWarnings, logCount, errorCount, warningCount } = useMemo(() => {
    const errorLogs = logs.filter((log) => log.level === 'ERROR');
    const warnLogs = logs.filter((log) => log.level === 'WARN');

    return {
      hasErrors: errorLogs.length > 0,
      hasWarnings: warnLogs.length > 0,
      logCount: logs.length,
      errorCount: errorLogs.length,
      warningCount: warnLogs.length,
    };
  }, [logs]);

  return {
    // Log functions
    logInfo,
    logError,
    logWarn,
    logDebug,

    // Log management
    clearLogs,
    exportLogs,
    getLogsByLevel,

    // Log state
    logs,

    // Metadata
    hasErrors,
    hasWarnings,
    logCount,
    errorCount,
    warningCount,
  };
};

export default useLogger;

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  module: string;
  message: string;
  data?: any;
  error?: Error;
}

class CustomError extends Error {
  code: string;
  timestamp: string;
  module: string;

  constructor(message: string, code: string, module: string) {
    super(message);
    this.name = 'CustomError';
    this.code = code;
    this.timestamp = new Date().toISOString();
    this.module = module;
  }
}

class Logger {
  private static instance: Logger;
  private minLevel: LogLevel = 'INFO';
  private callbacks: ((entry: LogEntry) => void)[] = [];

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  setMinLevel(level: LogLevel) {
    this.minLevel = level;
  }

  addCallback(callback: (entry: LogEntry) => void) {
    this.callbacks.push(callback);
  }

  private shouldLog(level: LogLevel): boolean {
    const levels: LogLevel[] = ['DEBUG', 'INFO', 'WARN', 'ERROR'];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private createEntry(level: LogLevel, module: string, message: string, data?: any, error?: Error): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      module,
      message,
      data,
      error
    };
  }

  private log(entry: LogEntry) {
    if (!this.shouldLog(entry.level)) return;

    const prefix = `[${entry.timestamp}] [${entry.level}] [${entry.module}]`;
    
    switch (entry.level) {
      case 'ERROR':
        console.error(prefix, entry.message, entry.data || '', entry.error || '');
        break;
      case 'WARN':
        console.warn(prefix, entry.message, entry.data || '');
        break;
      case 'DEBUG':
        console.debug(prefix, entry.message, entry.data || '');
        break;
      default:
        console.log(prefix, entry.message, entry.data || '');
    }

    this.callbacks.forEach(callback => callback(entry));
  }

  debug(module: string, message: string, data?: any) {
    this.log(this.createEntry('DEBUG', module, message, data));
  }

  info(module: string, message: string, data?: any) {
    this.log(this.createEntry('INFO', module, message, data));
  }

  warn(module: string, message: string, data?: any) {
    this.log(this.createEntry('WARN', module, message, data));
  }

  error(module: string, message: string, error?: Error, data?: any) {
    this.log(this.createEntry('ERROR', module, message, data, error));
  }

  createError(message: string, code: string, module: string): CustomError {
    return new CustomError(message, code, module);
  }
}

export const logger = Logger.getInstance();
export { CustomError };
export type { LogLevel, LogEntry };
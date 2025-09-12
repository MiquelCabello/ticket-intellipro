/**
 * Structured logging utilities
 */

export interface LogEvent {
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  data?: Record<string, unknown>;
  timestamp: string;
  userId?: string;
  action?: string;
}

class Logger {
  private isDevelopment = import.meta.env.DEV;

  private createLogEvent(
    level: LogEvent['level'],
    message: string,
    data?: Record<string, unknown>
  ): LogEvent {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      userId: this.getCurrentUserId(),
    };
  }

  private getCurrentUserId(): string | undefined {
    // TODO: Get from auth context when implemented
    return undefined;
  }

  private output(event: LogEvent): void {
    if (this.isDevelopment) {
      console.log(`[${event.level.toUpperCase()}] ${event.message}`, event.data || '');
    }
    
    // In production, send to monitoring service
    // TODO: Implement actual logging service integration
  }

  info(message: string, data?: Record<string, unknown>): void {
    this.output(this.createLogEvent('info', message, data));
  }

  warn(message: string, data?: Record<string, unknown>): void {
    this.output(this.createLogEvent('warn', message, data));
  }

  error(message: string, data?: Record<string, unknown>): void {
    this.output(this.createLogEvent('error', message, data));
  }

  debug(message: string, data?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      this.output(this.createLogEvent('debug', message, data));
    }
  }

  // Track business events
  track(action: string, data?: Record<string, unknown>): void {
    const event = this.createLogEvent('info', `Action: ${action}`, data);
    event.action = action;
    this.output(event);
  }
}

export const logger = new Logger();
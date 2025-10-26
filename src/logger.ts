import { simpleFormatter } from "./formatters/simple";
import { ConsoleTransport } from "./transports/console";
import type { LoggerOptions, LogEntry, LogLevel, Transport, Formatter } from "./types";

const LEVELS: LogLevel[] = ["debug", "info", "warn", "error"];

export interface ILogger {
  debug(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
  error(...args: any[]): void;
  child(feature: string): ILogger;
}

export class Logger implements ILogger {
  private level: LogLevel;
  private formatter: Formatter;
  private transports: Transport[];
  private feature?: string;

  constructor(options: LoggerOptions = {}) {
    this.level = options.level ?? "info";
    this.formatter = options.formatter ?? simpleFormatter;
    this.transports = options.transports ?? [new ConsoleTransport({ colors: options.forceColors })];
    this.feature = options.feature;
  }

  private shouldLog(level: LogLevel) {
    return LEVELS.indexOf(level) >= LEVELS.indexOf(this.level);
  }

  private _log(level: LogLevel, args: any[]) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      args,
      feature: this.feature,
    };

    const formatted = this.formatter(entry);

    for (const t of this.transports) {
      try {
        t.log(formatted, entry);
      } catch (err) {
        // swallow transport errors
        console.error("Transport error", err);
      }
    }
  }

  debug(...args: any[]) {
    this._log("debug", args);
  }

  info(...args: any[]) {
    this._log("info", args);
  }

  warn(...args: any[]) {
    this._log("warn", args);
  }

  error(...args: any[]) {
    this._log("error", args);
  }

  child(feature: string): ILogger {
    return new Logger({
      level: this.level,
      formatter: this.formatter,
      transports: this.transports,
      feature: this.feature ? `${this.feature}:${feature}` : feature,
    });
  }
}

/**
 * Create a logger with options and an optional feature name.
 * @param featureOrOptions - Feature name string or full logger options
 * @param options - Additional logger options when first parameter is feature name
 * Usage:
 * const logger = createLogger('Auth');
 * const logger = createLogger({ level: 'debug', feature: 'Auth' });
 * const logger = createLogger('Auth', { level: 'debug' });
 */
export default function createLogger(
  featureOrOptions?: string | LoggerOptions,
  options: LoggerOptions = {}
): ILogger {
  if (typeof featureOrOptions === "string") {
    return new Logger({ ...options, feature: featureOrOptions });
  }
  return new Logger(featureOrOptions ?? options);
}

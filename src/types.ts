export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  args: any[];
  feature?: string;
}

export type FormatterResult = string | any[];

export type Formatter = (entry: LogEntry) => FormatterResult;

export interface Transport {
  log: (formatted: FormatterResult, entry: LogEntry) => void;
}

export interface LoggerOptions {
  level?: LogLevel;
  formatter?: Formatter;
  transports?: Transport[];
  feature?: string;
  /**
   * When true, console transport will force ANSI color output even if auto-detection
   * suggests no color. Use this when your terminal supports colors but detection fails.
   */
  forceColors?: boolean;
}

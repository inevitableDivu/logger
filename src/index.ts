// Core exports
export { Logger } from "./logger";
export type { ILogger } from "./logger";
export { default as createLogger } from "./logger";
export { default } from "./logger";

// Transports
export { ConsoleTransport } from "./transports/console";
export { FileTransport } from "./transports/file";

// Formatters
export { simpleFormatter } from "./formatters/simple";
export { jsonFormatter } from "./formatters/json";

// Types
export type {
  LogLevel,
  LogEntry,
  LoggerOptions,
  Formatter,
  FormatterResult,
  Transport,
} from "./types";

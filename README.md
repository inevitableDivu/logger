# Highly-configurable Logger (TypeScript)

This repository contains a small, highly-configurable logger scaffold written in TypeScript.

Features:

- Pluggable transports (console, file)
- Pluggable formatters (simple text, JSON)
- Log levels and convenience methods

Quick start

1. Install dev dependencies:

```bash
npm install
```

2. Build:

```bash
npm run build
```

3. Run tests:

```bash
npm test
```

# logger — highly-configurable TypeScript logger

A small, flexible logger that supports multiple transports, pluggable formatters, feature-scoped child loggers, and optional colored console output. It ships with a console transport and a file transport and includes two example formatters (simple and JSON).

This README documents the public API, configuration options, and examples that cover common usage patterns (default logs, debug mode, file logging, custom formatters and errors).

## Table of contents

- Quick start
- API
  - createLogger / default export
  - Logger class
  - LoggerOptions
  - Transports
  - Formatters
- Examples
  - Simple console logger (default)
  - Debug-level logger
  - File transport (pretty JSON)
  - Custom formatter
  - Child loggers (feature-scoped)
- Notes
  - Colors and terminals
  - Error serialization

---

## Quick start

If you're running the examples from this repo, use the local imports. In an installed package you would import from the package name.

Example (local):

```ts
import createLogger, { FileTransport, ConsoleTransport, simpleFormatter } from "../src";

// default logger (console transport)
const log = createLogger("App");
log.info("Server started", { port: 3000 }); // DATE_TIME INFO [App] Server started { port: 3000 }

const dbLog = log.child("Database");
dbLog.info("Connecting to database..."); // DATE_TIME INFO [App:Database] Connecting to database...
```

## API

### createLogger (default export)

- Signature: `createLogger(featureOrOptions?: string | LoggerOptions, options?: LoggerOptions): ILogger`
- Backwards compatible helpers:
  - `createLogger('Feature')` — returns a logger bound to `Feature` (default console transport).
  - `createLogger({ level: 'debug', feature: 'Feature', transports: [...] })` — full options object.
  - `createLogger('Feature', { level: 'debug' })` — feature + options.

### Logger class

- `new Logger(options?: LoggerOptions)` — construct directly when you need advanced control.
- Methods:
  - `debug(...args: any[])`
  - `info(...args: any[])`
  - `warn(...args: any[])`
  - `error(...args: any[])`
  - `child(feature: string): ILogger` — returns a child logger with feature name prefixed (e.g. `Auth:Service`).

### LoggerOptions (important fields)

- `level?: 'debug' | 'info' | 'warn' | 'error'` — default is `info`. Messages below the configured level are filtered out.
- `formatter?: Formatter` — function that receives a `LogEntry` and returns either a string or an array (FormatterResult). Default is `simpleFormatter`.
- `transports?: Transport[]` — if omitted a `ConsoleTransport` is used by default.
- `feature?: string` — default feature for the logger instance.
- `forceColors?: boolean` — when true, forces ANSI colors for the default `ConsoleTransport` even if auto-detection suggests otherwise.

### Transports (provided)

- `ConsoleTransport` — writes to the console and applies optional colors (timestamp, level, feature). Constructor accepts `{ colors?: boolean }` to explicitly enable/disable colors.
- `FileTransport(filepath: string)` — appends logs to the provided file. Objects and Errors are pretty-printed (2-space JSON) for readability.

### Formatters (provided)

- `simpleFormatter` — default. Produces an array shape: `[ timestamp, LEVEL, [feature], ...args ]`. This shape is intentionally structured so transports (console/file) can decide how to render each part (colorize level, pretty-print objects, etc.).
- `jsonFormatter` — returns a compact JSON string containing the full `LogEntry`.

### Types

- `LogEntry` shape: `{ timestamp: string; level: LogLevel; args: any[]; feature?: string }`.
- `Formatter` returns `FormatterResult` which is `string | any[]`.

## Examples

### 1) Simple console logger (default)

```ts
import createLogger from "../src";

const logger = createLogger("Happi");
logger.info("Logger initialized with default settings", { user: "admin" });
```

### 2) Enable debug level (show debug messages)

```ts
import createLogger from "../src";

// Option 1: feature + options
const logger = createLogger("Happi", { level: "debug" });

// Option 2: options object
const logger2 = createLogger({ feature: "Happi", level: "debug" });

logger.debug("This is a debug message", { debugInfo: "some debug data" });
```

### 3) Write to a file (pretty-print objects)

```ts
import createLogger, { FileTransport } from "../src";

const logger = createLogger({
  feature: "App",
  transports: [new FileTransport("logs/app.log")],
});

logger.info("User created", { id: 123, name: "Alice" });
logger.error("Failed to save", new Error("disk full"));
```

FileTransport serializes Errors and objects using 2-space JSON so the log file is easy to read.

### 4) Force colors (useful when auto-detection fails)

```ts
import createLogger, { ConsoleTransport, Logger } from "../src";

// When creating a Logger directly
const logger = new Logger({ feature: "App", transports: [new ConsoleTransport({ colors: true })] });

// Or via createLogger options
const logger2 = createLogger({ feature: "App", forceColors: true });
```

### 5) Custom formatter

```ts
import createLogger from "../src";

const myFormatter = (entry) => {
  // Return a single string (transports will receive the string)
  return `${entry.timestamp} [${entry.level}] ${entry.feature || ""} - ${entry.args
    .map((a) => String(a))
    .join(" | ")}`;
};

const logger = createLogger({ feature: "Custom", formatter: myFormatter });
logger.info("Formatted message", { a: 1 });
```

## Notes

- Colors: the `ConsoleTransport` uses ANSI escape codes to color the timestamp, level, and feature label. Not all consoles or environments render ANSI (for example some editor output panels or CI log collectors may strip colors). Use `forceColors: true` or `ConsoleTransport({ colors: true })` to force colors when your terminal supports them.
- Debug messages: the default level is `info`. Call `createLogger(..., { level: 'debug' })` or `new Logger({ level: 'debug' })` to see debug logs.
- Error serialization: `FileTransport` serializes `Error` objects into JSON including `message`, `name`, `stack`, and any custom properties.

## Exports

From `src/index.ts` the package exports:

- default: `createLogger`
- named: `Logger`, `ConsoleTransport`, `FileTransport`, `simpleFormatter`, `jsonFormatter`
- types: `LogLevel`, `LogEntry`, `LoggerOptions`, `Formatter`, `FormatterResult`, `Transport`, `ILogger`

## Troubleshooting

- If colors don't appear but `node -e "console.log('\x1b[31mRED\x1b[0m')"` shows colored output in your terminal, make sure you run your code in a real terminal (PowerShell, bash, CMD) and not in an editor Output/Debug panel which may strip ANSI codes.
- If you want automated detection for `LOG_LEVEL` or environment-based config, tell me and I can wire `process.env.LOG_LEVEL` into `createLogger` or the `Logger` constructor.

## License

MIT

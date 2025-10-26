import type { Transport, LogEntry, FormatterResult } from "../types";

const Colors = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  // Level colors
  debug: "\x1b[34m", // Blue
  info: "\x1b[32m", // Green
  warn: "\x1b[33m", // Yellow
  error: "\x1b[31m", // Red
  // Element colors
  time: "\x1b[38;5;239m", // Dark grey
  feature: "\x1b[38;5;105m", // Purple
} as const;

export class ConsoleTransport implements Transport {
  private useColors: boolean;

  constructor(options?: { colors?: boolean }) {
    // default to TTY detection but allow explicit override
    this.useColors = options?.colors ?? !!(process && process.stdout && process.stdout.isTTY);
  }

  private colorize(text: string, color: keyof typeof Colors): string {
    if (!this.useColors) return text;
    return `${Colors[color]}${text}${Colors.reset}`;
  }

  private formatValue(value: any): string {
    if (typeof value === "object" && value !== null) {
      if (value instanceof Error) {
        return `${value.message}\n${Colors.dim}${value.stack}${Colors.reset}`;
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  log(formatted: FormatterResult, entry: LogEntry): void {
    const args = Array.isArray(formatted) ? formatted : [formatted];

    // Expecting formatter to produce: [ timestamp, LEVEL, [feature], ...args ]
    const [timestamp, maybeLevel, maybeFeature, ...restArgs] = args;

    const levelStr = typeof maybeLevel === "string" ? maybeLevel : entry.level.toUpperCase();

    // Detect if the third element is a feature string like "[Feature]"
    let feature = "";
    let rest = restArgs;
    if (typeof maybeFeature === "string" && /^\[.*\]$/.test(maybeFeature)) {
      feature = maybeFeature;
    } else if (maybeFeature !== undefined) {
      // Not a feature, treat it as the first argument
      rest = [maybeFeature, ...restArgs];
    }

    const coloredTimestamp = this.colorize(String(timestamp ?? ""), "time");
    const coloredLevel = this.colorize(levelStr, entry.level);
    const coloredFeature = feature ? ` ${this.colorize(feature, "feature")}` : "";

    const formattedRest = rest.map((arg) => this.formatValue(arg));

    const output = [`${coloredTimestamp} ${coloredLevel}${coloredFeature}`, ...formattedRest];

    switch (entry.level) {
      case "debug":
        console.debug(...output);
        break;
      case "info":
        console.info(...output);
        break;
      case "warn":
        console.warn(...output);
        break;
      case "error":
        console.error(...output);
        break;
      default:
        console.log(...output);
    }
  }
}

export default ConsoleTransport;

import type { Formatter, LogEntry } from "../types";

export const simpleFormatter: Formatter = (entry: LogEntry) => {
  return [
    entry.timestamp,
    entry.level.toUpperCase(),
    entry.feature ? `[${entry.feature}]` : "",
    ...entry.args,
  ].filter(Boolean);
};

export default simpleFormatter;

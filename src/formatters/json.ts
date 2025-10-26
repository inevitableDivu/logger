import type { Formatter, LogEntry } from "../types";

export const jsonFormatter: Formatter = (entry: LogEntry) => {
  return JSON.stringify(entry);
};

export default jsonFormatter;

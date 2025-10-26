import fs from "fs";
import path from "path";
import type { Transport, LogEntry, FormatterResult } from "../types";

export class FileTransport implements Transport {
  private filepath: string;

  constructor(filepath: string) {
    this.filepath = filepath;
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  private serializeItem(item: any): string {
    if (item instanceof Error) {
      const errorObj = {
        type: "Error",
        stack: item.stack,
        ...item, // Captures custom properties, name, and message
      };
      return JSON.stringify(errorObj, null, 2);
    }
    if (typeof item === "object" && item !== null) {
      return JSON.stringify(item, null, 2);
    }
    return String(item);
  }

  log(formatted: FormatterResult, entry: LogEntry) {
    try {
      const line = Array.isArray(formatted)
        ? formatted.map((item) => this.serializeItem(item)).join(" ")
        : this.serializeItem(formatted);

      fs.appendFileSync(this.filepath, line + "\n", { encoding: "utf8" });
    } catch (err) {
      // Best-effort: don't crash the host process
      console.error("FileTransport write error:", err);
    }
  }
}

export default FileTransport;

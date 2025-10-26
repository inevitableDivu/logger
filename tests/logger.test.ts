import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { Logger } from "../src/logger";
import { FileTransport } from "../src/transports/file";
import { simpleFormatter } from "../src/formatters/simple";

const tmpDir = path.resolve(__dirname, "..", "tmp");
const logfile = path.join(tmpDir, "test.log");

beforeEach(() => {
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });
  if (fs.existsSync(logfile)) fs.unlinkSync(logfile);
});

afterEach(() => {
  if (fs.existsSync(logfile)) fs.unlinkSync(logfile);
});

describe("Logger (happy path)", () => {
  it("writes formatted message to file transport", () => {
    const logger = new Logger({
      level: "debug",
      formatter: simpleFormatter,
      transports: [new FileTransport(logfile)],
    });

    logger.info("test message", { a: 1 });

    const content = fs.readFileSync(logfile, "utf8");
    expect(content).toContain("test message");
    expect(content).toContain("[INFO]");
  });
});

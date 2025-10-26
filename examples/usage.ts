import createLogger, { ConsoleTransport, FileTransport } from "../src";

const logger = createLogger("My App", {
  transports: [new ConsoleTransport(), new FileTransport("logs/app.log")],
  level: "debug",
}); // Optionally pass a feature name as a string, e.g. createLogger("App")

logger.info("Logger initialized with default settings from usage.ts", { user: "admin" });
logger.warn("This is a warning message", { user: "admin" });
logger.debug("This is a debug message", { debugInfo: "some debug data", user: "admin" }); // not showing in console
logger.error("This is an error message", { user: "admin" });
logger.debug("This is a general log message", { meta: "data", user: "admin" });

const serviceLogger = logger.child("Service"); // Auth:Service
serviceLogger.debug("Service started");
serviceLogger.error("Service failed", new Error("oops"));

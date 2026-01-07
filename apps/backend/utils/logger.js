// Simple Logger utility
const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "../logs");

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logLevels = {
  ERROR: "ERROR",
  WARN: "WARN",
  INFO: "INFO",
  DEBUG: "DEBUG",
};

function formatTimestamp() {
  return new Date().toISOString();
}

function writeLog(level, message, data = null) {
  const logMessage = `[${formatTimestamp()}] [${level}] ${message}${
    data ? " " + JSON.stringify(data) : ""
  }`;

  // Console output
  const color = {
    ERROR: "\x1b[31m", // Red
    WARN: "\x1b[33m", // Yellow
    INFO: "\x1b[36m", // Cyan
    DEBUG: "\x1b[35m", // Magenta
  };
  const reset = "\x1b[0m";

  console.log(`${color[level]}${logMessage}${reset}`);

  // File output
  const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
  fs.appendFileSync(logFile, logMessage + "\n");
}

module.exports = {
  error: (message, data) => writeLog(logLevels.ERROR, message, data),
  warn: (message, data) => writeLog(logLevels.WARN, message, data),
  info: (message, data) => writeLog(logLevels.INFO, message, data),
  debug: (message, data) => writeLog(logLevels.DEBUG, message, data),
};

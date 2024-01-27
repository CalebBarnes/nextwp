function debugLog(message, level, overridePrefix) {
  const prefix = overridePrefix || "[@nextwp/core]";
  const prefixColor = "\x1b[32m";

  const messagePrefix = (() => {
    switch (level) {
      case "error":
        return "\x1b[31m"; // Red
      case "warn":
        return "\x1b[33m"; // Yellow
      case "info":
        return "\x1b[36m"; // Cyan
      default:
        return ""; // No color
    }
  })();

  const reset = "\x1b[0m"; // Resets the color

  const levelPrefix = (() => {
    switch (level) {
      case "error":
        return "\x1b[31m ⛔️"; // Red
      case "warn":
        return "\x1b[33m ⚠️"; // Yellow
      case "info":
        return " ℹ️"; // Cyan
      default:
        return ""; // No color
    }
  })();

  // eslint-disable-next-line no-console -- this is a utility for logging
  console[level](
    `${prefixColor}${prefix}${reset}${levelPrefix}${reset} ${messagePrefix}${
      typeof message === "object"
        ? `\n${JSON.stringify(message, null, 2)}`
        : message
    }${reset}`
  );
}

const debug = {
  log: (message, overridePrefix) => {
    debugLog(message, "log", overridePrefix);
  },
  error: (message, overridePrefix) => {
    debugLog(message, "error", overridePrefix);
  },
  warn: (message, overridePrefix) => {
    debugLog(message, "warn", overridePrefix);
  },
  info: (message, overridePrefix) => {
    debugLog(message, "info", overridePrefix);
  },
};

exports.debug = debug;

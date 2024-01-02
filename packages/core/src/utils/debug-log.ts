function debugLog(
  message: string,
  level: "error" | "log" | "warn" | "info" = "log",
  overridePrefix?: string
) {
  const prefix = overridePrefix || "[@nextwp/core]";
  const prefixColor = "\x1b[35m"; // Magenta

  const messageColor = (() => {
    switch (level) {
      case "error":
        return "\x1b[31m"; // Red
      case "warn":
        return "\x1b[33m"; // Yellow
      case "info":
        return "\x1b[34m"; // Blue
      default:
        return "\x1b[32m"; // Green
    }
  })();

  const reset = "\x1b[0m"; // Resets the color

  // eslint-disable-next-line no-console -- this is a utility for logging
  console[level](
    `${prefixColor}${prefix}${reset} ${messageColor}${message}${reset}`
  );
}

const debug = {
  log: (message: string, overridePrefix?: string) => {
    debugLog(message, "log", overridePrefix);
  },
  error: (message: string, overridePrefix?: string) => {
    debugLog(message, "error", overridePrefix);
  },
  warn: (message: string, overridePrefix?: string) => {
    debugLog(message, "warn", overridePrefix);
  },
  info: (message: string, overridePrefix?: string) => {
    debugLog(message, "info", overridePrefix);
  },
};

export { debug };

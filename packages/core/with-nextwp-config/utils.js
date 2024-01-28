const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",

  black: "\x1b[30m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function debugLog(message, level, overridePrefix) {
  const prefix = overridePrefix || "[@nextwp/core]";
  const prefixColor = "\x1b[32m";

  const messagePrefix = (() => {
    switch (level) {
      case "error":
        return colors.red;
      case "warn":
        return colors.yellow;
      case "info":
        return colors.cyan;
      default:
        return "";
    }
  })();

  const levelPrefix = (() => {
    switch (level) {
      case "error":
        return `${colors.red} ⛔️`;
      case "warn":
        return `${colors.yellow} ⚠️`;
      case "info":
        return " ℹ️";
      default:
        return "";
    }
  })();

  // eslint-disable-next-line no-console -- this is a utility for logging
  console[level](
    `${prefixColor}${prefix}${colors.reset}${levelPrefix}${
      colors.reset
    } ${messagePrefix}${
      typeof message === "object"
        ? `\n${JSON.stringify(message, null, 2)}`
        : message
    }${colors.reset}`
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

module.exports = {
  debounce,
  colors,
  debug,
};

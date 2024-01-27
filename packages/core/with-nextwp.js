const path = require("path");
const fs = require("fs");
const ts = require("typescript");
const debug = require("./debug-log").debug;

const LOCK_FILE = path.resolve(
  process.cwd(),
  ".next",
  "nextwp",
  ".nextwp.config.lock"
);
function createLockFile() {
  if (!isLocked()) {
    // console.log(`Creating lock file by Process ID: ${process.pid}`);
    try {
      fs.writeFileSync(LOCK_FILE, "lock", {
        recursive: true,
      }); // Create a lock file
      return true;
    } catch (error) {
      return false; // Fail to acquire lock
    }
  }
}

function removeLockFile() {
  // console.log(`Removing lock file by Process ID: ${process.pid}`);

  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE); // Delete the lock file
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      // Re-throw the error if it's not a "file not found" error
      throw error;
    }
    // If the error is ENOENT (file not found), it's safe to ignore it
    // as the file was already deleted by another process.
  }
}

// function removeLockFile() {

//   if (fs.existsSync(LOCK_FILE)) {
//     fs.unlinkSync(LOCK_FILE); // Delete the lock file
//   }
// }

function isLocked() {
  return fs.existsSync(LOCK_FILE); // Check if lock file exists
}

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

let lastModifiedTime = 0;
let lastConfigContent = "";

function hasConfigChanged() {
  const configPath = path.resolve(process.cwd(), "nextwp.config.ts");
  const stats = fs.statSync(configPath);

  const currentConfigContent = fs.readFileSync(
    path.resolve(process.cwd(), "nextwp.config.ts"),
    "utf8"
  );

  if (
    stats.mtimeMs !== lastModifiedTime ||
    lastConfigContent !== currentConfigContent
  ) {
    lastModifiedTime = stats.mtimeMs;
    lastConfigContent = currentConfigContent;
    return true;
  }
  return false;
}

let watcher = null;

function watchConfig() {
  const debouncedCompileConfig = debounce(() => {
    debug.info(
      "nextwp.config.ts changed, recompiling...\nIf your config changes are not updated try hard refreshing or restart next dev."
    );
    compileConfig();
  }, 2500); // Adjust 500ms to your need

  const configPath = path.resolve(process.cwd(), "nextwp.config.ts");

  // If there's an existing watcher, close it
  if (watcher) {
    // debug.info("unwatching nextwp.config.ts");
    fs.unwatchFile(configPath);
    watcher.close();
    // return;
  }

  watcher = fs.watch(configPath, (eventType) => {
    // console.log(
    //   `[${new Date().toISOString()}] Event type: ${eventType}, Process ID: ${
    //     process.pid
    //   }`
    // );

    if (eventType === "change" && hasConfigChanged()) {
      if (!isLocked() && createLockFile()) {
        try {
          debouncedCompileConfig();
        } finally {
          removeLockFile();
        }
      }
    }
  });
}

function compileConfig() {
  try {
    const configPath = path.resolve(process.cwd(), "nextwp.config.ts");

    if (!fs.existsSync(configPath)) {
      console.warn(
        colors.yellow +
          "Warning: nextwp.config.ts not found. Ensure the file exists in your project root." +
          colors.reset
      );
      return; // Exit if the file doesn't exist
    }

    const tsContent = fs.readFileSync(configPath, "utf8");
    const jsContent = ts.transpileModule(tsContent, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText;

    const tmpDir = path.resolve(process.cwd(), ".next", "nextwp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true });
    }

    const outputPath = path.resolve(tmpDir, "nextwp.config.js");
    fs.writeFileSync(outputPath, jsContent);

    return outputPath;
  } catch (error) {
    console.error(
      colors.red + "Error processing nextwp.config.ts:" + colors.reset,
      error
    );
    throw error; // Re-throw the error to stop the build process
  }
}

var isWatching = false;
function withNextWp(nextConfig = {}) {
  if (!isWatching && process.env.NODE_ENV === "development") {
    watchConfig();
    isWatching = true;
  }

  return {
    ...nextConfig,
    webpack: (config, options) => {
      if (typeof nextConfig.webpack === "function") {
        config = nextConfig.webpack(config, options);
      }
      config.plugins.push(
        new options.webpack.NormalModuleReplacementPlugin(
          /^nextwp-config$/,
          (resource) => {
            resource.request = compileConfig();
          }
        )
      );

      return config;
    },
  };
}

module.exports = withNextWp;

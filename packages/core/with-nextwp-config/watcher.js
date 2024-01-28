const fs = require("fs");
const path = require("path");
// const { compileConfig } = require("./compiler");
const { debounce, debug } = require("./utils");
const { createLockFile, removeLockFile, isLocked } = require("./lock");

let lastModifiedTime = 0;
let lastConfigContent = "";
let watcher = null;

function watchConfig() {
  const debouncedCompileConfig = debounce(() => {
    debug.info("nextwp.config.ts updating...");

    // writing to next.config.js just to trigger a dev refresh
    // in next.js internally, not actually changing anything in it
    const configPath = path.resolve(process.cwd(), "next.config.js");
    const nextConfigContent = fs.readFileSync(configPath, "utf8");

    if (!nextConfigContent) {
      debug.error("Failed to read next.config.js content.");
      process.exit(1);
    }

    fs.writeFileSync(configPath, nextConfigContent, "utf8");
  }, 100);

  const configPath = path.resolve(process.cwd(), "nextwp.config.ts");

  if (watcher) {
    fs.unwatchFile(configPath);
    watcher.close();
  }

  watcher = fs.watch(configPath, (eventType) => {
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

function hasConfigChanged() {
  const configPath = path.resolve(process.cwd(), "nextwp.config.ts");
  const stats = fs.statSync(configPath);
  const currentConfigContent = fs.readFileSync(
    path.resolve(process.cwd(), "nextwp.config.ts"),
    "utf8"
  );

  if (
    stats.mtimeMs !== lastModifiedTime &&
    lastConfigContent !== currentConfigContent
  ) {
    lastModifiedTime = stats.mtimeMs;
    lastConfigContent = currentConfigContent;
    return true;
  }
  return false;
}

module.exports = {
  watchConfig,
};

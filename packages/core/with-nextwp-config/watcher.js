const fs = require("fs");
const {
  NEXT_CONFIG_PATH,
  SRC_NEXTWP_CONFIG_FILE_PATH,
} = require("./constants");
const { debounce, debug } = require("./utils");
const { createLockFile, removeLockFile, isLocked } = require("./lock");

let lastModifiedTime = 0;
let lastConfigContent = "";
let watcher = null;

function watchConfig() {
  const debouncedCompileConfig = debounce(() => {
    debug.info("nextwp.config.ts updating...");
    // updating next.config.js just to gracefully trigger a dev refresh in next.js internally
    const nextConfigContent = fs.readFileSync(NEXT_CONFIG_PATH, "utf8");
    if (!nextConfigContent) {
      debug.error("Failed to read next.config.js content.");
      process.exit(1);
    }
    fs.writeFileSync(NEXT_CONFIG_PATH, nextConfigContent, "utf8");
  }, 100);

  if (!fs.existsSync(SRC_NEXTWP_CONFIG_FILE_PATH)) {
    // debug.warn(`watcher: nextwp.config.ts not found.`);
    return;
  }

  if (watcher) {
    fs.unwatchFile(SRC_NEXTWP_CONFIG_FILE_PATH);
    watcher.close();
  }

  watcher = fs.watch(SRC_NEXTWP_CONFIG_FILE_PATH, (eventType) => {
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
  const stats = fs.statSync(SRC_NEXTWP_CONFIG_FILE_PATH);
  const currentConfigContent = fs.readFileSync(
    SRC_NEXTWP_CONFIG_FILE_PATH,
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

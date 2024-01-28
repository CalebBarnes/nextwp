const fs = require("fs");
const path = require("path");

const { pid } = process;

const LOCK_FILE = path.resolve(
  process.cwd(),
  ".next",
  "nextwp",
  ".nextwp.config.lock"
);

function createLockFile() {
  if (!isLocked()) {
    try {
      fs.writeFileSync(LOCK_FILE, pid.toString(), {
        recursive: true,
      });
      return true;
    } catch (error) {
      return false;
    }
  }
  return false;
}

function removeLockFile() {
  try {
    if (fs.existsSync(LOCK_FILE)) {
      fs.unlinkSync(LOCK_FILE); // Delete the lock file
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      // Re-throw the error if it's not a "file not found" error
      throw error;
    }
  }
}

function isLocked() {
  if (fs.existsSync(LOCK_FILE)) {
    const lockPid = parseInt(fs.readFileSync(LOCK_FILE, "utf8"), 10);
    // Check if the process holding the lock is still running
    try {
      process.kill(lockPid, 0);
      return true; // Process is still running
    } catch (error) {
      removeLockFile(); // Remove stale lock file
      return false;
    }
  }
  return false;
}

module.exports = {
  createLockFile,
  removeLockFile,
  isLocked,
};

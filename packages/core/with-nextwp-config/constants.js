const path = require("path");

// const SRC_NEXTWP_CONFIG_FILE_NAME = "nextwp.config.ts";
// const DEST_NEXTWP_CONFIG_FILE_NAME = "nextwp.config.js";
const SRC_NEXTWP_CONFIG_FILE_PATH = path.resolve(
  process.cwd(),
  "nextwp.config.ts"
);
const DEST_NEXTWP_CONFIG_FILE_PATH = path.resolve(
  process.cwd(),
  ".next",
  "nextwp",
  "nextwp.config.js"
);
const NEXT_CONFIG_PATH = path.resolve(process.cwd(), "next.config.js");

module.exports = {
  // SRC_NEXTWP_CONFIG_FILE_NAME,
  // DEST_NEXTWP_CONFIG_FILE_NAME,
  SRC_NEXTWP_CONFIG_FILE_PATH,
  DEST_NEXTWP_CONFIG_FILE_PATH,
  NEXT_CONFIG_PATH,
};

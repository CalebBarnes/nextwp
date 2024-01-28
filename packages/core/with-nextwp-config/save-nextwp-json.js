const fs = require("fs");
const path = require("path");
const { debug } = require("./utils");

function saveNextWpConfigJson(nextwpConfig) {
  try {
    const configPath = path.join(
      process.cwd(),
      ".next",
      "nextwp",
      "config.json"
    );
    const configDir = path.dirname(configPath);

    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    fs.writeFileSync(configPath, JSON.stringify(nextwpConfig, null, 2), "utf8");
    return configPath;
  } catch (error) {
    debug.error(error);
  }
}

module.exports = {
  saveNextWpConfigJson,
};

const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { colors, debug } = require("./utils");
const vm = require("vm");
const { validateConfig, applyConfigDefaults } = require("./validate");
const {
  SRC_NEXTWP_CONFIG_FILE_PATH,
  DEST_NEXTWP_CONFIG_FILE_PATH,
} = require("./constants");

let isCompiling = false;
function compileConfig() {
  if (isCompiling) {
    return;
  }

  try {
    if (!fs.existsSync(path.dirname(DEST_NEXTWP_CONFIG_FILE_PATH))) {
      // create the .next/nextwp directory if it doesn't exist
      fs.mkdirSync(path.dirname(DEST_NEXTWP_CONFIG_FILE_PATH), {
        recursive: true,
      });
    }

    if (!fs.existsSync(SRC_NEXTWP_CONFIG_FILE_PATH)) {
      debug.warn(
        `missing nextwp.config.ts.\nFalling back to default NextWP config.\nEnsure you have a nextwp.config.ts file in your project root.\nYou can use @nextwp/cli to generate one with the command "nextwp init"`
      );
      return createDefaultConfig();
    }

    const tsContent = fs.readFileSync(SRC_NEXTWP_CONFIG_FILE_PATH, "utf8");
    const jsContent = ts.transpileModule(tsContent, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText;

    // we will execute this transpiled config file in a sandbox
    // so that we can apply default values and validate during compilation.
    // this will prevent the need for runtime zod validation on each function call
    const sandbox = {
      require: require,
      module: {},
      exports: {},
      process: process,
      console: console,
      __dirname: __dirname,
      __filename: __filename,
    };
    vm.createContext(sandbox);
    vm.runInContext(jsContent, sandbox);

    const userConfig = sandbox.exports.default;
    const configWithDefaults = applyConfigDefaults(userConfig);
    validateConfig(configWithDefaults);

    fs.writeFileSync(
      DEST_NEXTWP_CONFIG_FILE_PATH,
      `module.exports = ${JSON.stringify(configWithDefaults, null, 2)};`,
      "utf8"
    );

    if (!fs.existsSync(DEST_NEXTWP_CONFIG_FILE_PATH)) {
      logErrorAndQuit();
    }

    return DEST_NEXTWP_CONFIG_FILE_PATH;
  } catch (error) {
    console.error(
      colors.red + "Error processing nextwp.config.ts:" + colors.reset,
      error
    );
    throw error;
  } finally {
    isCompiling = false;
  }
}

module.exports = {
  compileConfig,
};

function logErrorAndQuit() {
  debug.error(
    `failed to generate file ${path.basename(
      DEST_NEXTWP_CONFIG_FILE_PATH
    )} at ${path.dirname(DEST_NEXTWP_CONFIG_FILE_PATH)}`
  );
  process.exit(1);
}

function createDefaultConfig() {
  const defaultConfig = applyConfigDefaults({});

  try {
    fs.writeFileSync(
      DEST_NEXTWP_CONFIG_FILE_PATH,
      `module.exports = ${JSON.stringify(defaultConfig, null, 2)};`,
      "utf8"
    );
  } catch (error) {
    debug.error(error.message);
    logErrorAndQuit();
  }

  if (!fs.existsSync(DEST_NEXTWP_CONFIG_FILE_PATH)) {
    logErrorAndQuit();
  }

  return DEST_NEXTWP_CONFIG_FILE_PATH;
}

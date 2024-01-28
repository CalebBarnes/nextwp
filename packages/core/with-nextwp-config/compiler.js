const fs = require("fs");
const path = require("path");
const ts = require("typescript");
const { colors } = require("./utils");

let isCompiling = false;
function compileConfig() {
  if (isCompiling) {
    return;
  }

  try {
    const configPath = path.resolve(process.cwd(), "nextwp.config.ts");

    if (!fs.existsSync(configPath)) {
      console.warn(
        colors.yellow +
          "Warning: nextwp.config.ts not found. Ensure the file exists in your project root." +
          colors.reset
      );
      return;
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
    // check if file is there
    if (!fs.existsSync(outputPath)) {
      throw new Error(
        "Error: nextwp.config.js not found in .next/nextwp/nextwp.config.js"
      );
    }
    return outputPath;
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

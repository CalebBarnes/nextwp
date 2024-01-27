const path = require("path");
const fs = require("fs");
const ts = require("typescript");

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

function withNextWp(nextConfig = {}) {
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
            try {
              const configPath = path.resolve(
                process.cwd(),
                "nextwp.config.ts"
              );

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

              resource.request = outputPath;
            } catch (error) {
              console.error(
                colors.red +
                  "Error processing nextwp.config.ts:" +
                  colors.reset,
                error
              );
              throw error; // Re-throw the error to stop the build process
            }
          }
        )
      );

      return config;
    },
  };
}

module.exports = withNextWp;

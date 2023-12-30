const os = require("os");
const fs = require("fs");

try {
  const verbose = process.argv.includes("--verbose");
  if (verbose) {
    console.log("Current Working Directory:", process.cwd());
    console.log("Current Directory:", __dirname);
    console.log("os Platform: ", os.platform());
  }

  if (!fs.existsSync("./bin")) {
    fs.mkdirSync("./bin");
  }

  let sourceFile;
  let destFile;

  switch (os.platform()) {
    case "darwin":
      sourceFile = "./dist/create-nextwp-app-mac";
      destFile = "./bin/create-nextwp-app";
      break;
    case "linux":
      sourceFile = "./dist/create-nextwp-app-linux";
      destFile = "./bin/create-nextwp-app";

      break;
    case "win32":
      sourceFile = "./dist/create-nextwp-app.exe";
      destFile = "./bin/create-nextwp-app.exe";

      break;
    default:
      console.error("Unsupported platform:", os.platform());
      process.exit(1);
  }

  if (verbose) {
    console.log("Copying binary for", os.platform());
    console.log("sourceFile: ", sourceFile);
    console.log("destFile: ", destFile);
  }

  if (fs.existsSync("./bin/create-nextwp-app.js")) {
    fs.unlinkSync("./bin/create-nextwp-app.js");
  }

  fs.copyFileSync(sourceFile, destFile);
  fs.chmodSync(destFile, "755");
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}

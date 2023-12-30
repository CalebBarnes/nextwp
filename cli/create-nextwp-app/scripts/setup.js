const os = require("os");
const fs = require("fs");

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

fs.copyFileSync(sourceFile, destFile);
fs.chmodSync(destFile, "755");

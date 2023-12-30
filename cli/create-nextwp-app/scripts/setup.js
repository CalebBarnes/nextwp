const os = require("os");
const fs = require("fs");

let sourceFile;
let destFile;

switch (os.platform()) {
  case "darwin":
    console.log("Copying binary for", os.platform());
    sourceFile = "./dist/create-nextwp-app-mac";
    console.log("sourceFile: ", sourceFile);
    destFile = "./bin/create-nextwp-app";
    console.log("destFile: ", destFile);
    break;
  case "linux":
    console.log("Copying binary for", os.platform());
    sourceFile = "./dist/create-nextwp-app-linux";
    console.log("sourceFile: ", sourceFile);
    destFile = "./bin/create-nextwp-app";
    console.log("destFile: ", destFile);
    break;
  case "win32":
    console.log("Copying binary for", os.platform());
    sourceFile = "./dist/create-nextwp-app.exe";
    console.log("sourceFile: ", sourceFile);
    destFile = "./bin/create-nextwp-app.exe";
    console.log("destFile: ", destFile);
    break;
  default:
    console.error("Unsupported platform:", os.platform());
    process.exit(1);
}

fs.copyFileSync(sourceFile, destFile);
fs.chmodSync(destFile, "755");

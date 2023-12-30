const os = require("os");
const fs = require("fs");

try {
  let sourceFile;
  let destFile;

  console.log("os Platform: ", os.platform());

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

  console.log("Copying binary for", os.platform());
  console.log("sourceFile: ", sourceFile);
  console.log("destFile: ", destFile);

  fs.copyFileSync(sourceFile, destFile);
  console.log("Copied binary for", os.platform());
  fs.chmodSync(destFile, "755");
  console.log("Changed permissions for", os.platform());
} catch (error) {
  console.error("Error:", error);
  process.exit(1);
}

#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");

const executable = getExecutable();
const executablePath = path.join(__dirname, executable);

const child = spawn(executablePath, process.argv.slice(2), {
  stdio: "inherit",
});
child.on("exit", process.exit);

function getExecutable() {
  const osPlatform = process.platform;
  let executable = "create-nextwp-app";

  switch (osPlatform) {
    case "win32":
      executable = "create-nextwp-app.exe";
    case "darwin":
      executable = "create-nextwp-app";
    case "linux":
      executable = "create-nextwp-app-linux";
    default:
      executable = "create-nextwp-app";
  }

  return `../dist/${executable}`;
}

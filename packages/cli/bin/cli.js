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
  let executable = "cli";

  switch (osPlatform) {
    case "win32":
      executable = "cli.exe";
    case "darwin":
      executable = "cli";
    case "linux":
      executable = "cli-linux";
    default:
      executable = "cli";
  }

  return `../dist/${executable}`;
}

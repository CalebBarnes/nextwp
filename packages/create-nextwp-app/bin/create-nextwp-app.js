#!/usr/bin/env node
const { spawn } = require("child_process");
const path = require("path");

const executable =
  process.platform === "win32" ? "create-nextwp-app.exe" : "create-nextwp-app";
const executablePath = path.join(__dirname, executable);

const child = spawn(executablePath, process.argv.slice(2), {
  stdio: "inherit",
});
child.on("exit", process.exit);

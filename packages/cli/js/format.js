const prettier = require("prettier");
const fs = require("fs").promises;
const files = process.argv.slice(2);

async function formatFile(file, prettierOptions) {
  try {
    const content = await fs.readFile(file, "utf8");
    const formatted = await prettier.format(content, {
      ...prettierOptions,
      filepath: file,
    });

    await fs.writeFile(file, formatted);
  } catch (err) {
    console.error(
      `\x1b[32m[@nextwp/cli]\x1b[31m ⛔️Error formatting ${file}:\x1b[0m`,
      err.stack
    );
    throw err;
  }
}

async function formatAll() {
  console.time(`\x1b[32m[@nextwp/cli]\x1b[0m Formatted files with prettier`);
  const prettierOptions = (await prettier.resolveConfig(files[0])) || {}; // get prettier optiosn once and re-use for all files
  const formatPromises = files.map((file) => formatFile(file, prettierOptions));
  await Promise.all(formatPromises);
  console.timeEnd(`\x1b[32m[@nextwp/cli]\x1b[0m Formatted files with prettier`);
}
formatAll();

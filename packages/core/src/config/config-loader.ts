export async function loadConfig() {
  const projectRoot = process.cwd();
  const configFileName = "nextwp.config.mjs";
  const configPath = `${projectRoot}/${configFileName}`;
  console.log({ configPath });

  try {
    const config = await new Function("path", `return import(path)`)(
      configPath
    );

    // Use the imported configuration
    return config?.default || config;
  } catch (error) {
    console.error("Failed to load configuration:", error);
    throw new Error("Configuration loading failed.");
  }
}

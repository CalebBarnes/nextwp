import config from "nextwp-config";

export async function loadConfig() {
  console.log({ config });
  return config;
}

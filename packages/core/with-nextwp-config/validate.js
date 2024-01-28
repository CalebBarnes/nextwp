const z = require("zod");
const { debug } = require("./utils");

// ensure this validator schema always matches the
// type definition of NextWpConfig at "./src/config/load-config.ts"
// we have to make sure this is always in sync manually
// because we are validating the config file at compile time in js instead of ts
const nextwpConfigValidator = z.object({
  postTypes: z.array(z.string()),
  pagination: z.object({
    mode: z.enum(["paged", "infinite"]),
  }),
  templatesPath: z.string(),
});

function validateConfig(config, schema = nextwpConfigValidator, path = "") {
  const result = schema.safeParse(config);

  if (!result.success) {
    // Log errors at the current level
    for (const issue of result.error.issues) {
      const issueFullPath = issue.path.join(".");
      if (path === "" || issueFullPath.startsWith(path)) {
        if (issue.message === "Required") {
          debug.error(
            `nextwp.config.ts: Missing required property ${issueFullPath}\n`
          );
        } else {
          debug.error(
            `nextwp.config.ts: ${issue.message} at ${issueFullPath}\n`
          );
        }
      }
    }
  }

  const data = result.data;

  // Check for unsupported options
  for (const key in config) {
    if (schema.shape && !schema.shape.hasOwnProperty(key)) {
      debug.warn(
        `nextwp.config.ts: Unsupported option "${path}${key}":${JSON.stringify(
          config[key]
        )}`
      );
    } else if (
      typeof config[key] === "object" &&
      config[key] !== null &&
      !(config[key] instanceof Array)
    ) {
      // Recursive call for nested objects
      validateConfig(config[key], schema.shape[key], `${path}${key}.`);
    }
  }

  return data;
}

const configDefaults = {
  postTypes: ["page", "post"],
  pagination: { mode: "paged" },
  templatesPath: "./src/templates",
};

function applyConfigDefaults(config = {}) {
  const { postTypes, pagination, templatesPath, ...rest } = config;

  return {
    postTypes: postTypes || configDefaults.postTypes,
    pagination: pagination || configDefaults.pagination,
    templatesPath: templatesPath || configDefaults.templatesPath,
    ...rest,
  };
}

module.exports = {
  validateConfig,
  applyConfigDefaults,
};

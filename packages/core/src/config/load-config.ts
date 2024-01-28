import userConfig from "nextwp-config";
import { z } from "zod";
import { debug } from "../utils/debug-log";

export type NextWpConfig = Partial<NextWpConfigRequired>;
export interface NextWpConfigRequired {
  /**
   * The post types you want to use in your app.
   * NextWP will automatically create pages for each post type, and include them in the sitemap.
   *
   */
  postTypes: string[];
  /**
   * What pagination mode to use on archive pages.
   *
   * "paged" mode will create a new page for each page of results.
   * e.g. /blog/page/2, /blog/page/3, etc.
   *
   * "infinite" mode will load more posts when the user scrolls to the bottom of the page.
   */
  pagination: {
    mode: "paged" | "infinite";
  };

  /**
   * The path to your templates directory.
   * This is where you should put your template files.
   */
  templatesPath: string;
}

const nextwpConfigValidator = z.object({
  postTypes: z.array(z.string()),
  pagination: z.object({
    mode: z.enum(["paged", "infinite"]),
  }),
  templatesPath: z.string(),
});

function validateConfig(config: any, schema: z.ZodTypeAny, path = "") {
  const result = schema.safeParse(config);

  if (!result.success) {
    // Log errors at the current level
    for (const issue of result.error.issues) {
      const issueFullPath = issue.path.join(".");
      if (path === "" || issueFullPath.startsWith(path)) {
        debug.error(`nextwp.config.ts: ${issue.message} at ${issueFullPath}\n`);
      }
    }
  }

  const data = result.data;

  // Check for unsupported options
  for (const key in config) {
    if (!schema.shape.hasOwnProperty(key)) {
      debug.warn(
        `nextwp.config.ts: Unsupported option "${path}${key}": ${JSON.stringify(
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

export function loadConfig() {
  if (!userConfig) {
    throw new Error(
      "No nextwp-config.ts file found. Please create one in the root of your project or use the cli `nextwp init` to create one."
    );
  }

  const configWithDefaults = applyConfigDefaults(userConfig as NextWpConfig);
  validateConfig(configWithDefaults, nextwpConfigValidator);

  return configWithDefaults;
}

const configDefaults = {
  postTypes: ["page", "post"],
  pagination: { mode: "paged" },
  templatesPath: "./src/templates",
} satisfies NextWpConfigRequired;

export function applyConfigDefaults(
  config: NextWpConfig = {}
): NextWpConfigRequired {
  const { postTypes, pagination, templatesPath, ...rest } = config;

  return {
    postTypes: postTypes || configDefaults.postTypes,
    pagination: pagination || configDefaults.pagination,
    templatesPath: templatesPath || configDefaults.templatesPath,
    ...rest,
  };
}

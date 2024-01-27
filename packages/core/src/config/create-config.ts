/* eslint-disable tsdoc/syntax -- showing default values */
export interface NextWpConfig {
  /**
   * The post types you want to use in your app.
   * NextWP will automatically create pages for each post type, and include them in the sitemap.
   *
   * @default
   * ["page", "post"]
   */
  postTypes?: string[];
  /**
   * What pagination mode to use on archive pages.
   *
   * "paged" mode will create a new page for each page of results.
   * e.g. /blog/page/2, /blog/page/3, etc.
   *
   * "infinite" mode will load more posts when the user scrolls to the bottom of the page.
   */
  pagination?: {
    mode: "paged" | "infinite";
  };

  /**
   * The path to your templates directory.
   * This is where you should put your template files.
   * @default "./src/templates"
   */
  templatesPath?: string;
}

export function createConfig(config: Partial<NextWpConfig> = {}): NextWpConfig {
  const { postTypes, pagination, templatesPath, ...rest } = config;

  return {
    postTypes: postTypes || ["page", "post"],
    pagination: pagination || { mode: "paged" },
    templatesPath: templatesPath || "./src/templates",
    ...rest,
  };
}

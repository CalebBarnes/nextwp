import config from "nextwp-config";
// If you are seeing this error, you need to add "withNextWp" to your next.config.js
// and make sure you have a nextwp.config.ts file in your project root.
// You can get started easily with @nextwp/cli: nextwp init
// read the docs here: https://nextwp.org/

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

export function loadConfig(): NextWpConfigRequired {
  return config;
}

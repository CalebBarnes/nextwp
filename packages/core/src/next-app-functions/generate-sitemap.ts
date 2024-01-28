import type { MetadataRoute } from "next";
import { getAllItems } from "../api/get-all-items";
import { loadConfig } from "../config/load-config";
import { debug } from "../utils/debug-log";

/**
 * This function is used to generate a sitemap.xml file for your WordPress content in Next.js.
 *
 * It should be exported as default from your `src/app/sitemap.ts` file.
 *
 *
 * Read the docs for more info:
 * @see https://www.nextwp.org/packages/nextwp/core/next-app-functions#generate-sitemap
 *
 * @example
 * ```ts
 * // src/app/sitemap.ts
 * export { generateSitemap as default } from "@nextwp/core";
 * ```
 */
export async function generateSitemap(): Promise<MetadataRoute.Sitemap> {
  const config = loadConfig();
  const allSingleItems = await getAllItems(config.postTypes);
  const allItems = [...allSingleItems];

  if (config.pagination.mode === "paged") {
    // handle adding archive and taxonomy pagination routes here
    // e.g. /blog/2, /blog/3, etc.
    debug.info(
      "pagination mode is 'paged'! Handle pagination sitemap routes here!"
    );
  }

  return allItems.map((item) => {
    return {
      url: `${process.env.NEXT_SITE_URL}${item.path}`,
      lastModified: item.modified_gmt,
      changeFrequency: "daily",
      priority: 0.5,
    };
  });
}

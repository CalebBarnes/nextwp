import type { MetadataRoute } from "next";
import { getAllItems } from "../api/get-all-items";
// import { debug } from "../utils/debug-log";
// import { loadConfig } from "../config/load-config";
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
export async function generateSitemap({
  postTypes = ["pages", "posts"],
}): Promise<MetadataRoute.Sitemap> {
  // const config = loadConfig();
  const allSingleItems = await getAllItems(postTypes);

  const allItems = [...allSingleItems];

  // if (config.pagination?.mode === "paged") {
  //   // handle adding archive and taxonomy pagination routes here
  //   // e.g. /blog/page/2, /blog/page/3, etc.
  //   debug.info("pagination mode is 'paged'");
  // }

  // if (config.pagination?.mode === "infinite") {
  //   debug.info("pagination mode is 'infinite'");
  // }

  return allItems.map((item) => {
    return {
      url: `${process.env.NEXT_SITE_URL}${item.path}`,
      lastModified: item.modified_gmt,
      changeFrequency: "daily",
      priority: 0.5,
    };
  });
}

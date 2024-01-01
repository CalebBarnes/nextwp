import type { MetadataRoute } from "next";
import { getAllItems } from "../api/get-all-items";
/**
 * The generateSiteMap function can be exported from your Next.js page.js and
 * used to generate a sitemap.xml file for your site.
 * This function uses the WordPress REST API to generate the sitemap.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 *
 * Add your custom post types here, by rest_base
 * @example generateSiteMap({postTypes: ["pages", "posts", "custom-post-type"])
 * This would be the same as the rest_base in the WordPress API
 * https://example.com/wp-json/wp/v2/pages
 * https://example.com/wp-json/wp/v2/posts
 * https://example.com/wp-json/wp/v2/custom-post-type
 *
 * @see https://developer.wordpress.org/rest-api/reference/
 */
export async function generateSitemap({
  postTypes = ["pages", "posts"],
}): Promise<MetadataRoute.Sitemap> {
  const allItems = await getAllItems(postTypes);

  return allItems.map((item) => {
    return {
      url: `${process.env.NEXT_SITE_URL}${item.path}`,
      lastModified: item.modified_gmt,
      changeFrequency: "daily",
      priority: 0.5,
    };
  });
}

export function generateSiteMap() {
  console.warn(
    "Warning: generateSiteMap is deprecated. Please use generateSitemap instead. This will be removed in the next release."
  );

  return generateSitemap;
}

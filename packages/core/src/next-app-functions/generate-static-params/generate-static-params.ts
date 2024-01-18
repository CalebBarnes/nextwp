import { getArchiveStaticParams } from "./get-archive-static-params";
import { getSingleItemsStaticParams } from "./get-single-items-static-params";
import { getTaxonomyStaticParams } from "./get-taxonomy-static-params";
/**
 * This function is used to statically generate routes at build time instead of on-demand at request time.
 * To statically generate routes for your WordPress content in Next.js, you can export this function from your dynamic route `src/app/[[...paths]]/page.tsx` file.
 *
 * Read the docs for more info:
 * @see https://www.nextwp.org/packages/nextwp/core/next-app-functions#generate-static-params
 *
 * @example
 * ```ts
 * // src/app/[[...paths]]/page.tsx
 * export { generateStaticParams } from "@nextwp/core";
 * ```
 */
export async function generateStaticParams({
  wpUrl = process.env.NEXT_PUBLIC_WP_URL || "",
  postTypes = ["pages", "posts"], // taxonomies = ["category", "post_tag"],
}: {
  /**
   * The URL of the WP SITE to fetch data from the REST API.
   */
  wpUrl?: string;
  /**
   * The post types to include in the static generation.
   */
  postTypes?: string[];
}) {
  if (!wpUrl) {
    throw new Error(
      "generateStaticParams: No wpUrl provided. Please set `NEXT_PUBLIC_WP_URL` environment variable or pass `wpUrl` to `generateStaticParams`."
    );
  }

  const staticParams: { paths: string[] }[] = [];

  const singleParams = await getSingleItemsStaticParams({ postTypes });
  staticParams.push(...singleParams);

  const archiveParams = await getArchiveStaticParams({ postTypes });
  staticParams.push(...archiveParams);

  const taxonomyParams = await getTaxonomyStaticParams({ postTypes });
  staticParams.push(...taxonomyParams);

  staticParams.push({
    paths: ["/"],
  });

  return staticParams;
}

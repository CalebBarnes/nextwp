import { getAllItems } from "../api/get-all-items";
import { getPostTypes } from "../api/get-post-types";
import { getTaxonomies } from "../api/get-taxonomies";
import { debug } from "../utils/debug-log";

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

  /**
   * The taxonomies to include in the static generation.
   */
  // taxonomies?: string[];
}) {
  if (!wpUrl) {
    throw new Error(
      "generateStaticParams: No wpUrl provided. Please set `NEXT_PUBLIC_WP_URL` environment variable or pass `wpUrl` to `generateStaticParams`."
    );
  }

  const staticParams: { paths: string[] }[] = [];
  const allItems = await getAllItems(postTypes);

  const wpPostTypes = await getPostTypes();
  // console.log(wpPostTypes);

  for (const postType of postTypes) {
    const itemKey = Object.keys(wpPostTypes).find(
      (key) => wpPostTypes[key].rest_base === postType
    );

    const matchingPostType = wpPostTypes[itemKey];

    // console.log({ matchingPostType });

    if (
      matchingPostType.has_archive &&
      typeof matchingPostType.has_archive === "string"
    ) {
      staticParams.push({
        paths: [matchingPostType.has_archive],
      });
    }

    // todo: fetch first page of this type to check how many pages there are
    // todo: then generate static paths for each page
    // todo: example: /blog/page/2 /blog/page/3 etc

    // todo: check which taxonomies are registered for this post type
    // todo: then fetch all terms for each taxonomy
    // todo: then generate static paths for each term
  }

  // for (const key in wpPostTypes) {
  //   const item = wpPostTypes.find(postType = postType.rest_base === key)

  //   const item = wpPostTypes[key];
  //   if (item.has_archive && typeof item.has_archive === "string") {
  //     staticParams.push({
  //       paths: [item.has_archive],
  //     });
  //   }
  // }

  // debug.log(staticParams);

  // const wpTaxonomies = await getTaxonomies();

  // for (const key in wpTaxonomies) {
  //   if (!taxonomies.includes(key)) {
  //     continue;
  //   }

  //   const item = wpTaxonomies[key];
  //   const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${item.rest_base}`;
  //   const req = await fetch(endpoint);
  //   const data = await req.json();

  //   for (const tax of data) {
  //     const path = tax.link.replace(wpUrl, "");
  //     const pathBreadcrumbs = path.split("/").filter((x) => x);

  //     staticParams.push({
  //       paths: [...pathBreadcrumbs],
  //     });
  //   }
  // }

  for (const item of allItems) {
    const pathBreadcrumbs = item.path.split("/").filter((x) => x);

    staticParams.push({
      paths: [...(pathBreadcrumbs || "/")],
    });
  }

  staticParams.push({
    paths: ["/"],
  });

  return staticParams;
}

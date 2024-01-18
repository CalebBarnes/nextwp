import { getAllItems } from "../api/get-all-items";
import { getPostTypes } from "../api/get-post-types";
import { getSiteSettings } from "../api/get-site-settings";
// import { getTaxonomies } from "../api/get-taxonomies";
// import { debug } from "../utils/debug-log";

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
  const allItems = await getAllItems(postTypes);
  const wpPostTypes = await getPostTypes();
  const settings = await getSiteSettings();

  for (const item of allItems) {
    const pathBreadcrumbs = item.path.split("/").filter((x) => x);

    staticParams.push({
      paths: [...(pathBreadcrumbs || "/")],
    });
  }

  if (settings.page_for_posts) {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/pages/${settings.page_for_posts}`;
      const req = await fetch(endpoint);
      const postsPage = await req.json();

      staticParams.push({
        paths: [postsPage.slug],
      });

      const paginationInfo = await getPostTypePaginationInfo({
        rest_base: "posts",
        per_page: settings.posts_per_page,
      });

      const postArchiveStaticParams = getStaticParamsFromPaginationInfo({
        archiveSlug: postsPage.slug,
        paginationInfo,
      });

      staticParams.push(...postArchiveStaticParams);
    } catch (error) {
      console.error(error);
    }
  }

  for (const postType of postTypes) {
    const itemKey = Object.keys(wpPostTypes).find(
      (key) => wpPostTypes[key].rest_base === postType
    );

    const matchingPostType = wpPostTypes[itemKey];

    if (
      matchingPostType.has_archive &&
      typeof matchingPostType.has_archive === "string"
    ) {
      const paginationInfo = await getPostTypePaginationInfo({
        rest_base: matchingPostType.rest_base,
        per_page: settings.posts_per_page,
      });

      const postTypeArchiveStaticParams = getStaticParamsFromPaginationInfo({
        archiveSlug: matchingPostType.has_archive,
        paginationInfo,
      });

      staticParams.push({
        paths: [matchingPostType.has_archive],
      });

      staticParams.push(...postTypeArchiveStaticParams);
    }

    // todo: check which taxonomies are registered for this post type
    // todo: then fetch all terms for each taxonomy
    // todo: then generate static paths for each term
  }

  staticParams.push({
    paths: ["/"],
  });

  // console.log(JSON.stringify(staticParams, null, 2));

  return staticParams;
}

async function getPostTypePaginationInfo({
  rest_base,
  per_page,
}: {
  rest_base: string;
  per_page: number;
}) {
  try {
    const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}?per_page=${per_page}`;
    const req = await fetch(endpoint);

    // Check if the fetch request was successful
    if (!req.ok) {
      throw new Error(`HTTP error! status: ${req.status}`);
    }

    const totalPages = req.headers.get("X-WP-TotalPages")
      ? Number(req.headers.get("X-WP-TotalPages") || 1)
      : undefined;

    const totalItems = req.headers.get("X-WP-Total")
      ? Number(req.headers.get("X-WP-Total") || 0)
      : undefined;

    return {
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function getStaticParamsFromPaginationInfo({ archiveSlug, paginationInfo }) {
  const staticParams = [];

  for (let i = 1; i <= paginationInfo.totalPages; i++) {
    if (i === 1) {
      continue;
    }
    staticParams.push({
      paths: [archiveSlug, String(i)],
    });
  }

  return staticParams;
}

import { getAllItems } from "../api/get-all-items";

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
  postTypes = ["pages", "posts"],
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

  for (const item of allItems) {
    // if (item.path === "/") {
    //   staticParams.push({
    //     paths: ["/"],
    //   });
    //   continue;
    // }

    //       if (item.path === "/") {
    //         staticParams.push({
    //           paths: ["index"],
    //         });
    //         continue;
    //       }

    const pathBreadcrumbs = item.path.split("/").filter((x) => x);

    staticParams.push({
      paths: [...(pathBreadcrumbs || "/"), "all-products"],
    });
  }

  return staticParams;
}

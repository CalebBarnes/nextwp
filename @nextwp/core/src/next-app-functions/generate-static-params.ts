import { getAllItems } from "../api/get-all-items";

/**
 * The generateStaticParams function can be exported from your Next.js App's page.js and
 * will be called at build time to generate the static routes for your site based on the WordPress REST API results.
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams({
  wpUrl = process.env.NEXT_PUBLIC_WP_URL || "",
  postTypes = ["pages", "posts"],
}: {
  /**
   * The URL of the WP SITE to fetch data from the REST API.
   * @default process.env.NEXT_PUBLIC_WP_URL
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
      paths: [...(pathBreadcrumbs || "/")],
    });
  }

  return staticParams;
}

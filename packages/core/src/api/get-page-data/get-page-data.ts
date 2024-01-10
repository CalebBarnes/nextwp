import type { WpPage } from "../../types";
import type { PostType } from "../get-post-types";
import { getSingleItem } from "../get-single-item";
import { getFrontPage } from "./get-front-page";
import { getNodeInfo } from "./get-node-info";
import type { ArchivePageData } from "./get-archive-page";
import { getArchivePage } from "./get-archive-page";

/**
 * Get data for a specific page from a WordPress REST API endpoint based on the URI
 * @example
 * ```
 * const pageData = await getPageData("/about");
 * ```
 * @see https://www.nextwp.org/packages/nextwp/core/functions#get-page-data
 */
export async function getPageData(uri: string): Promise<
  | {
      /**
       * The data is the page data for the current page/post or it is the archive page data if the uri is an archive page.
       */
      data?: WpPage | ArchivePageData;
      /**
       * The archive is the post type archive data if the uri is an archive page.
       */
      archive?: PostType;
      /**
       * The previewData is the preview data for the current page/post/custom.
       */
      previewData?: WpPage;
    }
  | Record<string, never>
> {
  if (uri === "/" || uri === "index") {
    const frontPage = await getFrontPage();
    return frontPage || {};
  }

  const pageNumber = getPageNumberFromUri(uri); // extract page number from uri for archive pages
  let safeUri = uri;
  if (pageNumber) {
    safeUri = uri.replace(/\/\d+$/, ""); // remove page number from uri before fetching data
  }

  const nodeInfo = await getNodeInfo(safeUri);
  const { rest_base, archive, taxonomy } = nodeInfo;
  console.log({
    taxonomy,
    rest_base,
    archive,
  });
  if (archive) {
    const archivePage = await getArchivePage({
      archive,
      pageNumber,
    });
    return archivePage;
  }

  // if (taxonomy) {
  //   const termPage = await getTermPage({
  //     uri,
  //     taxonomy,
  //     pageNumber,
  //   });
  // }

  const singleItem = await getSingleItem({
    uri: safeUri,
    rest_base,
  });

  if (singleItem?.data) {
    return singleItem;
  }

  // posts are a special case because they can have an empty slug prefix like pages
  const possiblePostItem = await getSingleItem({
    uri: safeUri,
    rest_base: "posts",
  });

  if (possiblePostItem?.data) {
    return possiblePostItem;
  }

  return { data: undefined, previewData: undefined, archive: undefined };
}

/**
 * This function is used to get the page number from a uri if it is an archive page.
 */
function getPageNumberFromUri(uri: string): number | undefined {
  const pageNumber = /\/\d+$/.exec(uri)
    ? Number(uri.split("/").pop())
    : undefined;

  return pageNumber;
}

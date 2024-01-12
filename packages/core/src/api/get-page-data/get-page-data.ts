import type { WpPage } from "../../types";
import { getSingleItem } from "../get-single-item";
import type { TaxonomyPage } from "../taxonomy/get-taxonomy-page";
import { getTaxonomyPage } from "../taxonomy/get-taxonomy-page";
import { extractPageNumberFromUri } from "../helpers/extract-page-number-from-uri";
import { getFrontPage } from "./get-front-page";
import { getNodeInfo } from "./get-node-info";
import type { ArchivePage } from "./get-archive-page";
import { getArchivePage } from "./get-archive-page";

type SingleItem = {
  /**
   * The single page/post/custom returned from the WP REST API.
   */
  data?: WpPage;
  /**
   * The preview data returned from the WP REST API for the single page/post/custom.
   */
  previewData?: WpPage;
};

type PageData =
  | (TaxonomyPage & ArchivePage & SingleItem)
  | Record<string, never>;

/**
 * Get data for a specific page from a WordPress REST API endpoint based on the URI
 * @example
 * ```
 * const pageData = await getPageData("/about");
 * ```
 * @see https://www.nextwp.org/packages/nextwp/core/functions#get-page-data
 */
export async function getPageData(uri: string): Promise<PageData> {
  if (uri === "/" || uri === "index") {
    const frontPage = await getFrontPage();
    return frontPage || {};
  }

  const { uriWithoutPage, pageNumber } = extractPageNumberFromUri(uri);
  const { rest_base, archive, taxonomy } = await getNodeInfo(uriWithoutPage);

  if (archive) {
    return getArchivePage({
      archive,
      pageNumber,
    });
  }
  if (taxonomy) {
    return getTaxonomyPage({
      uri: uriWithoutPage,
      taxonomy,
      pageNumber,
    });
  }

  const singleItem = await getSingleItem({
    uri: uriWithoutPage,
    rest_base,
  });

  if (singleItem?.data) {
    return singleItem;
  }

  // posts are a special case because they can have an empty slug prefix like pages
  const possiblePostItem = await getSingleItem({
    uri: uriWithoutPage,
    rest_base: "posts",
  });

  if (possiblePostItem?.data) {
    return possiblePostItem;
  }

  return {
    data: undefined,
    previewData: undefined,
    archive: undefined,
    taxonomy: undefined,
    term: undefined,
  };
}

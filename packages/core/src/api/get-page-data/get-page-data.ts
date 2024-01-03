import { draftMode } from "next/headers";
import type { SearchParams } from "../../components/wordpress-template";
import type { WpPage } from "../../types";
import type { PostType } from "../get-post-types";
import { getSingleItem } from "../get-single-item";
import { getPreviewData } from "./get-preview-data";
import { getFrontPage } from "./get-front-page";
import { getPostInfo } from "./get-post-info";
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
export async function getPageData(
  uri: string,
  searchParams?: SearchParams
): Promise<{
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
}> {
  const preview = draftMode();
  const paths = uri.split("/");
  const slug = paths.slice(-1).toString();

  if (uri === "/" || uri === "index") {
    const frontPage = await getFrontPage();
    return frontPage;
  }

  const { postTypeRestBase, archive } = await getPostInfo(uri);

  if (archive) {
    const archivePage = getArchivePage({
      archive,
      searchParams,
    });

    return archivePage;
  }

  const data = await getSingleItem({
    uri,
    slug,
    postTypeRestBase,
  });

  if (data && preview.isEnabled) {
    const previewData = await getPreviewData({
      id: data.id,
      postTypeRestBase,
    });

    return { data, previewData };
  }

  // posts are a special case because they can have an empty slug prefix like pages
  const maybePostData = await getSingleItem({
    slug,
    postTypeRestBase: "posts",
  });

  if (maybePostData) {
    if (preview.isEnabled) {
      const previewData = await getPreviewData({
        id: maybePostData.id,
        postTypeRestBase: "posts",
      });

      return { data: maybePostData, previewData };
    }
    return { data: maybePostData };
  }
  return { data: data || maybePostData };
}

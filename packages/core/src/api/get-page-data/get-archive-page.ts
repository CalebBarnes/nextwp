import type { WpPage } from "../../types";
import { toCamel } from "../../utils/to-camel";
import type { PostType } from "../get-post-types";
import { getSiteSettings } from "../get-site-settings";
import { getSingleItem } from "../get-single-item";

export type ArchivePageData = {
  items: WpPage[];
  page?: WpPage;
  /**
   * The pathname of the previous page.
   */
  prevPage?: string;
  /**
   * The pathname of the next page.
   */
  nextPage?: string;
  /**
   * The total number of pages.
   */
  totalPages?: number;
  /**
   * The total number of items.
   */
  totalItems?: number;
  /**
   * The current page number.
   */
  currentPage?: number;
  [x: string]: any;
};

export async function getArchivePage({
  archive,
  pageNumber,
}: {
  archive: PostType;
  pageNumber?: number;
}): Promise<{
  data?: ArchivePageData;
  archive?: PostType;
}> {
  const settings = await getSiteSettings();

  const params = {
    per_page: String(settings.posts_per_page || 10),
    _embed: "true",
    acf_format: "standard",
    page: String(pageNumber || "1"),
  };

  const currentPageQueryString = new URLSearchParams(params).toString();
  const archiveItemsRequest = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${archive.rest_base}?${currentPageQueryString}`
  );

  try {
    const items = (await archiveItemsRequest.json()) as WpPage[];
    let pageForItems;
    if (typeof archive.has_archive === "string") {
      pageForItems = await getSingleItem({
        uri: archive.has_archive,
        rest_base: "pages",
      });
    }

    const totalPages = Number(
      archiveItemsRequest.headers.get("X-WP-TotalPages") || 1
    );
    const totalItems = Number(
      archiveItemsRequest.headers.get("X-WP-Total") || 0
    );
    const hasNextPage = Number(totalPages) > Number(pageNumber || 1);

    let prevPage;
    if (pageNumber) {
      if (pageNumber > 1) {
        prevPage = `/${archive.has_archive}/${pageNumber - 1}`;
      }
      if (pageNumber === 2) {
        prevPage = `/${archive.has_archive}`;
      }
    }

    const nextPage = hasNextPage
      ? `/${archive.has_archive}/${Number(pageNumber || 1) + 1}`
      : undefined;

    const currentPage = Number(pageNumber || 1);

    const data: ArchivePageData = {
      items,

      page: pageForItems?.data,
      prevPage,
      nextPage,
      totalPages,
      totalItems,
      currentPage,
    };

    if (archive.rest_base === "posts") {
      data.posts = items;
      const result = { data, archive };
      return result;
    }

    if (archive.labels?.plural_name) {
      const pluralName = toCamel(archive.labels.plural_name);
      data[pluralName] = items;

      const result = { data, archive };
      return result;
    }
    if (archive.labels?.name) {
      const pluralName = toCamel(archive.labels.name);
      data[pluralName] = items;

      const result = { data, archive };
      return result;
    }

    return { data, archive };
  } catch (err: any) {
    throw new Error(`Error fetching archive page: ${err.message}`);
  }
}

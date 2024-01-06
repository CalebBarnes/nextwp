import type { SearchParams } from "../../components/wordpress-template";
import type { WpPage } from "../../types";
import { toCamel } from "../../utils/to-camel";
import type { PostType } from "../get-post-types";
import { getSiteSettings } from "../get-site-settings";
import { getSingleItem } from "../get-single-item";

export type ArchivePageData = {
  items: WpPage[];
  page?: WpPage;
  prevPage?: number;
  nextPage?: number;
  totalPages?: number;
  totalItems?: number;
  currentPage?: number;
  [x: string]: any;
};

export async function getArchivePage({
  archive,
  searchParams,
}: {
  archive: PostType;
  searchParams?: SearchParams;
}): Promise<{
  data?: ArchivePageData;
  archive?: PostType;
}> {
  const settings = await getSiteSettings();

  const params = {
    per_page: String(settings.posts_per_page || 10),
    _embed: "true",
    acf_format: "standard",
    page: String(searchParams?.page || "1"),
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
        slug: archive.has_archive,
        postTypeRestBase: "pages",
      });
    }

    const totalPages = Number(
      archiveItemsRequest.headers.get("X-WP-TotalPages") || 1
    );
    const totalItems = Number(
      archiveItemsRequest.headers.get("X-WP-Total") || 0
    );
    const hasNextPage = Number(totalPages) > Number(searchParams?.page || 1);

    const prevPage =
      Number(searchParams?.page || 1) > 1
        ? Number(searchParams?.page || 1) - 1
        : undefined;

    const nextPage = hasNextPage
      ? Number(searchParams?.page || 1) + 1
      : undefined;

    const currentPage = Number(searchParams?.page || 1);

    const data: ArchivePageData = {
      items,

      page: pageForItems,
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

    return { data, archive };
  } catch (err: any) {
    throw new Error(`Error fetching archive page: ${err.message}`);
  }
}

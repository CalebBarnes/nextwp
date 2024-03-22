/* eslint-disable no-await-in-loop -- maybe better to fetch one at a time to avoid rate limits? todo: consider changing this to use Promise.all to start all fetches at same time */

import type { WpPage } from "../../types";
import { getPostTypes } from "../get-post-types";
import { getSiteSettings } from "../get-site-settings";
import type { Taxonomy } from "../get-taxonomies";
import type { WpTerm } from "./get-term";
import { getTerm } from "./get-term";

export type TaxonomyPage = {
  data?: TaxonomyPageData;
  taxonomy?: Taxonomy;
  term?: WpTerm;
};

export type TaxonomyPageData = {
  items?: WpPage[];
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
};

export async function getTaxonomyPage({
  uri,
  taxonomy,
  pageNumber,
}: {
  uri: string;
  taxonomy: Taxonomy;
  pageNumber?: number;
}): Promise<TaxonomyPage> {
  const settings = await getSiteSettings();
  const postTypes = await getPostTypes();

  const isTerm = uri.includes("/"); // todo: handle non term taxonomies (/category , this would list all categories)
  let termSlug;
  if (isTerm) {
    if (taxonomy.slug === "post_tag") {
      termSlug = uri.replace("tag/", "");
    } else {
      termSlug = uri.replace(`${taxonomy.slug}/`, "");
    }
  }

  let data;
  if (termSlug) {
    const term = await getTerm({
      termSlug,
      rest_base: taxonomy.rest_base,
    });

    if (!term) {
      return {};
    }
    // should we even handle multiple post types per taxonomy? how would we handle the pagination?
    // maybe just grab the first one? or we would need to come up with some name space for each post type?
    for (const taxPostType of taxonomy.types) {
      const postType = postTypes[taxPostType];
      const params: Record<string, string> = {
        per_page: String(settings.posts_per_page || 10),
        _embed: "true",
        acf_format: "standard",
        page: String(pageNumber || "1"),
      };

      if (taxonomy.slug === "category") {
        params.categories = String(term.id);
      } else if (taxonomy.slug === "post_tag") {
        params.tags = String(term.id);
      } else {
        params[taxonomy.slug] = String(term.id);
      }

      const currentPageQueryString = new URLSearchParams(params).toString();
      const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${postType?.rest_base}?${currentPageQueryString}`;

      const termItemsRequest = await fetch(endpoint);
      try {
        const items = (await termItemsRequest.json()) as WpPage[];
        const totalPages = Number(
          termItemsRequest.headers.get("X-WP-TotalPages") || 1
        );
        const totalItems = Number(
          termItemsRequest.headers.get("X-WP-Total") || 0
        );
        const hasNextPage = Number(totalPages) > Number(pageNumber || 1);

        let prevPage;
        if (pageNumber) {
          if (pageNumber > 1) {
            prevPage = `/${uri}/${pageNumber - 1}`;
          }
          if (pageNumber === 2) {
            prevPage = `/${uri}`;
          }
        }

        const nextPage = hasNextPage
          ? `/${uri}/${Number(pageNumber || 1) + 1}`
          : undefined;

        const currentPage = Number(pageNumber || 1);

        data = {
          items,
          prevPage,
          nextPage,
          totalPages,
          totalItems,
          currentPage,
        };
      } catch (err: any) {
        throw new Error(
          `Error fetching taxonomy page for "${uri}": ${err.message}`
        );
      }
    }

    return { data, taxonomy, term };
  }
  return {
    data: undefined,
    taxonomy,
    term: undefined,
  };
}

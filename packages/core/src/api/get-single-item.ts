import { draftMode } from "next/headers";
import type { WpPage } from "../types";

/**
 * Fetches a single item from WordPress based on the uri, id, or slug.
 * @see https://www.nextwp.org/packages/nextwp/core/functions#get-single-item
 */
export const getSingleItem = async ({
  uri,
  id,
  slug,
  postTypeRestBase,
}: {
  uri?: string;
  id?: string | number;
  slug?: string;
  postTypeRestBase: string;
}): Promise<WpPage | undefined> => {
  const params: Record<string, string> = {
    acf_format: "standard", // includes ACF data in the response
    _embed: "true", // includes embedded data in the response like (featured image, author, etc.)
  };

  const preview = draftMode();
  let headers;
  if (preview.isEnabled) {
    headers = {
      Authorization: `Basic ${btoa(process.env.WP_APPLICATION_PASSWORD!)}`, // allows previewing private posts
    };
    params.status = "any"; // allows previewing of drafts and pending posts
  }

  if (id) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${postTypeRestBase}/${id}?${queryString}`;
    const req = await fetch(endpoint, {
      headers,
    });

    try {
      const data = (await req.json()) as WpPage | { code?: string } | undefined;

      if (data && "id" in data) {
        return data;
      }
      return undefined;
    } catch (err: any) {
      throw new Error(
        `Error fetching from endpoint: ${endpoint}
Error Message: ${err.message}`
      );
    }
  }

  if (slug) {
    params.slug = slug;
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${postTypeRestBase}?${queryString}`;
    const req = await fetch(endpoint, {
      headers,
    });

    try {
      type WpItemsResponse = WpPage[] | { code?: string } | undefined;
      const data = (await req.json()) as WpItemsResponse;

      if (uri && Array.isArray(data) && data.length > 1) {
        // if there are multiple items with the same slug, find the one that matches the uri
        const matchedItem = data.find((item: WpPage) => {
          const itemPath = item.link?.replace(
            process.env.NEXT_PUBLIC_WP_URL!,
            ""
          );
          return itemPath === `/${uri}/`;
        });

        return matchedItem || data[0];
      }

      if (Array.isArray(data)) {
        return data[0];
      }
      return undefined;
    } catch (err: any) {
      throw new Error(
        `Error fetching from endpoint: ${endpoint}
Error Message: ${err.message}`
      );
    }
  }
};

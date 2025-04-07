import { draftMode } from "next/headers";
import type { WpPage } from "../types";
import { getPreviewData } from "./get-page-data/get-preview-data";

type SingleItem =
  | {
      /**
       * The single page/post/custom returned from the WP REST API.
       */
      data?: WpPage;
      /**
       * The preview data returned from the WP REST API for the single page/post/custom.
       */
      previewData?: WpPage;
    }
  | undefined;

type GetSingleItemParams =
  | { uri: string; id?: never; rest_base: string }
  | { uri?: never; id: string | number; rest_base: string };

/**
 * Fetches a single item from WordPress based on the uri, id, or slug.
 * @see https://www.nextwp.org/packages/nextwp/core/functions#get-single-item
 */
export const getSingleItem = async ({
  uri,
  id,
  rest_base,
}: GetSingleItemParams): Promise<SingleItem> => {
  const params: Record<string, string> = {
    acf_format: "standard", // includes ACF data in the response
    _embed: "true", // includes embedded data in the response like (featured image, author, etc.)
  };

  // const preview = draftMode();
  const { isEnabled } = await draftMode();
  let headers;
  if (isEnabled) {
    headers = {
      Authorization: `Basic ${btoa(process.env.WP_APPLICATION_PASSWORD!)}`, // allows previewing private posts
    };
    params.status = "any"; // allows previewing of drafts and pending posts
  }

  if (id) {
    return getNodeById({
      id,
      rest_base,
      params,
      headers,
    });
  }

  if (uri) {
    return getNodeByUri({
      uri,
      rest_base,
      params,
      headers,
    });
  }
};

async function getNodeById({
  id,
  rest_base,
  params,
  headers,
}: {
  id: string | number;
  rest_base: string;
  params: Record<string, string>;
  headers?: Record<string, string>;
}) {
  // const preview = draftMode();
  const { isEnabled } = await draftMode();
  const queryString = new URLSearchParams({
    ...params,
    status: isEnabled ? "any" : "publish", // allow previewing of non published posts
  }).toString();

  const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}/${id}?${queryString}`;
  const req = await fetch(endpoint, {
    headers,
  });

  try {
    const data = (await req.json()) as WpPage | { code?: string } | undefined;
    if (data && "id" in data) {
      if (isEnabled) {
        const previewData = await getPreviewData({
          id: data.id,
          rest_base,
        });

        return { data, previewData };
      }

      return { data };
    }
  } catch (err: any) {
    throw new Error(
      `Error fetching from endpoint: ${endpoint}
Error Message: ${err.message}`
    );
  }
}

async function getNodeByUri({
  uri,
  rest_base,
  params,
  headers,
}: {
  uri: string;
  rest_base: string;
  params: Record<string, string>;
  headers?: Record<string, string>;
}) {
  // const preview = draftMode();
  const { isEnabled } = await draftMode();
  const slug = uri.split("/").slice(-1).toString();
  const queryString = new URLSearchParams({
    ...params,
    slug,
    status: isEnabled ? "any" : "publish", // allow previewing of non published posts
  }).toString();

  const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}?${queryString}`;
  const req = await fetch(endpoint, {
    headers,
  });

  let node: WpPage | undefined;

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

      node = matchedItem || data[0];
    } else if (Array.isArray(data) && data[0]) {
      node = data[0];
    }
  } catch (err: any) {
    throw new Error(
      `Error fetching from endpoint: ${endpoint}
Error Message: ${err.message}`
    );
  }

  if (isEnabled && node) {
    const previewData = await getPreviewData({
      id: node.id,
      rest_base,
    });

    return { data: node, previewData };
  }

  if (!node) {
    return;
  }

  return { data: node };
}

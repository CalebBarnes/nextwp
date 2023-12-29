import type { WpImage } from "../types";

/**
 * Get the featured image for a page/post/custom item
 */
export function getFeaturedImage(data: any): WpImage | undefined {
  if (data._embedded?.["wp:featuredmedia"]?.[0]?.source_url) {
    return {
      alt: data._embedded?.["wp:featuredmedia"]?.[0]?.alt_text,
      height: data._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.height,
      url: data._embedded?.["wp:featuredmedia"]?.[0]?.source_url,
      width: data._embedded?.["wp:featuredmedia"]?.[0]?.media_details?.width,
    };
  }

  if (data?.["wp:featuredmedia"]?.[0]?.source_url) {
    return {
      alt: data?.["wp:featuredmedia"]?.[0]?.alt_text,
      height: data?.["wp:featuredmedia"]?.[0]?.media_details?.height,
      url: data?.["wp:featuredmedia"]?.[0]?.source_url,
      width: data?.["wp:featuredmedia"]?.[0]?.media_details?.width,
    };
  }

  if (data?.source_url) {
    return {
      alt: data?.alt_text,
      height: data?.media_details?.height,
      url: data?.source_url,
      width: data?.media_details?.width,
    };
  }
}

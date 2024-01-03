import type { WpMediaItem } from "../types";
import { getSiteSettings } from "./get-site-settings";

/**
 * Get the site icon from WordPress.
 * @see https://www.nextwp.org/packages/nextwp/core/functions#get-site-icon
 */
export async function getSiteIcon(): Promise<WpMediaItem> {
  const settings = await getSiteSettings();

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/media/${settings.site_icon}`
  );

  const data = (await req.json()) as WpMediaItem;

  return data;
}

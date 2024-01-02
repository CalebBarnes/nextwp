import type { WpMediaItem } from "../types";
import { getSiteSettings } from "./get-site-settings";

export async function getSiteIcon(): Promise<WpMediaItem> {
  const settings = await getSiteSettings();

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/media/${settings.site_icon}`
  );

  const data = (await req.json()) as WpMediaItem;

  return data;
}

import type { WpMediaObject } from "../types";
import { getSiteSettings } from "./get-site-settings";

export async function getSiteLogo(): Promise<WpMediaObject> {
  const settings = await getSiteSettings();

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/media/${settings.site_logo}`
  );

  const data = (await req.json()) as WpMediaObject;

  return data;
}

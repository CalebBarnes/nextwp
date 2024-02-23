import { getSingleItem } from "../get-single-item";
import { getSiteSettings } from "../get-site-settings";

export async function getFrontPage() {
  const settings = await getSiteSettings();
  const rest_base = "pages";

  if (!settings.page_on_front) {
    return;
  }

  return getSingleItem({
    id: settings.page_on_front,
    rest_base,
  });
}

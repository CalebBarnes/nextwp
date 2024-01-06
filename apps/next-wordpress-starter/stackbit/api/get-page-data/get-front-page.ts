import { draftMode } from "next/headers";
import type { WpPage } from "../../types";
import { getSingleItem } from "../get-single-item";
import { getSiteSettings } from "../get-site-settings";
import { getPreviewData } from "./get-preview-data";

export async function getFrontPage(): Promise<{
  /**
   * The data is the page data for the front page.
   */
  data?: WpPage;
  /**
   * The previewData is the preview data for the front page.
   */
  previewData?: WpPage;
}> {
  const preview = draftMode();
  const settings = await getSiteSettings();
  const postTypeRestBase = "pages";

  const data = await getSingleItem({
    id: settings.page_on_front,
    postTypeRestBase,
  });

  if (preview.isEnabled && data?.id) {
    const previewData = await getPreviewData({
      id: data.id,
      postTypeRestBase,
    });

    return { data, previewData };
  }
  return { data };
}

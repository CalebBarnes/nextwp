// import { draftMode } from "next/headers";
import type { WpPage, WpRevision } from "../../types";
import { getSingleItem } from "../get-single-item";
import { getSiteSettings } from "../get-site-settings";
// import { getPreviewData } from "./get-preview-data";

export async function getFrontPage(): Promise<
  | {
      /**
       * The data is the page data for the front page.
       */
      data?: WpPage;
      /**
       * The previewData is the preview data for the front page.
       */
      previewData?: WpRevision;
    }
  | undefined
> {
  // const preview = draftMode();
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

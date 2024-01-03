import { ImageResponse } from "next/og";
import { getSiteIcon } from "../api/get-site-icon";
import type { WpMediaItem } from "../types";
import { getRandomEmoji } from "./icon";

/**
 * This component is used in the `src/app/apple-icon.tsx` file to generate the Apple touch Icon for your site,
 * based on the site icon set in WordPress appearance \> site identity settings.
 *
 * Read the docs page for more info.
 * @see https://www.nextwp.org/packages/nextwp/core/components#apple-icon
 * @example
 * ```tsx
 * // src/app/apple-icon.tsx
 * export { AppleIcon as default } from '@nextwp/core';
 * export const runtime = 'edge';
 * export const contentType = 'image/png';
 * export const sizes = {
 *     width: 180,
 *     height: 180,
 * };
 * ```
 */
export async function AppleIcon() {
  const wpSiteIcon: WpMediaItem = await getSiteIcon();
  const iconSourceUrl =
    wpSiteIcon.media_details?.sizes?.["site_icon-180"]?.source_url;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: iconSourceUrl ? "transparent" : "black",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
        }}
      >
        {iconSourceUrl ? (
          // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text -- using normal img for og image response icon generation
          <img src={iconSourceUrl} />
        ) : (
          getRandomEmoji()
        )}
      </div>
    ),
    {
      // For convenience, we can re-use the exported icons size metadata
      // config to also set the ImageResponse's width and height.
      width: 180,
      height: 180,
    }
  );
}

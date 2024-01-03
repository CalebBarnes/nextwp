import { ImageResponse } from "next/og";
import { getSiteIcon } from "../api/get-site-icon";
import type { WpMediaItem } from "../types";

/**
 * This component is used in the `src/app/icon.tsx` file to generate a favicon for your site,
 * based on the site icon set in WordPress appearance \> site identity settings.
 *
 * Read the docs page for more info.
 * @see https://www.nextwp.org/packages/nextwp/core/components#icon
 * @example
 * ```tsx
 * // src/app/icon.tsx
 * export { Icon as default } from '@nextwp/core';
 * export const runtime = 'edge';
 * export const contentType = 'image/png';
 * export const sizes = {
 *     width: 32,
 *     height: 32,
 * };
 * ```
 */
export async function Icon() {
  const wpSiteIcon: WpMediaItem = await getSiteIcon();
  const iconSourceUrl =
    wpSiteIcon.media_details?.sizes?.["site_icon-32"]?.source_url;

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
      width: 32,
      height: 32,
    }
  );
}

export function getRandomEmoji() {
  const emojis = [
    "⚡️",
    "🚀",
    "🍪",
    "🤙",
    "🎉",
    "🍑",
    "🔥",
    "🌈",
    "🌞",
    "🌚",
    "🌎",
    "🪐",
    "💫",
    "⭐️",
    "🌟",
    "✨",
    "⚡️",
    "💥",
  ];

  const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
  return randomEmoji;
}

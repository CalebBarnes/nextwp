import { ImageResponse } from "next/og";
import { getSiteIcon } from "../api/get-site-icon";
import type { WpMediaObject } from "../types";

export async function Icon() {
  const wpSiteIcon: WpMediaObject = await getSiteIcon();
  const iconSourceUrl =
    wpSiteIcon?.media_details?.sizes?.["site_icon-32"]?.source_url;

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

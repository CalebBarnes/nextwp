import { ImageResponse } from "next/og";
import { getSiteIcon } from "../api/get-site-icon";
import type { WpMediaObject } from "../types";
import { getRandomEmoji } from "./icon";

export async function AppleIcon() {
  const wpSiteIcon: WpMediaObject = await getSiteIcon();
  const iconSourceUrl =
    wpSiteIcon?.media_details?.sizes?.["site_icon-180"]?.source_url;

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

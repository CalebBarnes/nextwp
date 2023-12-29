import type {
  WpImage,
  // WpLink
} from "@nextwp/core/src/types";
// import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
// import Button from "../ui/button";

export function TextImage({
  text,
  image,
  // button,
  reverse,
  hideBottomBorder,
}: {
  text?: string;
  // button?: WpLink;
  image?: WpImage;
  reverse?: boolean;
  hideBottomBorder?: boolean;
}) {
  return (
    <div
      className={cn(
        "edges sm:py-24 md:py-32 grid md:grid-cols-2 lg:gap-x-32 sm:gap-y-20 gap-y-10 gap-x-20 py-16 ",
        hideBottomBorder ? "" : "border-b"
      )}
    >
      <div className={cn(reverse ? "order-1" : null)}>
        {text ? (
          <div className="mb-10" dangerouslySetInnerHTML={{ __html: text }} />
        ) : null}

        {/* {button?.url ? (
          <Button asChild>
            <Link
              dangerouslySetInnerHTML={{ __html: button.title || "" }}
              href={button.url}
              target={button.target}
            />
          </Button>
        ) : null} */}
      </div>

      <div>
        {image?.url ? (
          <Image
            alt={image.alt || ""}
            height={image.height}
            src={image.url}
            width={image.width}
          />
        ) : null}
      </div>
    </div>
  );
}

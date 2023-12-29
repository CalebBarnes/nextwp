import { getMenuItems } from "@nextwp/core";
import Link from "next/link";
import { getSiteLogo } from "@nextwp/core/src/api/get-site-logo";
import { getSiteSettings } from "@nextwp/core/src/api/get-site-settings";
import type { WpMediaObject, WpSettings } from "@nextwp/core/src/types";
import Image from "next/image";
import Edges from "./edges";
import Button from "./ui/button";
import { DesktopMenu } from "./menus/desktop-menu";

export async function Navbar() {
  const menuItems = await getMenuItems({ slug: "main-menu" });
  const logo: WpMediaObject = await getSiteLogo();
  const settings: WpSettings = await getSiteSettings();

  return (
    <header className="py-4 w-full">
      <Edges className="flex justify-between items-center">
        <div className="">
          <Link href="/">
            <span className="sr-only">{settings.title}</span>
            {logo.source_url ? (
              <Image
                alt=""
                className="h-8 w-auto sm:h-10"
                height={logo.media_details?.height}
                priority
                src={logo.source_url}
                width={logo.media_details?.width}
              />
            ) : null}
          </Link>
        </div>

        <DesktopMenu menuItems={menuItems} />

        <div className="flex justify-end">
          <Button asChild>
            <Link href="/contact-us">Get started</Link>
          </Button>
        </div>
      </Edges>
    </header>
  );
}

import { generateSitemap } from "@nextwp/core";
import type { MetadataRoute } from "next/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const items = await generateSitemap({
    postTypes: ["pages", "posts"],
  });

  return items;
}

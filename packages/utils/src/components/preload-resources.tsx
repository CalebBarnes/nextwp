"use client";
import type { PreloadAs } from "react-dom";
import ReactDOM from "react-dom";

interface Resource {
  /**
   * The URL of the resource to preload.
   */
  href: string;
  /**
   * The resource type to preload as.
   * @example
   * "video"
   * <link rel="preload" href="https://example.com/video.mp4" as="video" />
   */
  as:
    | "object"
    | "audio"
    | "document"
    | "embed"
    | "fetch"
    | "font"
    | "image"
    | "track"
    | "script"
    | "style"
    | "video"
    | "worker";

  /**
   * The fetch priority of the resource.
   */
  fetchPriority?: "auto" | "high" | "low";
}

export function PreloadResources({ resources }: { resources: Resource[] }) {
  for (const resource of resources) {
    ReactDOM.preload(resource.href, {
      as: resource.as as PreloadAs,
      fetchPriority: resource.fetchPriority || "high",
    });
  }

  return null;
}

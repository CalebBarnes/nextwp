"use client";

import type { PreloadAs } from "react-dom";
import * as ReactDOM from "react-dom";

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
  as: PreloadAs;
  // as:
  //   | "object"
  //   | "audio"
  //   | "document"
  //   | "embed"
  //   | "fetch"
  //   | "font"
  //   | "image"
  //   | "track"
  //   | "script"
  //   | "style"
  //   | "video"
  //   | "worker";

  /**
   * The fetch priority of the resource.
   */
  fetchPriority?: "auto" | "high" | "low";
}

/**
 * This component uses the new ReactDOM methods for preloading resources in the page head.
 * @see https://github.com/facebook/react/pull/26237
 */
export function PreloadResources({ resources }: { resources: Resource[] }) {
  for (const resource of resources) {
    ReactDOM.preload(resource.href, {
      as: resource.as,
      fetchPriority: resource.fetchPriority || "high",
    });
  }

  return null;
}

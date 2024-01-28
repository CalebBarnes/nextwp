import type { NextWpConfig } from "@nextwp/core";

export default {
  postTypes: ["post", "page", "product"],
  pagination: {
    mode: "paged",
  },
  experimental: {
    autoReloadDev: true,
  },
} satisfies NextWpConfig;

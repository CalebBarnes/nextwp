import type { NextWpConfig } from "@nextwp/core";

export default {
  postTypes: ["post", "page", "product"],
  pagination: {
    mode: "infinite",
  },
} satisfies NextWpConfig;

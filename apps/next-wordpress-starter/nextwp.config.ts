import type { NextWpConfig } from "@nextwp/core";

export default {
  postTypes: ["posts", "pages", "product"],
  pagination: {
    mode: "paged",
  },
} satisfies NextWpConfig;

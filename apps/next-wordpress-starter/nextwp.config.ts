import { createConfig } from "@nextwp/core/src/config/create-config";

export default createConfig({
  postTypes: ["page", "post"],
  pagination: {
    mode: "paged",
  },
  templatesPath: "./src/templates",
});

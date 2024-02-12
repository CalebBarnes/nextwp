import { defineStackbitConfig } from "@stackbit/types";
import { WpContentSource } from "@nextwp/stackbit";

export default defineStackbitConfig({
  stackbitVersion: "~0.6.0",
  ssgName: "nextjs",
  nodeVersion: "18",
  contentSources: [
    new WpContentSource({
      projectId: "next-wordpress-starter",
      wpUrl: process.env.NEXT_PUBLIC_WP_URL!,
      applicationPassword: process.env.WP_APPLICATION_PASSWORD!,
      postTypes: ["pages", "posts"],
    }),
  ],
});

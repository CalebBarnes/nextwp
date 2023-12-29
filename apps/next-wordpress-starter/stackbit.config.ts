import { WpContentSource } from "./stackbit/wp-content-source";

export default {
  stackbitVersion: "~0.6.0",
  ssgName: "nextjs",
  nodeVersion: "16",
  contentSources: [
    new WpContentSource({
      projectId: "next-wordpress-starter",
      wpUrl: process.env.NEXT_PUBLIC_WP_URL!,
      wpApplicationPassword: process.env.WP_APPLICATION_PASSWORD!,
      postTypes: ["pages", "posts"],
    }),
  ],
};

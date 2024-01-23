// nextjs app functions
export { generateMetadata } from "./src/next-app-functions/generate-meta-data";
export { generateStaticParams } from "./src/next-app-functions/generate-static-params/generate-static-params";
export { generateSitemap } from "./src/next-app-functions/generate-sitemap";

// route handlers
export { revalidate } from "./src/route-handlers/revalidate";
export { preview } from "./src/route-handlers/preview";

// rest api functions
export { getSiteSettings } from "./src/api/get-site-settings";
export { getPageData } from "./src/api/get-page-data/get-page-data";
export { getMenuItems } from "./src/api/get-menu-items";
export { getSingleItem } from "./src/api/get-single-item";
export { getSiteLogo } from "./src/api/get-site-logo";
export { getSiteIcon } from "./src/api/get-site-icon";

// custom rest endpoints - registered by the 'NextWP - Toolkit' wp plugin (@nextwp/wp-plugin)
export { getOptionsPage } from "./src/api/get-options-page";

// react components
export { FlexibleContent, type Row } from "./src/components/flexible-content";
export { WordpressTemplate } from "./src/components/wordpress-template";
export { Icon } from "./src/components/icon";
export { AppleIcon } from "./src/components/apple-icon";

// utils helpers
export { getFeaturedImage } from "./src/utils/get-featured-image";
export { stripWpUrl } from "./src/utils/strip-wp-url";
export { swapWpUrl } from "./src/utils/swap-wp-url";

// types
export type {
  WpPage,
  YoastHeadJson,
  WpLink,
  WpImage,
  AcfImage,
  AcfFile,
  AcfVideo,
  WpSettings,
  WpMenuItem,
  Menu,
  WpMediaItem,
} from "./src/types";

export type { Templates, TemplateProps } from "./src/utils/get-template";

export type {
  SearchParams,
  RouteParams,
} from "./src/components/wordpress-template";

export type { WpTerm } from "./src/api/taxonomy/get-term";

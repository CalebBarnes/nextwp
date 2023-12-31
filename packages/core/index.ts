// nextjs app functions
export { generateMetadata } from "./src/next-app-functions/generate-meta-data";
export { generateStaticParams } from "./src/next-app-functions/generate-static-params";
export { generateSitemap } from "./src/next-app-functions/generate-sitemap";
export { revalidate } from "./src/next-app-functions/revalidate";

// draft mode preview route handler
export { NextWordPressPreview } from "./src/draft/draft-route-handler";

// rest api functions
export { getSiteSettings } from "./src/api/get-site-settings";
export { getPageData } from "./src/api/get-page-data/get-page-data";
export { getMenuItems } from "./src/api/get-menu-items";
export { getSingleItem } from "./src/api/get-single-item";

// custom rest endpoints - registered by the 'NextWP - Toolkit' wp plugin (@nextwp/wp-plugin)
export { getOptionsPage } from "./src/api/get-options-page";

// react components
export { FlexibleContent } from "./src/components/flexible-content";
export { WordpressTemplate } from "./src/components/wordpress-template";

// utils helpers
export { getFeaturedImage } from "./src/utils/get-featured-image";
export { stripWpUrl } from "./src/utils/strip-wp-url";
export { swapWpUrl } from "./src/utils/swap-wp-url";

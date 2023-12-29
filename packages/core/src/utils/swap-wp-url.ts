/**
 * Swap the WP URL for the site URL
 * Swapping with ENVs NEXT_PUBLIC_WP_URL for NEXT_SITE_URL
 */
export const swapWpUrl = (url: string) => {
  if (!process.env.NEXT_SITE_URL) {
    throw new Error("No NEXT_SITE_URL provided. Please set NEXT_SITE_URL env");
  }

  const newUrl = url.replace(
    process.env.NEXT_PUBLIC_WP_URL!,
    process.env.NEXT_SITE_URL!
  );

  return newUrl;
};

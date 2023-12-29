/**
 * Strip the NEXT_PUBLIC_WP_URL from the string
 */
export const stripWpUrl = (url: string) => {
  const newUrl = url.replace(process.env.NEXT_PUBLIC_WP_URL!, "");

  return newUrl;
};

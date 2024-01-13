/**
 * This function is used to get the page number from a uri
 * for archive and taxonomy pages.
 * @example
 * ```
 * const pageNumber = extractPageNumberFromUri("/blog/2");
 * // returns { uriWithoutPage: "/blog", pageNumber: 2 }
 * ```
 */
export function extractPageNumberFromUri(uri: string): {
  /**
   * This is the uri without the page number.
   */
  uriWithoutPage: string;
  /**
   * This is the page number from the uri.
   */
  pageNumber?: number;
} {
  // Regular expression to match a forward slash followed by one or more digits at the end of a string
  const pageNumber = /\/\d+$/.exec(uri)
    ? Number(uri.split("/").pop())
    : undefined;
  const uriWithoutPage = uri.replace(/\/\d+$/, "");

  return { uriWithoutPage, pageNumber };
}

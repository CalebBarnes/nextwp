import type { ArchivePageData } from "../api/get-page-data/get-archive-page";

/**
 * This function creates a proxy for the data object that will warn the user
 * if they are using the deprecated `data.items` key in an archive template.
 */
export function createDataProxy(data: ArchivePageData): any {
  return new Proxy(data, {
    get(target, property) {
      if (property === "items") {
        // eslint-disable-next-line no-console -- this is a warning for deprecated usage
        console.warn(
          `⚠️ Warning: Using 'data.items' key in archive templates is deprecated.
  Please use the posts plural_name key instead. This will usually be the plural_name of the post type, converted to camelCase.`
        );
      }
      return target[property as keyof ArchivePageData];
    },
  });
}

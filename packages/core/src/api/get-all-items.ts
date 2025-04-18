import type { Items } from "./get-items";
import { getItems } from "./get-items";
import { getPostTypes } from "./get-post-types";
/**
 * Get all items from multiple post types
 * @example
 * ```
 * const allItems = await getAllItems(["pages", "posts"]);
 * ```
 */
export async function getAllItems(postTypes: string[]): Promise<Items> {
  const actualPostTypes = await getPostTypes();

  // check if postTypes are valid
  postTypes.forEach((postType) => {
    const isPostTypeValid = Object.keys(actualPostTypes).some(
      (key) => actualPostTypes[key]?.rest_base === postType
    );

    if (!isPostTypeValid) {
      const existingPostTypes = Object.keys(actualPostTypes)
        .map((key) => actualPostTypes[key]?.rest_base)
        .join(", ");

      throw new Error(
        `Invalid post type "${postType}". Available post types are: ${existingPostTypes}`
      );
    }
  });

  let result: Items = [];

  await Promise.all(
    postTypes.map(async (postType) => {
      const items = await getItems({ restBase: postType });
      if (items.length > 0) {
        result = result.concat(items);
      }
    })
  );

  return result;
}

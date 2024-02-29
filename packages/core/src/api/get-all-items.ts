import { getArchiveStaticParams } from "../next-app-functions/generate-static-params/get-archive-static-params";
import { getTaxonomyStaticParams } from "../next-app-functions/generate-static-params/get-taxonomy-static-params";
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
      (key) => actualPostTypes[key].rest_base === postType
    );

    if (!isPostTypeValid) {
      const existingPostTypes = Object.keys(actualPostTypes)
        .map((key) => actualPostTypes[key].rest_base)
        .join(", ");

      throw new Error(
        `Invalid post type "${postType}". Available post types are: ${existingPostTypes}`
      );
    }
  });

  let result: Items = [];
  const archiveParams = await getArchiveStaticParams({ postTypes });
  const archiveMetaData = {
    modified: new Date().toISOString(), // Placeholder, consider fetching actual data
    modified_gmt: new Date().toISOString(), // Same as above
    // Add other necessary metadata fields here
  };

  // Process archive parameters to fit the required structure
  archiveParams.forEach((param) => {
    const archiveSlug = param.paths.join("/"); // Handling nested URLs
    const archiveItem = {
      id: -1, // Placeholder `id` indicating this is not a typical post item
      date: archiveMetaData.modified,
      date_gmt: archiveMetaData.modified_gmt,
      guid: { rendered: `${process.env.NEXT_PUBLIC_WP_URL}/${archiveSlug}` },
      modified: archiveMetaData.modified,
      modified_gmt: archiveMetaData.modified_gmt,
      slug: archiveSlug,
      status: "publish",
      type: "archive",
      link: `${process.env.NEXT_PUBLIC_WP_URL}/${archiveSlug}`,
      title: { rendered: archiveSlug.split("/").pop() ?? "Archive" }, // Default title if split yields undefined
      path: `/${archiveSlug}`,
    };
    result.push(archiveItem);
  });

  const taxonomyParams = await getTaxonomyStaticParams({ postTypes });

  // Process taxonomy parameters to fit the required structure
  taxonomyParams.forEach((param) => {
    const taxonomySlug = param.paths.join("/"); // Handling nested URLs
    const taxonomyItem = {
      id: -1, // Placeholder `id` indicating this is not a typical post item
      date: archiveMetaData.modified,
      date_gmt: archiveMetaData.modified_gmt,
      guid: { rendered: `${process.env.NEXT_PUBLIC_WP_URL}/${taxonomySlug}` },
      modified: archiveMetaData.modified,
      modified_gmt: archiveMetaData.modified_gmt,
      slug: taxonomySlug,
      status: "publish",
      type: "taxonomy",
      link: `${process.env.NEXT_PUBLIC_WP_URL}/${taxonomySlug}`,
      title: { rendered: taxonomySlug.split("/").pop() ?? "Taxonomy" }, // Default title if split yields undefined
      path: `/${taxonomySlug}`,
    };
    result.push(taxonomyItem);
  });

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

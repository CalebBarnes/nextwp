import type { Items } from "./get-items";
import { getItems } from "./get-items";
import { getPostTypes } from "./get-post-types";
import { getTaxonomies } from "./get-taxonomies";
import { getAllTermsForTaxonomy } from "./taxonomy/get-all-taxonomy-terms";

export async function getAllItems(postTypes: string[]): Promise<Items> {
  const actualPostTypes = await getPostTypes();
  const taxonomies = await getTaxonomies();

  console.log(actualPostTypes);
  // Validate postTypes
  postTypes.forEach((postType) => {
    if (
      !Object.keys(actualPostTypes).some(
        (key) => actualPostTypes[key].rest_base === postType
      )
    ) {
      throw new Error(`Invalid post type "${postType}".`);
    }
  });

  let result: Items = [];

  // Fetch items for each postType in parallel
  const postTypeItemsPromises = postTypes.map((postType) =>
    getItems({ restBase: postType })
  );

  const postTypeItems = await Promise.all(postTypeItemsPromises);

  result = result.concat(...postTypeItems);

  // Process each taxonomy to fetch terms if associated with the postTypes
  const taxonomyTermsPromises = postTypes.flatMap((postType) =>
    Object.values(taxonomies).map(async (taxonomy) => {
      // Adjust postType for singular/plural check
      const isSingularMatch = taxonomy.types.includes(postType);
      const singularPostType = postType.endsWith("s")
        ? postType.slice(0, -1)
        : postType;
      const isPluralMatch = taxonomy.types.includes(singularPostType);

      if (isSingularMatch || isPluralMatch) {
        const terms = await getAllTermsForTaxonomy(taxonomy.rest_base);
        return terms.map((term) => ({
          id: -1, // Placeholder value indicating it's not a real ID
          slug: `${term.slug}`, // Use the term's slug
          path: `/${taxonomy.rest_base}/${term.slug}/`,
          link: `${process.env.NEXT_SITE_URL}/${taxonomy.rest_base}/${term.slug}/`, // Constructed link as a placeholder
          modified_gmt: new Date().toISOString(),
        }));
      }
      return [];
    })
  );

  const taxonomyTermsResults = await Promise.all(taxonomyTermsPromises.flat());

  result = result.concat(...taxonomyTermsResults);

  return result;
}

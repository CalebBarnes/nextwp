export type Taxonomy = {
  name: string;
  slug: string;
  /**
   * The base path for this taxonomy's REST API endpoint.
   */
  rest_base: string;
  types: string[];
};

export async function getTaxonomies(): Promise<{
  category: Taxonomy;
  post_tag: Taxonomy;

  /**
   * Custom post types, created by plugins and themes like CPT UI and ACF.
   */
  [taxType: string]: Taxonomy;
}> {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/taxonomies`
  );

  try {
    const data = await req.json();
    return data;
  } catch (err) {
    throw new Error(`getTaxonomies: Error fetching taxonomies: ${err.message}`);
  }
}

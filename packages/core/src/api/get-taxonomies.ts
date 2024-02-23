import type { ErrorResponse } from "./common-api-response-types";

export type Taxonomy = {
  name: string;
  slug: string;
  description: string;
  types: string[];
  hierarchical: boolean;
  rest_base: string;
  rest_namespace: string;
  _links: {
    collection: { href: string }[];
    "wp:items": { href: string }[];
    curies: { name: string; href: string; templated: boolean }[];
  };
};

export type TaxonomiesResponse = {
  category: Taxonomy;
  post_tag: Taxonomy;
  // Index signature for custom taxonomies
  [key: string]: Taxonomy;
};

export async function getTaxonomies({
  wpUrl,
}: {
  /**
   * The WordPress site URL.
   *
   * Defaults to `process.env.NEXT_PUBLIC_WP_URL`.
   */
  wpUrl?: string;
} = {}): Promise<TaxonomiesResponse> {
  const req = await fetch(
    `${wpUrl || process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/taxonomies`
  );

  try {
    const data = (await req.json()) as TaxonomiesResponse | ErrorResponse;
    if ("code" in data && "message" in data) {
      throw new Error(
        `getTaxonomies: Error fetching taxonomies: ${data.message as string}`
      );
    }
    return data;
  } catch (err: any) {
    throw new Error(`getTaxonomies: Error fetching taxonomies: ${err.message}`);
  }
}

import type { WpTerm } from "./get-term";

export async function getAllTermsForTaxonomy(
  rest_base: string
): Promise<WpTerm[]> {
  const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}`;
  const response = await fetch(endpoint);
  if (!response.ok) {
    throw new Error(`Failed to fetch terms for taxonomy: ${rest_base}`);
  }
  return response.json();
}

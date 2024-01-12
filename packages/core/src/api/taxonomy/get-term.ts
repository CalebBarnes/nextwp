export interface WpTerm {
  id?: number;
  count?: number;
  description?: string;
  link?: string;
  name?: string;
  slug?: string;
  taxonomy?: string;
  meta?: any[];
  _links?: {
    self?: any[]; // Replace 'any' with a more specific type if available
    collection?: any[]; // Same as above
    about?: any[]; // Same as above
    "wp:post_type"?: any[]; // Same as above
    curies?: any[]; // Same as above
  };
}

type WpTermsResponse = WpTerm[] | { code?: string } | undefined;

export async function getTerm({
  termSlug,
  rest_base,
}: {
  termSlug: string;
  rest_base: string;
}) {
  const params: Record<string, string> = {
    acf_format: "standard", // includes ACF data in the response
    _embed: "true", // includes embedded data in the response like (featured image, author, etc.)
    slug: termSlug,
  };

  const queryString = new URLSearchParams(params).toString();
  const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}?${queryString}`;
  const req = await fetch(endpoint);

  try {
    const data = (await req.json()) as WpTermsResponse;
    if (Array.isArray(data) && data[0]) {
      return data[0];
    }
  } catch (err: any) {
    throw new Error(
      `Error fetching term from endpoint: ${endpoint}
Error Message: ${err.message}`
    );
  }
}

export async function getTermNode({
  termSlug,
  rest_base,
}: {
  termSlug: string;
  rest_base: string;
}) {
  const params: Record<string, string> = {
    // acf_format: "standard", // includes ACF data in the response
    // _embed: "true", // includes embedded data in the response like (featured image, author, etc.)
    slug: termSlug,
  };

  const queryString = new URLSearchParams(params).toString();
  const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}?${queryString}`;
  console.log("endpoint", endpoint);
  const req = await fetch(endpoint);

  try {
    const data = await req.json();
    return data;
  } catch (err: any) {
    throw new Error(
      `Error fetching term from endpoint: ${endpoint}
Error Message: ${err.message}`
    );
  }
}

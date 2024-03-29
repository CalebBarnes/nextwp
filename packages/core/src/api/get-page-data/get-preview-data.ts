import type { WpRevision } from "../../types";

export async function getPreviewData({
  id,
  rest_base,
}: {
  id: number;
  rest_base: string;
}) {
  const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}/${id}/revisions?acf_format=standard&_embed`;
  const req = await fetch(endpoint, {
    headers: {
      Authorization: `Basic ${btoa(process.env.WP_APPLICATION_PASSWORD!)}`,
    },
  });
  try {
    const revisions = (await req.json()) as WpRevision[];
    return revisions[0];
  } catch (err: any) {
    throw new Error(
      `Error fetching preview data for ${endpoint}: ${err.message}`
    );
  }
}

import type { Metadata } from "next";
import { getSiteSettings } from "../api/get-site-settings";
import { getPageData } from "../api/get-page-data/get-page-data";
import { swapWpUrl } from "../utils/swap-wp-url";
/**
 * The generateMetadata function can be exported from your Next.js page.js and used to generate metadata for your page.
 * This function uses the yoast_head_json field from the WordPress REST API to generate the metadata.
 * The WordPress plugin YoastSEO is required for this to work.
 * @see https://nextjs.org/docs/app/api-reference/functions/generate-metadata
 */

interface GenerateMetadataParams {
  params?: {
    paths?: string[];
  };
  wpUrl: string;
}
export async function generateMetadata({
  params,
  wpUrl = process.env.NEXT_PUBLIC_WP_URL || "",
}: GenerateMetadataParams): Promise<Metadata> {
  if (!wpUrl) {
    throw new Error(
      "No wpUrl provided. Please set NEXT_PUBLIC_WP_URL env or pass wpUrl to generateMetadata"
    );
  }

  if (!process.env.WP_APPLICATION_PASSWORD) {
    throw new Error(`'WP_APPLICATION_PASSWORD' environment variable is required for function 'generateMetaData'.

Check your ${
      process.env.NODE_ENV === "development"
        ? "local .env file"
        : "deployment's environment variables."
    }.

You can generate an application password in your WordPress admin under Users > Your Profile > Application Passwords.
Make sure the user has the required permissions to view site settings.

${
  process.env.NEXT_PUBLIC_WP_URL
    ? `See ${process.env.NEXT_PUBLIC_WP_URL}/wp-admin/profile.php#application-passwords-section`
    : ""
}`);
  }

  const uri = params?.paths?.join("/") || "/";
  const siteSettings = await getSiteSettings();
  const { data, archive } = await getPageData(uri);

  const yoast =
    data?.yoast_head_json || // seo data for single items (pages,posts,custom post type singles)
    data?.page?.yoast_head_json || //  seo data for the page with matching slug to the archive (example, there is a page with slug "all-movies", and a movie post type with archive slug of "all-movies")
    archive?.yoast_head_json; // seo data for the archive, if there is not a page with the same slug as the archive slug it will fallback to this

  return {
    generator: "nextwp.org",
    applicationName: decodeHtmlEntities(siteSettings.title),
    metadataBase: new URL(process.env.NEXT_PUBLIC_WP_URL || "http://localhost"),
    title: decodeHtmlEntities(yoast?.title),
    description: decodeHtmlEntities(yoast?.og_description),

    openGraph: {
      title: decodeHtmlEntities(yoast?.og_title),
      description: decodeHtmlEntities(yoast?.og_description),
      siteName: decodeHtmlEntities(yoast?.og_site_name),
      locale: yoast?.og_locale,
      url: swapWpUrl(yoast?.og_url ?? ""),
      images: yoast?.og_image ? yoast.og_image.map((ogImg) => ogImg.url) : [],
    },

    twitter: {
      card: yoast?.twitter_card,
      images: yoast?.twitter_image,
    },
  } as Metadata;
}

function decodeHtmlEntities(str?: string): string {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

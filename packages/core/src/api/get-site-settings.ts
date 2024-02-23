import type { ErrorResponse } from "./common-api-response-types";
import { getAuthHeaders } from "./get-auth-headers";

export interface WpSettings {
  /**
   * The site title
   */
  title?: string;
  /**
   * The site tagline
   */
  description?: string;
  /**
   * The URL of the WordPress site
   */
  url?: string;
  /**
   * The number of posts to show per page on archive pages
   */
  posts_per_page?: number;
  /**
   * The ID of the page for the front page
   */
  page_on_front?: number;
  /**
   * The ID of the page for the blog posts archive
   */
  page_for_posts?: number;
  /**
   * The ID of the WpMediaItem for the site logo added in the appearance customizer
   */
  site_logo?: number;
  /**
   * The ID of the WpMediaItem for the site icon added in the appearance customizer
   */
  site_icon?: number;
  /**
   * The email address for the admin user
   */
  email?: string;
  timezone?: string;
  date_format?: string;
  time_format?: string;
  start_of_week?: number;
  language?: string;
  use_smilies?: boolean;
  default_category?: number;
  default_post_format?: string;
  show_on_front?: string;
  default_ping_status?: string;
  default_comment_status?: string;
}

/**
 * Fetches site settings from WordPress.
 * @see https://www.nextwp.org/packages/nextwp/core/functions#get-site-settings
 */
export async function getSiteSettings(): Promise<WpSettings> {
  handleRequiredEnvs();

  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/settings?embed=true`,
      {
        headers: getAuthHeaders(),
      }
    );

    const data = (await req.json()) as WpSettings | ErrorResponse;

    if ("code" in data && "message" in data) {
      if (data.code.includes("rest_forbidden")) {
        throw new Error(
          `User for provided 'WP_APPLICATION_PASSWORD' does not have permission to view site settings.
  Check that the user has the required permissions. Administrator role is recommended.
  
  You can generate an application password in your WordPress admin under Users > Your Profile > Application Passwords.
  
  ${
    process.env.NEXT_PUBLIC_WP_URL
      ? `See ${process.env.NEXT_PUBLIC_WP_URL}/wp-admin/profile.php#application-passwords-section`
      : ""
  }
  
  Response from WP: ${data.message}`
        );
      }
      throw new Error(data.message);
    }

    return data;
  } catch (err: any) {
    throw new Error(
      `Error fetching site settings from WordPress. ${process.env.NEXT_PUBLIC_WP_URL}\n Make sure the URL is correct and the WordPress REST API is enabled.\n\n${err}`
    );
  }
}

function handleRequiredEnvs() {
  if (!process.env.WP_APPLICATION_PASSWORD) {
    throw new Error(`'WP_APPLICATION_PASSWORD' environment variable is required for function 'getSiteSettings'.
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
}

`);
  }
}

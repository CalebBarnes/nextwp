import type { WpSettings } from "../types";
import { getAuthHeaders } from "./get-auth-headers";

type WpSettingsResponse = {
  code?: string;
  message?: string;
} & WpSettings;

/**
 * Fetches site settings from WordPress.
 * @see https://www.nextwp.org/packages/nextwp/core/functions#get-site-settings
 */
export async function getSiteSettings({
  wpUrl,
  applicationPassword,
}: {
  wpUrl?: string;
  applicationPassword?: string;
}): Promise<WpSettings> {
  handleRequiredEnvs();

  try {
    const req = await fetch(
      `${
        wpUrl || process.env.NEXT_PUBLIC_WP_URL
      }/wp-json/wp/v2/settings?embed=true`,
      {
        headers: applicationPassword
          ? {
              Authorization: `Basic ${btoa(applicationPassword)}`,
            }
          : getAuthHeaders(),
      }
    );

    const data = (await req.json()) as WpSettingsResponse;

    if (data.code?.includes("rest_forbidden")) {
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

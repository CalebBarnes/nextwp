import { getAuthHeaders } from "./get-auth-headers";

type OptionsPageResponse = {
  code?: string;
  message?: string;
  [key: string]: any;
};

/**
 * Get an options page from WordPress.
 * This function requires the 'NextWP Toolkit' plugin to be installed and activated on your WordPress site.
 * The user for the 'WP_APPLICATION_PASSWORD' environment variable must also have administrator permissions.
 *
 * @example
 * ```ts
 * const options = await getOptionsPage({ slug: "theme-options" });
 * ```
 *
 * @see https://www.nextwp.org/packages/nextwp/core/functions#get-options-page
 */
export async function getOptionsPage(
  args: {
    /**
     * The slug of the options page to get.
     */
    slug?: string;
  } = {}
): Promise<object> {
  const { slug } = args;

  if (!process.env.WP_APPLICATION_PASSWORD) {
    throw new Error(`'WP_APPLICATION_PASSWORD' environment variable is required for function 'getOptionsPage'.
Check your ${
      process.env.NODE_ENV === "development"
        ? "local .env file"
        : "deployment's environment variables."
    }.

You can generate an application password in your WordPress admin under Users > Your Profile > Application Passwords.`);
  }

  const req = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/nextwp/v1/options/${slug}`,
    {
      headers: getAuthHeaders(),
    }
  );
  let data;
  try {
    data = (await req.json()) as OptionsPageResponse;

    if (data.code?.includes("rest_no_route")) {
      throw new Error(`Error getting options page with slug '${slug}'.

code: ${data.code}

${msg}`);
    }

    if (data.code?.includes("rest_forbidden")) {
      throw new Error(`Error getting options page with slug '${slug}'.

code: ${data.code}

${msg}`);
    }
  } catch (err) {
    throw new Error(
      `Error getting options page with slug '${slug}': ${err.message}`
    );
  }

  return data;
}

const msg = `'getOptionsPage' requires the 'NextWP - Toolkit' plugin to be installed and activated on your WordPress site.

The user for the 'WP_APPLICATION_PASSWORD' environment variable must also have administrator permissions.

See https://github.com/CalebBarnes/nextwp for more information.

`;

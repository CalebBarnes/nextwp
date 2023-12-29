import { getAuthHeaders } from "./get-auth-headers";

export type PostType = {
  /**
   * `false` if no archive, `string` if archive slug is different from post type slug
   */
  has_archive: boolean | string;
  /**
   * The slug of this post type.
   */
  slug: string;
  /**
   * The base path for this post type's REST API endpoint.
   */
  rest_base: string;

  labels?: {
    plural_name?: string;
  };
};

type PostTypes = {
  post: PostType;
  page: PostType;
  attachment: PostType;
  nav_menu_item: PostType;
  /**
   * Custom post types, created by plugins and themes like CPT UI and ACF.
   */
  [postType: string]: PostType;
};

type PostTypesResponse = {
  code?: string;
  message?: string;
} & PostTypes;

/**
 * Get all post types from the WordPress REST API.
 */
export async function getPostTypes({
  wpUrl,
  wpApplicationPassword,
}: {
  wpUrl?: string;
  wpApplicationPassword?: string;
}): Promise<PostTypes> {
  const req = await fetch(
    `${
      wpUrl || process.env.NEXT_PUBLIC_WP_URL
    }/wp-json/wp/v2/types?context=edit`,
    {
      headers: getAuthHeaders(wpApplicationPassword),
    }
  );

  try {
    const data = (await req.json()) as PostTypesResponse;

    return data;
  } catch (err: any) {
    throw new Error(`getPostTypes: Error fetching post types: ${err.message}`);
  }
}

import { getAuthHeaders } from "./get-auth-headers";

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
export async function getPostTypes(): Promise<PostTypes> {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/types?context=edit`,
    {
      headers: getAuthHeaders(),
    }
  );

  try {
    const data = (await req.json()) as PostTypesResponse;
    return data;
  } catch (err: any) {
    throw new Error(
      `getPostTypes: Error fetching post types from WordPress REST API. 
      
Make sure your WordPress URL is correct, your environment variables are correct and that your WordPress site is running. 

Refer to the documentation for more information: https://www.nextwp.org/environment-variables

${err.message}`
    );
  }
}

export interface PostType {
  has_archive: boolean | string;
  slug: string;
  rest_base: string;
  labels?: {
    name?: string;
    plural_name?: string;
    singular_name?: string;
    add_new?: string;
    add_new_item?: string;
    edit_item?: string;
    new_item?: string;
    view_item?: string;
    view_items?: string;
    search_items?: string;
    not_found?: string;
    not_found_in_trash?: string;
    parent_item_colon?: string | null;
    all_items?: string;
    archives?: string;
    attributes?: string;
    insert_into_item?: string;
    uploaded_to_this_item?: string;
    featured_image?: string;
    set_featured_image?: string;
    remove_featured_image?: string;
    use_featured_image?: string;
    filter_items_list?: string;
    filter_by_date?: string;
    items_list_navigation?: string;
    items_list?: string;
    item_published?: string;
    item_published_privately?: string;
    item_reverted_to_draft?: string;
    item_trashed?: string;
    item_scheduled?: string;
    item_updated?: string;
    item_link?: string;
    item_link_description?: string;
    menu_name?: string;
    name_admin_bar?: string;
  };
  name?: string;
  icon?: string;
  supports?: {
    title?: boolean;
    editor?: boolean;
    author?: boolean;
    thumbnail?: boolean;
    excerpt?: boolean;
    trackbacks?: boolean;
    custom_fields?: boolean;
    comments?: boolean;
    revisions?: boolean;
    post_formats?: boolean;
    page_attributes?: boolean;
  };
  taxonomies?: string[];
  rest_namespace?: string;
  capabilities?: {
    edit_post?: string;
    read_post?: string;
    delete_post?: string;
    edit_posts?: string;
    edit_others_posts?: string;
    delete_posts?: string;
    publish_posts?: string;
    read_private_posts?: string;
    read?: string;
    delete_private_posts?: string;
    delete_published_posts?: string;
    delete_others_posts?: string;
    edit_private_posts?: string;
    edit_published_posts?: string;
    create_posts?: string;
  };
  description?: string;
  hierarchical?: boolean;
  visibility?: {
    show_in_nav_menus?: boolean;
    show_ui?: boolean;
  };
  viewable?: boolean;
}

export interface Page {
  /**
   * ACF field data
   */
  acf: {
    /**
     * ACF: Flexible Content
     *
     * Enables the creation of a series of subfields which can be dynamically repeated and ordered.
     * @see https://www.advancedcustomfields.com/resources/flexible-content/
     */
    modules?:
      | {
          acf_fc_layout: "hero";
          headline?: string | null;
          image?: number | null;
          links?:
            | {
                /**
                 * ACF: Link
                 */
                link?: {
                  target: string;
                  title: string;
                  url: string;
                };
                variant?: "primary" | "secondary" | null;
              }[]
            | null;
          subline?: string | null;
        }
      | {
          acf_fc_layout: "text-image";
          image?: number | null;
          text?: string | null;
        }
      | {
          acf_fc_layout: "textarea";
          text?: string | null;
        };
  };
  /**
   * The ID for the author of the post.
   */
  author: number;
  /**
   * Whether or not comments are open on the post.
   */
  comment_status: "open" | "closed";
  /**
   * The content for the post.
   */
  content: {
    /**
     * Version of the content block format used by the post.
     */
    block_version: number;
    /**
     * Whether the content is protected with a password.
     */
    protected: boolean;
    /**
     * Content for the post, as it exists in the database.
     */
    raw: string;
    /**
     * HTML content for the post, transformed for display.
     */
    rendered: string;
  };
  /**
   * The date the post was published, in the site's timezone.
   */
  date: string | null;
  /**
   * The date the post was published, as GMT.
   */
  date_gmt: string | null;
  /**
   * The excerpt for the post.
   */
  excerpt: {
    /**
     * Whether the excerpt is protected with a password.
     */
    protected: boolean;
    /**
     * Excerpt for the post, as it exists in the database.
     */
    raw: string;
    /**
     * HTML excerpt for the post, transformed for display.
     */
    rendered: string;
  };
  /**
   * The ID of the featured media for the post.
   */
  featured_media: number;
  /**
   * Slug automatically generated from the post title.
   */
  generated_slug: string;
  /**
   * The globally unique identifier for the post.
   */
  guid: {
    /**
     * GUID for the post, as it exists in the database.
     */
    raw: string;
    /**
     * GUID for the post, transformed for display.
     */
    rendered: string;
  };
  /**
   * Unique identifier for the post.
   */
  id: number;
  /**
   * URL to the post.
   */
  link: string;
  /**
   * The order of the post in relation to other posts.
   */
  menu_order: number;
  /**
   * Meta fields.
   */
  meta: {
    footnotes: string;
  };
  /**
   * The date the post was last modified, in the site's timezone.
   */
  modified: string;
  /**
   * The date the post was last modified, as GMT.
   */
  modified_gmt: string;
  /**
   * The ID for the parent of the post.
   */
  parent: number;
  /**
   * A password to protect access to the content and excerpt.
   */
  password: string;
  /**
   * Permalink template for the post.
   */
  permalink_template: string;
  /**
   * Whether or not the post can be pinged.
   */
  ping_status: "open" | "closed";
  /**
   * An alphanumeric identifier for the post unique to its type.
   */
  slug: string;
  /**
   * A named status for the post.
   */
  status:
    | "publish"
    | "future"
    | "draft"
    | "pending"
    | "private"
    | "acf-disabled";
  /**
   * The theme file to use to display the post.
   */
  template: string;
  /**
   * The title for the post.
   */
  title: {
    /**
     * Title for the post, as it exists in the database.
     */
    raw: string;
    /**
     * HTML title for the post, transformed for display.
     */
    rendered: string;
  };
  /**
   * Type of post.
   */
  type: string;
}

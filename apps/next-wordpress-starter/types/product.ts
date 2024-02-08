export interface Product {
  /**
   * ACF field data
   */
  acf: {
    /**
     * ACF: Date Picker
     * A `Ymd` formatted date string.
     */
    this_is_a_date_picker_field?: string | null;
    /**
     * ACF: Date Time Picker
     * A `Y-m-d H:i:s` formatted date string.
     */
    this_is_a_date_time_picker_field?: string | null;
    /**
     * ACF: Link
     */
    this_is_a_link_field?: {
      target: string;
      title: string;
      url: string;
    };
    this_is_a_number_field?: number | null;
    this_is_a_text_field?: string | null;
    this_is_a_url_field?: string | null;
    /**
     * ACF: Email
     */
    this_is_an_email_field?: string | null;
  };
  /**
   * The terms assigned to the post in the capacity taxonomy.
   */
  capacity: number[];
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
   * The date the post was last modified, in the site's timezone.
   */
  modified: string;
  /**
   * The date the post was last modified, as GMT.
   */
  modified_gmt: string;
  /**
   * A password to protect access to the content and excerpt.
   */
  password: string;
  /**
   * Permalink template for the post.
   */
  permalink_template: string;
  /**
   * The terms assigned to the post in the series taxonomy.
   */
  series: number[];
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
  /**
   * The terms assigned to the post in the voltage taxonomy.
   */
  voltage: number[];
}

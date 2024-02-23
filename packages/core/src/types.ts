export interface WpPage {
  /**
   * Unique identifier for the page or post.
   */
  id: number;
  /**
   * An alphanumeric identifier for the post unique to its type.
   */
  slug?: string;
  /**
   * The title for the page or post.
   */
  title?: RenderedObject;
  /**
   * The content for the page or post.
   */
  content?: RenderedObject;
  /**
   * The excerpt for the page or post.
   */
  excerpt?: RenderedObject;
  /**
   * The date the post was published, in the site's timezone.
   */
  date?: string;
  /**
   * The date the post was published, as GMT.
   */
  date_gmt?: string;
  /**
   * The date the post was last modified, in the site's timezone.
   */
  modified?: string;
  /**
   * The date the post was last modified, as GMT.
   */
  modified_gmt?: string;
  /**
   * The globally unique identifier for the post.
   */
  guid?: RenderedObject;
  /**
   * URL to the post.
   */
  link?: string;
  /**
   * A named status for the post.
   * One of: publish, future, draft, pending, private
   */
  status?: "publish" | "future" | "draft" | "pending" | "private";
  /**
   * Type of post.
   */
  type?: string;
  /**
   * The ID for the author of the post.
   */
  author?: number;
  /**
   * The ID of the featured media for the post.
   */
  featured_media?: number;
  /**
   * Whether or not comments are open on the post.
   * One of: open, closed
   */
  comment_status?: "open" | "closed";
  /**
   * Whether or not the post can be pinged.
   * One of: open, closed
   */
  ping_status?: "open" | "closed";
  /**
   * The order of the post in relation to other posts.
   */
  menu_order?: number;
  /**
   * Meta fields.
   */
  meta?: any;
  /**
   * The theme file to use to display the post.
   */
  template?: string;
  /**
   * The raw html generated for the yoast head.
   */
  yoast_head?: string;
  /**
   * The yoast head data as json.
   */
  yoast_head_json?: YoastHeadJson;
  /**
   * Links for embedded resources.
   */
  _links?: EmbeddedLinks;
}

export interface YoastHeadJson {
  title?: string;
  og_description?: string;
  og_title?: string;
  og_site_name?: string;
  og_locale?: string;
  og_url?: string;
  og_image?: { url?: string }[];
  twitter_card?: string;
  twitter_image?: string;
}

type EmbeddedLinks = {
  self?: EmbeddedLink[];
  collection?: EmbeddedLink[];
  about?: EmbeddedLink[];
  author?: EmbeddedAuthorLink[];
  replies?: EmbeddedLink[];
};

type EmbeddedLink = {
  href?: string;
};

type EmbeddedAuthorLink = {
  embeddable?: boolean;
  href?: string;
};

export interface WpLink {
  target?: string;
  title?: string;
  url?: string;
}

export interface AcfFile {
  alt?: string;
  url?: string;
  ID?: number;
  id?: number;
  width?: number;
  height?: number;
  mime_type?: string;
  title?: string;
  filename?: string;
  filesize?: number;
  link?: string;
  author?: string;
  description?: string;
  caption?: string;
  name?: string;
  status?: string;
  uploaded_to?: number;
  date?: string;
  modified?: string;
  menu_order?: number;
  type?: string;
  subtype?: string;
  icon?: string;
  sizes?: {
    thumbnail?: string;
    "thumbnail-width"?: number;
    "thumbnail-height"?: number;
    medium?: string;
    "medium-width"?: number;
    "medium-height"?: number;
    medium_large?: string;
    "medium_large-width"?: number;
    "medium_large-height"?: number;
    large?: string;
    "large-width"?: number;
    "large-height"?: number;
    "1536x1536"?: string;
    "1536x1536-width"?: number;
    "1536x1536-height"?: number;
    "2048x2048"?: string;
    "2048x2048-width"?: number;
    "2048x2048-height"?: number;
  };
}

export type { AcfFile as WpImage };
export type { AcfFile as AcfImage };
export type { AcfFile as AcfVideo };

export interface WpMenuItem {
  id?: number;
  title?: RenderedObject;
  status?: string;
  url?: string;
  attr_title?: string;
  description?: string;
  type?: string;
  type_label?: string;
  object?: string;
  object_id?: number;
  parent?: number;
  menu_order?: number;
  target?: string;
  classes?: string[];
  xfn?: string[];
  invalid?: boolean;
  meta?: any;
  menus?: number;
  _links?: WpLink[];
  label?: string;
  path?: string;
  childItems?: WpMenuItem[];
}

export type Menu = WpMenuItem[];

export interface WpMediaItem {
  id?: number;
  date?: string;
  date_gmt?: string;
  guid?: RenderedObject;
  modified?: string;
  modified_gmt?: string;
  slug?: string;
  status?: string;
  type?: string;
  link?: string;
  title?: RenderedObject;
  author?: number;
  comment_status?: string;
  ping_status?: string;
  template?: string;
  meta?: any[];
  acf?: any[];
  description?: RenderedObject;
  caption?: RenderedObject;
  alt_text?: string;
  media_type?: string;
  mime_type?: string;
  media_details?: {
    width?: number;
    height?: number;
    file?: string;
    filesize?: number;
    sizes?: Record<string, ImageSize>;
    image_meta?: ImageMeta;
  };
  post?: any;
  source_url?: string;
  _links?: EmbeddedLinks;
}

export interface RenderedObject {
  rendered?: string;
  protected?: boolean;
}

export interface ImageSize {
  file: string;
  width: number;
  height: number;
  filesize?: number;
  mime_type: string;
  source_url: string;
}

export interface ImageMeta {
  aperture?: string;
  credit?: string;
  camera?: string;
  caption?: string;
  created_timestamp?: string;
  copyright?: string;
  focal_length?: string;
  iso?: string;
  shutter_speed?: string;
  title?: string;
  orientation?: string;
  keywords?: string[];
}

export interface WpArchive {
  description?: string;
  hierarchical?: boolean;
  /**
   * Either false if no archive page, or it is the slug of the archive page
   */
  has_archive?: string | false;
  /**
   * The name of the post type archive
   */
  name?: string;
  /**
   * The slug of the post type archive
   */
  slug?: string;
  icon?: string;
  taxonomies?: any[];
  /**
   * The base path for the REST API endpoint
   */
  rest_base?: string;
  /**
   * The namespace for the REST API endpoint
   * @example "wp/v2"
   */
  rest_namespace?: string;

  yoast_head?: string;
  yoast_head_json?: YoastHeadJson;
}

export interface WpRevision extends WpPage {
  parent: number;
}

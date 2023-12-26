import type { PostType } from "../get-post-types";
import { getPostTypes } from "../get-post-types";
import { getSingleItem } from "../get-single-item";
import { getSiteSettings } from "../get-site-settings";

/**
 * Get post type archive and rest base by uri
 */
export async function getPostInfo(uri: string): Promise<{
  /**
   * The rest base for the post type to be used in the WordPress REST API endpoint.
   */
  postTypeRestBase: string;
  /**
   * The post type archive data if this uri is an archive page.
   */
  archive: PostType | null;
}> {
  const settings = await getSiteSettings();
  const postTypes = await getPostTypes();

  const paths = uri.split("/");
  const slug = paths.slice(-1).toString();

  let archive: PostType | null = null;
  let postTypeRestBase = "pages";

  for (const key in postTypes) {
    // get rest base for post type
    if (uri.startsWith(postTypes[key].slug)) {
      postTypeRestBase = postTypes[key].rest_base;
    }
    // check if uri matches a post type archive uri
    if (postTypes[key].has_archive === uri) {
      archive = postTypes[key];
    }
  }

  if (settings.page_for_posts) {
    // need to check if the blog page is the current page because this could be on any uri
    const blogPage = await getSingleItem({
      id: settings.page_for_posts,
      postTypeRestBase: "pages",
    });

    if (blogPage?.slug === slug) {
      archive = {
        has_archive: blogPage.slug,
        slug: "posts",
        rest_base: "posts",
      };
    }
  }

  return { archive, postTypeRestBase };
}

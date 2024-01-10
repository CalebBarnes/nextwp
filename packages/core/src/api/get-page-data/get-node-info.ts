import type { PostType } from "../get-post-types";
import { getPostTypes } from "../get-post-types";
import { getSingleItem } from "../get-single-item";
import { getSiteSettings } from "../get-site-settings";
import { getTaxonomies } from "../get-taxonomies";
import { getTermNode } from "../taxonomy/get-term-node";

/**
 * Get post type archive and rest base by uri
 */
export async function getNodeInfo(uri: string): Promise<{
  /**
   * The rest base for the post type to be used in the WordPress REST API endpoint.
   */
  rest_base: string;
  /**
   * The post type archive data if this uri is an archive page.
   */
  archive: PostType | undefined;

  /**
   * The taxonomy data if this uri is a taxonomy archive page.
   */
  taxonomy?: any;
}> {
  console.log("getNodeInfo", uri);
  const settings = await getSiteSettings();
  const postTypes = await getPostTypes();
  const taxonomies = await getTaxonomies();

  const paths = uri.split("/");
  const slug = paths.slice(-1).toString();

  let archive: PostType | undefined;
  let taxonomy;
  let rest_base = "pages";

  for (const key in postTypes) {
    // get rest base for post type
    if (uri.startsWith(postTypes[key].slug)) {
      rest_base = postTypes[key].rest_base;
    }
    // check if uri matches a post type archive uri
    if (postTypes[key].has_archive === uri) {
      archive = postTypes[key];
    }
  }

  for (const key in taxonomies) {
    // check if uri matches a taxonomy archive uri
    if (uri.startsWith(taxonomies[key].slug)) {
      const termSlug = uri.replace(`${taxonomies[key].slug}/`, "");

      if (termSlug) {
        const termNode = await getTermNode({
          termSlug,
          rest_base: taxonomies[key].rest_base,
        });
        console.log("termNode", termNode);
      }

      console.log("termSlug", termSlug);
      console.log(taxonomies[key].slug);
      console.log("uri starts with taxonomy slug", taxonomies[key]);
      taxonomy = taxonomies[key];
      rest_base = taxonomy.rest_base;
      break;
    }
  }

  if (settings.page_for_posts) {
    // need to check if the blog page is the current page because this could be on any uri
    const blogPage = await getSingleItem({
      id: settings.page_for_posts,
      rest_base: "pages",
    });

    if (blogPage?.data?.slug === slug) {
      archive = {
        has_archive: blogPage.data.slug,
        slug: "posts",
        rest_base: "posts",
      };
    }
  }

  return { archive, rest_base, taxonomy };
}

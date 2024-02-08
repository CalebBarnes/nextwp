import { getPostTypes } from "../../api/get-post-types";
import { getSiteSettings } from "../../api/get-site-settings";

export async function getArchiveStaticParams({ postTypes }) {
  const wpPostTypes = await getPostTypes();
  const settings = await getSiteSettings();
  const staticParams: { paths: string[] }[] = [];

  if (settings.page_for_posts) {
    try {
      const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/pages/${settings.page_for_posts}`;
      const req = await fetch(endpoint);
      const postsPage = await req.json();

      staticParams.push({
        paths: [postsPage.slug],
      });

      const paginationInfo = await getArchivePaginationInfo({
        rest_base: "posts",
        per_page: settings.posts_per_page,
      });

      const postArchiveStaticParams = getStaticParamsFromPaginationInfo({
        archiveSlug: postsPage.slug,
        paginationInfo,
      });

      staticParams.push(...postArchiveStaticParams);
    } catch (error) {
      console.error(error);
    }
  }

  for (const postType of postTypes) {
    const itemKey = Object.keys(wpPostTypes).find(
      (key) => wpPostTypes[key].rest_base === postType
    );
    const matchingPostType = wpPostTypes[itemKey];

    if (
      matchingPostType.has_archive &&
      typeof matchingPostType.has_archive === "string"
    ) {
      const paginationInfo = await getArchivePaginationInfo({
        rest_base: matchingPostType.rest_base,
        per_page: settings.posts_per_page,
      });

      const postTypeArchiveStaticParams = getStaticParamsFromPaginationInfo({
        archiveSlug: matchingPostType.has_archive,
        paginationInfo,
      });

      staticParams.push({
        paths: [matchingPostType.has_archive],
      });

      staticParams.push(...postTypeArchiveStaticParams);

      // if (matchingPostType.taxonomies) {
      //   for (const taxonomy of matchingPostType.taxonomies) {
      //     const taxonomyStaticParams = getTaxonomyStaticParams({ taxonomy });

      //     // console.log(matchingPostType.slug);
      //     // console.log({ taxonomy });

      //     // const params = {}

      //     // if (taxonomy.slug === "category") {
      //     //   params.categories = String(term.id);
      //     // } else if (taxonomy.slug === "post_tag") {
      //     //   params.tags = String(term.id);
      //     // } else {
      //     //   params[taxonomy.slug] = String(term.id);
      //     // }

      //     // const taxonomyPaginationInfo = await getArchivePaginationInfo({
      //     //   rest_base: matchingPostType.rest_base,
      //     //   per_page: settings.posts_per_page,
      //     //   params: {

      //     //   },
      //     // });
      //   }
      // }
    }

    // todo: check which taxonomies are registered for this post type
    // todo: then fetch all terms for each taxonomy
    // todo: then generate static paths for each term
  }

  return staticParams;
}

async function getArchivePaginationInfo({
  rest_base,
  per_page,
  params = {},
}: {
  rest_base: string;
  per_page: number;
  params?: Record<string, string>;
}) {
  const queryString = new URLSearchParams({
    per_page: String(per_page),
    ...params,
  }).toString();

  try {
    const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}?${queryString}`;
    const req = await fetch(endpoint);

    // Check if the fetch request was successful
    if (!req.ok) {
      throw new Error(`HTTP error! status: ${req.status}`);
    }

    const totalPages = req.headers.get("X-WP-TotalPages")
      ? Number(req.headers.get("X-WP-TotalPages") || 1)
      : undefined;

    const totalItems = req.headers.get("X-WP-Total")
      ? Number(req.headers.get("X-WP-Total") || 0)
      : undefined;

    return {
      totalPages,
      totalItems,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

function getStaticParamsFromPaginationInfo({ archiveSlug, paginationInfo }) {
  const staticParams = [];

  for (let i = 1; i <= paginationInfo.totalPages; i++) {
    if (i === 1) {
      continue;
    }
    staticParams.push({
      paths: [archiveSlug, String(i)],
    });
  }

  return staticParams;
}

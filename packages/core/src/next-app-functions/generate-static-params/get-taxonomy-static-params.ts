/* eslint-disable no-await-in-loop  -- asdasd*/
import { getPostTypes } from "../../api/get-post-types";
import { getSiteSettings } from "../../api/get-site-settings";
import type { WpTerm } from "../../api/taxonomy/get-term";

export async function getTaxonomyStaticParams({
  postTypes,
}: {
  postTypes: string[];
}) {
  const wpPostTypes = await getPostTypes();
  const staticParams: { paths: string[] }[] = [];

  for (const postType of postTypes) {
    const itemKey = Object.keys(wpPostTypes).find(
      (key) => wpPostTypes[key]?.rest_base === postType
    );
    if (!itemKey) {
      continue;
    }

    const matchingPostType = wpPostTypes[itemKey];
    const hasArchive =
      matchingPostType?.has_archive &&
      typeof matchingPostType.has_archive === "string";
    const isPosts = matchingPostType.rest_base === "posts";

    if (
      (hasArchive || isPosts) &&
      Array.isArray(matchingPostType.taxonomies) &&
      matchingPostType.taxonomies.length > 0
    ) {
      for (const taxonomy of matchingPostType.taxonomies) {
        const taxonomySlug = taxonomy === "post_tag" ? "tag" : taxonomy;
        let taxonomyRestBase = taxonomy;
        if (taxonomy === "category") {
          taxonomyRestBase = "categories";
        }
        if (taxonomy === "post_tag") {
          taxonomyRestBase = "tags";
        }

        const req = await fetch(
          `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${taxonomyRestBase}`
        );
        const data = (await req.json()) as WpTerm[] | undefined;

        if (data && Array.isArray(data)) {
          for (const term of data) {
            if (!term.slug) {
              continue;
            }

            staticParams.push({
              paths: [taxonomySlug, term.slug],
            });

            if (term.count === 0) {
              continue;
            }

            const paginationInfo = await getTaxonomyPaginationInfo({
              rest_base: matchingPostType.rest_base,
              taxonomyRestBase,
              term,
            });
            if (
              !paginationInfo ||
              (paginationInfo.totalPages && paginationInfo.totalPages <= 1)
            ) {
              continue;
            }

            const taxonomyPaginationStaticParams =
              getStaticParamsFromPaginationInfo({
                paths: [taxonomySlug, term.slug],
                paginationInfo,
              });

            staticParams.push(...taxonomyPaginationStaticParams);
          }
        }
      }
    }
  }

  return staticParams;
}

async function getTaxonomyPaginationInfo({
  rest_base,
  taxonomyRestBase,
  term,
}: {
  rest_base: string;
  taxonomyRestBase: string;
  term: WpTerm;
}) {
  const settings = await getSiteSettings();
  const params: {
    per_page: string;
    [key: string]: string;
  } = {
    per_page: String(settings.posts_per_page) || "10",
  };
  params[taxonomyRestBase] = String(term.id);
  const queryString = new URLSearchParams(params).toString();

  try {
    const endpoint = `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${rest_base}?${queryString}`;
    const req = await fetch(endpoint);

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
    // eslint-disable-next-line no-console -- asdasd
    console.error("Error fetching data:", error);
    return null;
  }
}

function getStaticParamsFromPaginationInfo({
  paths,
  paginationInfo,
}: {
  paths: string[];
  paginationInfo: {
    totalPages?: number;
    totalItems?: number;
  };
}) {
  const staticParams = [];

  for (let i = 1; i <= Number(paginationInfo.totalPages); i++) {
    if (i === 1) {
      continue;
    }
    staticParams.push({
      paths: [...paths, String(i)],
    });
  }

  return staticParams;
}

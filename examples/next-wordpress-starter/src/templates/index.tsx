import type { Templates } from "@nextwp/core/src/utils/get-template";
import DefaultPageTemplate from "./page/default";
import DefaultPostTemplate from "./post/default";
import MovieArchive from "./archive/movie";
import ContactPageTemplate from "./page/contact";
import PostArchive from "./archive/blog";

const templates: Templates = {
  page: {
    default: DefaultPageTemplate,
    contact: ContactPageTemplate,
  },
  post: {
    default: DefaultPostTemplate,
  },
  archive: {
    posts: PostArchive,
    movie: MovieArchive,
  },

  // taxonomy: {
  //   category: CategoryTaxonomyTemplate,
  //   post_tag: TagTaxonomyTemplate,
  // },
};

export default templates;

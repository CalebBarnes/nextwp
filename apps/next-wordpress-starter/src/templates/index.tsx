import type { Templates } from "@nextwp/core";
import DefaultPageTemplate from "./page/default";
import DefaultPostTemplate from "./post/default";
import MovieArchive from "./archive/movie";
import ContactPageTemplate from "./page/contact";
import PostArchive from "./archive/blog";
import ProductArchive from "./archive/product";

const templates: Templates = {
  page: {
    default: DefaultPageTemplate,
    contact: ContactPageTemplate,
  },
  post: {
    default: DefaultPostTemplate,
  },
  product: {
    default: DefaultPostTemplate,
  },
  archive: {
    posts: PostArchive,
    movie: MovieArchive,
    product: ProductArchive,
  },

  // taxonomy: {
  //   category: CategoryTaxonomyTemplate,
  //   post_tag: TagTaxonomyTemplate,
  // },
};

export default templates;

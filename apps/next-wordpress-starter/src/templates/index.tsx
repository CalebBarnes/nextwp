import type { Templates } from "@nextwp/core";
import DefaultPageTemplate from "./page/default";
import DefaultPostTemplate from "./post/default";
import MovieArchive from "./archive/movie";
import ContactPageTemplate from "./page/contact";
import PostArchive from "./archive/blog";
import ProductArchive from "./archive/product";
import { ExampleTaxonomyTemplate } from "./taxonomy/category";

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

  taxonomy: {
    category: ExampleTaxonomyTemplate,
    tag: ExampleTaxonomyTemplate,
    voltage: ExampleTaxonomyTemplate,
    capacity: ExampleTaxonomyTemplate,
    series: ExampleTaxonomyTemplate,
  },
};

export default templates;

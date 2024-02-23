export const mockTaxonomies = {
  category: {
    name: "Categories",
    slug: "category",
    description: "",
    types: ["post"],
    hierarchical: true,
    rest_base: "categories",
    rest_namespace: "wp/v2",
    _links: {
      collection: [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/taxonomies",
        },
      ],
      "wp:items": [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/categories",
        },
      ],
      curies: [
        {
          name: "wp",
          href: "https://api.w.org/{rel}",
          templated: true,
        },
      ],
    },
  },
  post_tag: {
    name: "Tags",
    slug: "post_tag",
    description: "",
    types: ["post"],
    hierarchical: false,
    rest_base: "tags",
    rest_namespace: "wp/v2",
    _links: {
      collection: [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/taxonomies",
        },
      ],
      "wp:items": [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/tags",
        },
      ],
      curies: [
        {
          name: "wp",
          href: "https://api.w.org/{rel}",
          templated: true,
        },
      ],
    },
  },
  nav_menu: {
    name: "Navigation Menus",
    slug: "nav_menu",
    description: "",
    types: ["nav_menu_item"],
    hierarchical: false,
    rest_base: "menus",
    rest_namespace: "wp/v2",
    _links: {
      collection: [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/taxonomies",
        },
      ],
      "wp:items": [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/menus",
        },
      ],
      curies: [
        {
          name: "wp",
          href: "https://api.w.org/{rel}",
          templated: true,
        },
      ],
    },
  },
  wp_pattern_category: {
    name: "Pattern Categories",
    slug: "wp_pattern_category",
    description: "",
    types: ["wp_block"],
    hierarchical: false,
    rest_base: "wp_pattern_category",
    rest_namespace: "wp/v2",
    _links: {
      collection: [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/taxonomies",
        },
      ],
      "wp:items": [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/wp_pattern_category",
        },
      ],
      curies: [
        {
          name: "wp",
          href: "https://api.w.org/{rel}",
          templated: true,
        },
      ],
    },
  },
  capacity: {
    name: "Capacities",
    slug: "capacity",
    description: "",
    types: ["product"],
    hierarchical: false,
    rest_base: "capacity",
    rest_namespace: "wp/v2",
    _links: {
      collection: [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/taxonomies",
        },
      ],
      "wp:items": [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/capacity",
        },
      ],
      curies: [
        {
          name: "wp",
          href: "https://api.w.org/{rel}",
          templated: true,
        },
      ],
    },
  },
  series: {
    name: "Series",
    slug: "series",
    description: "",
    types: ["product"],
    hierarchical: false,
    rest_base: "series",
    rest_namespace: "wp/v2",
    _links: {
      collection: [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/taxonomies",
        },
      ],
      "wp:items": [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/series",
        },
      ],
      curies: [
        {
          name: "wp",
          href: "https://api.w.org/{rel}",
          templated: true,
        },
      ],
    },
  },
  voltage: {
    name: "Voltages",
    slug: "voltage",
    description: "",
    types: ["product"],
    hierarchical: false,
    rest_base: "voltage",
    rest_namespace: "wp/v2",
    _links: {
      collection: [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/taxonomies",
        },
      ],
      "wp:items": [
        {
          href: "https://nextwordpress.wpengine.com/wp-json/wp/v2/voltage",
        },
      ],
      curies: [
        {
          name: "wp",
          href: "https://api.w.org/{rel}",
          templated: true,
        },
      ],
    },
  },
};

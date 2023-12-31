# NextWP Headless Theme

A WordPress theme with some good defaults for headless WordPress sites. It suggests and auto-installs recommended plugins for Headless development with NextWP.

## Recommended plugins

The NextWP Headless WordPress theme will suggest and auto-install the following plugins:

- [NextWP Toolkit](https://www.nextwp.org/packages/wordpress/nextwp-toolkit-plugin) (required): The NextWP Toolkit plugin provides the core functionality for NextWP, including [previews](/packages/nextwp/core/route-handlers#next-word-press-preview).
- [On-Demand Revalidation](https://wordpress.org/plugins/on-demand-revalidation/): Triggers the [revalidate endpoint](/packages/nextwp/core/route-handlers#revalidate) in Next.js when content is updated in WordPress.
- [Advanced Custom Fields](https://wordpress.org/plugins/advanced-custom-fields/): ACF is a powerful tool for creating custom fields in WordPress.
- [YoastSEO](https://wordpress.org/plugins/wordpress-seo/): YoastSEO is a powerful SEO plugin. `@nextwp/core` uses YoastSEO to [generate metadata](/packages/nextwp/core/next-app-functions#generate-metadata) for Next.js.
- [Gravity Forms](https://www.gravityforms.com/): Gravity Forms is a powerful form builder for WordPress.<br/>
  > `@nextwp/addons` provides a [GravityForm component](https://www.nextwp.org/packages/nextwp/addons) to easily integrate Gravity Forms with Next.js.

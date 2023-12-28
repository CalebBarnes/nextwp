# @nextwp/core

Welcome to `@nextwp/core`

This package facilitates building Next.js sites using headless WordPress as the CMS.

It is built on the WP REST API and has additional functions designed to work with the [NextWP - Headless Toolkit](https://github.com/CalebBarnes/nextwp/@nextwp/wp-plugin) WordPress plugin.

Why use the REST API instead of GraphQL?
@todo: write about this - link to another page

- simplicity
- reliability
- performance
- caching
- ease of use
- familiarity
- extensibility - most WP plugins support REST API by default
- GraphQL is not a standard in WP
- GraphQL is not good by default in Next.js app dir - REST API GET requests are cached by default in Next.js RSC

## Features

- **WP REST API Integration**: Leverages WP REST API for optimized performance.
- **Enhanced Caching**: GET requests are cached at the WP server and in NextJS.
- **Speedy Development**: Reduces development time by eliminating the need for writing extensive queries.

## WordPress Theme

The easiest way to get started is to install [NextWP Headless Theme](https://github.com/CalebBarnes/nextwp/@nextwp/wp-theme) in your WordPress site. This will install the required plugins and offer optional recommended plugins to improve the headless WP experience.

## Prerequisites

Ensure you have the following WordPress plugins installed:

- **Advanced Custom Fields PRO**: Enables custom fields in WordPress.
- **Yoast SEO**: Provides SEO features for WordPress sites.
- **NextWP - Headless Toolkit**: Essential for CMS previews in NextJS. [Plugin link](https://github.com/CalebBarnes/nextwp/@nextwp/wp-plugin)

## Installation

Install `@nextwp/core` in your Next.js project:

```bash
npm install @nextwp/core
```

## Quick Start

The fastest way to get up and running is to start a new project with the [next-wordpress-starter](https://github.com/CalebBarnes/nextwp/examples/next-wordpress-starter) project in the examples folder.

Here's a basic example to get started in an existing project:

```tsx
// src/app/[[...paths]]/page.tsx
import { WordpressTemplate } from "@nextwp/core";
import templates from "@/templates";

export default function PageTemplate(props) {
  return (
    <WordpressTemplate
      params={props.params}
      searchParams={props.searchParams}
      templates={templates}
    />
  );
}

export { generateMetadata, generateStaticParams } from "@nextwp/core";
```

## Configuration

### Environment Variables

The following environment variables are required for configuring `@nextwp/core`:

- `NEXT_PUBLIC_WP_URL`: The URL of your WordPress site.
- `NEXT_SITE_URL`: The URL of your Next.js site.
- `REVALIDATE_SECRET_KEY`: A secret key used for revalidation.
- `WP_APPLICATION_PASSWORD`: The application password for authenticating with WordPress.
- `NEXT_PREVIEW_SECRET`: The secret key for preview mode.

Make sure to set these environment variables in your project's configuration.

@todo: move some of this stuff below over to other docs files and link to them instead

## Usage

### Importing Templates file

Import and define your page templates:

```tsx
// Example templates file
import ContactPageTemplate from "./page/contact";
import DefaultPageTemplate from "./page/default";

const templates = {
  // post type slug in WP
  page: {
    // template name in WP
    default: DefaultPageTemplate,
    contact: ContactPageTemplate,
  },
};

export default templates;
```

## Default page template example

### This example uses the Flexible Content component to render blocks

```tsx
// Default page template file
import { FlexibleContent } from "@nextwp/core";
import * as blocks from "@/components/blocks";

export default function DefaultPageTemplate({ data }) {
  return <FlexibleContent blocks={blocks} rows={data?.acf?.flexible_content} />;
}
```

## API Reference

This document provides detailed information about the functions and components available in the `@nextwp/core` package.

### Next.js App Functions

#### `generateStaticParams`

Generates static routes for a Next.js site based on WordPress REST API results.

See https://nextjs.org/docs/app/api-reference/functions/generate-static-params for more information.

- **Parameters**:
  - `wpUrl`: `String` - The WordPress URL (optional, default is NEXT_PUBLIC_WP_URL env variable).
  - `postTypes`: `Array<String>` - The post types to include in static generation (default: ["pages", "posts"]).
- **Returns**: `Promise<Array>`
- **Usage**:
  This function should be used in your `app/[[...paths]]/page.tsx` file.

  ```typescript
  // with default settings
  export { generateStaticParams } from "@nextwp/core";

  // with additional post types
  const staticParams = generateStaticParams({
    postTypes: ["pages", "posts", "movie"],
  });
  export { staticParams as generateStaticParams };
  ```

#### `generateSiteMap`

Generates a `sitemap.xml` file for a site using the WordPress REST API.

- **Parameters**:
  - `postTypes`: `Array<String>` - The post types to include in the sitemap (default: ["pages", "posts"]).
- **Returns**: `Promise<MetadataRoute.Sitemap>`
- **Usage**: This function should be used in your `app/sitemap.ts` file.

  ```typescript
  // with default settings
  export { generateSiteMap as default } from "@nextwp/core";
  ```

  ```typescript
  // with additional post types
  import { generateSiteMap } from "@nextwp/core";
  import { MetadataRoute } from "next";

  export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const sitemap = await generateSiteMap({
      postTypes: ["pages", "posts", "movie"],
    });

    return sitemap;
  }
  ```

#### `revalidate`

Triggers revalidation of specified paths in a Next.js app.

- **Parameters**:
- `request`: `Request` - Contains the paths to be revalidated.
- **Returns**: `Promise<Response>`
- **Usage**:

```typescript
// app/api/revalidate/route.ts
export { revalidate as PUT } from "@nextwp/core";
```

### Using Next.js Draft Mode with WordPress Preview

#### `NextWordPressPreview`

Handles preview routes in Next.js draft mode to preview changes to WordPress content instantly.

⚠ This draft mode function is used with the [NextWP - Headless Toolkit](https://github.com/CalebBarnes/nextwp/@nextwp/wp-plugin) to replace the default WordPress preview with an iframe of the Next.js preview route.

- **Parameters**:
  - `request`: Request - The request object.
  - `context`: RouteHandlerContext - The response context.
  - `options`: PreviewOptions - Options for the preview.
    - `toolbar`: Boolean - Whether to display draft mode toolbar (default: false).
- **Returns**: Function or Response
- **Usage**:

  ```typescript
  // app/api/draft/[...preview]/route.ts
  export { NextWordPressPreview as GET };
  ```

  With additional options:

  ```typescript
  // app/api/draft/[...preview]/route.ts
  import { NextWordPressPreview } from "@nextwp/core";

  const previewOptions = {
    toolbar: true,
  };

  const previewHandler = NextWordPressPreview(previewOptions);

  export { previewHandler as GET };
  ```

### REST API Functions

#### `getPageData`

Fetches data for a specific page from a WordPress REST API endpoint.

This function is used by the [WordpressTemplate](#wordpresstemplate) component, so you don't need to use it directly in your code but it is available if you need it.

- **Parameters**:
  - `uri`: `String` - The URI of the page.
- **Returns**: `Promise<Object>`
- **Usage**:
  ```typescript
  const pageData = await getPageData("/about");
  ```

#### `getMenuItems`

Retrieves menu items from a WordPress site.

- **Parameters**:
  - `slug`: `String` - The slug of the menu.
- **Returns**: `Promise<Array>`
- **Usage**:
  ```typescript
  const menuItems = await getMenuItems({ slug: "main-menu" });
  ```

### Custom REST API Functions

#### `getOptionsPage`

Fetches data from an options page created in WordPress.

⚠ This function requires the [NextWP - Headless Toolkit](https://github.com/CalebBarnes/nextwp/@nextwp/wp-plugin) to register the REST API endpoint for fetching options pages.

- **Parameters**:
  - `slug`: `String` - The slug of the options page.
- **Returns**: `Promise<Object>`
- **Usage**:
  ```typescript
  const options = await getOptionsPage({ slug: "theme-options" });
  ```

### React Components

#### `FlexibleContent`

A React component for rendering ACF flexible content blocks.

- **Props**:
  - `blocks`: `Object` - Map of React components to be rendered for each ACF flexible content layout.
  - `rows`: `Array` - Array of row data from an acf flexible content field.
  - `data`: `Object` - Extra data passed to each component (optional).
- **Usage**:

  ```tsx
  import { FlexibleContent } from "@nextwp/core";
  ```

  ```tsx
  import * as blocks from "@/components/blocks";

  export default async function DefaultPageTemplate({ data }) {
    return <FlexibleContent rows={data?.acf?.modules} blocks={blocks} />;
  }
  ```

#### `WordpressTemplate`

A component for rendering WordPress templates in a Next.js app.

- **Props**:
  - `params`: `Object` - Routing parameters.
  - `templates`: `Object` - Map of page templates.
  - `searchParams`: `Object` - Search parameters (optional).
- **Usage**:

  ```tsx
  // src/app/[[...paths]]/page.tsx
  import { WordpressTemplate } from "@nextwp/core";
  import templates from "@/templates";

  export default async function PageRoute(props: {
    params: { paths: string[] };
    searchParams?: { [key: string]: string | string[] | undefined };
  }) {
    return (
      <WordpressTemplate
        templates={templates}
        params={props?.params}
        searchParams={props?.searchParams}
      />
    );
  }

  export { generateMetadata, generateStaticParams } from "@nextwp/core";
  ```

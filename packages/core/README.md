# @nextwp/core

<img width="1104" alt="image" src="https://github.com/CalebBarnes/nextwp/assets/24890515/cbecbc2a-e170-41a1-a0a6-2d3f3e69f1d8">

[![npm version](https://badge.fury.io/js/@nextwp%2Fcore.svg)](https://badge.fury.io/js/@nextwp%2Fcore) ![npm](https://img.shields.io/npm/dw/@nextwp%2Fcore)

# NextWP

Welcome to the new era of Headless WordPress development.

[Quickstart](https://www.nextwp.org/quickstart) | [Explore packages](https://www.nextwp.org/packages) | [Documentation](https://www.nextwp.org)

### What is NextWP?

NextWP is a library built on the WP REST API and Next.js App Router that streamlines the process of building super fast Headless WordPress sites with Next.js. It provides a set of tools and utilities to help you build interactive, dynamic, and performant sites with WordPress and Next.js.

[Why does NextWP use the WP REST API?](https://www.nextwp.org/faq/why-rest-api)

### Features

- [**Server Side Generation (SSG)**](https://www.nextwp.org/packages/nextwp/core/next-app-functions#generate-static-params): Effortlessly pre-render content from WordPress in your Next.js app.
- [**On-Demand Incremental Revalidation**](https://www.nextwp.org/packages/nextwp/core/route-handlers#revalidate): Revalidates pages on demand when content updates in WordPress.
- [**CMS Previews with Next.js Draft Mode**](https://www.nextwp.org/packages/nextwp/core/route-handlers#preview): Instantly preview your content changes while you work for a seamless editing experience.
- [**Sitemap Generation**](https://www.nextwp.org/packages/nextwp/core/next-app-functions#generate-sitemap): Automatically generates a sitemap.xml for your pages, posts, and optionally custom post types.
- **ACF Support**: Page data automatically includes the acf field from the REST API. Just enable "Show in REST API" for your field group.
- [**Flexible Content Component**](https://www.nextwp.org/packages/nextwp/core/components#flexible-content): Easily render ACF flexible content fields in your Next.js app.

## WordPress Theme

The easiest way to get started is to install [NextWP Headless Theme](https://www.nextwp.org/packages/wordpress/nextwp-headless-theme) in your WordPress site. This will install the required plugins and offer optional recommended plugins to improve the headless WP experience.

## Prerequisites

Ensure you have the following WordPress plugins installed:

- **Advanced Custom Fields**: Enables custom fields in WordPress.
- **Yoast SEO**: Provides SEO features for WordPress sites.
- [**NextWP - Headless Toolkit**](https://www.nextwp.org/packages/wordpress/nextwp-toolkit-plugin): Essential for CMS previews in NextJS.

## Installation

Install `@nextwp/core` in your Next.js project:

```bash
npm install @nextwp/core
```

## Quick Start

One click deploy a new project to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FCalebBarnes%2Fnextwp-starter&env=NEXT_PUBLIC_WP_URL,WP_APPLICATION_PASSWORD,NEXT_PREVIEW_SECRET,REVALIDATE_SECRET_KEY&envDescription=These%20environment%20variables%20are%20necessary%20for%20the%20Next.js%20to%20WordPress%20connection%20via%20NextWP.%20Refer%20to%20the%20NextWP%20docs%20for%20more%20information.&envLink=https%3A%2F%2Fwww.nextwp.org%2Fenvironment-variables&demo-title=NextWP%20Starter&demo-description=A%20Next.js%20Headless%20WordPress%20site%20built%20with%20NextWP.&demo-url=https%3A%2F%2Fnextwp-starter.vercel.app&demo-image=https%3A%2F%2Fraw.githubusercontent.com%2FCalebBarnes%2Fnextwp-starter%2Fmain%2Fscreenshot.png)

Or, you can get up and running by using the cli tool `create-nextwp-app`:

```bash
npx create-nextwp-app
```

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

Read the [NextWP docs](https://www.nextwp.org/) for more information on how to use `@nextwp/core`.

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

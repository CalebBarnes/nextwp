import React from "react";
import { notFound } from "next/navigation";
import { draftMode } from "next/headers";
import type { WpPage } from "../types";
import type { ArchivePageData } from "../api/get-page-data/get-archive-page";
import { deepMerge } from "../utils/deep-merge";
import type { Templates } from "../utils/get-template";
import { getTemplate } from "../utils/get-template";
import { getPageData } from "../api/get-page-data/get-page-data";
import { debug } from "../utils/debug-log";
import { PreviewToolbar } from "./preview-toolbar";
import { RouteParamsDebug } from "./route-params-debug";

export type SearchParams = Record<string, string | string[] | undefined>;
export type RouteParams = { paths?: string[] };

/**
 * This component is the main entry point for rendering a WordPress page.
 * It will fetch the data for the page and render the appropriate template.
 * It also handles preview mode.
 *
 * Read the docs for more info:
 * @see https://www.nextwp.org/packages/nextwp/core/components#wordpress-template
 */
export async function WordpressTemplate(props: {
  params?: RouteParams;
  templates: Templates;
  searchParams?: SearchParams;
  supressWarnings?: boolean;
}) {
  const { params, templates, searchParams, supressWarnings, ...rest } = props;
  const uri = params?.paths?.join("/") || "/";

  const preview = draftMode();

  const { data, archive, previewData } = await getPageData(uri);
  // console.log({ data, archive, previewData });
  if (!data && !previewData && !archive) {
    debug.warn(`No data found for uri: ${uri}`);
    notFound();
  }

  const PageTemplate = getTemplate({
    uri,
    data,
    archive,
    templates,
    supressWarnings,
  });

  if (!PageTemplate) {
    notFound();
  }

  let mergedData = data;
  if (previewData && mergedData) {
    // eslint-disable-next-line no-console -- only logging in preview mode
    console.log({ previewData });
    mergedData = deepMerge<WpPage | ArchivePageData>(mergedData, previewData); // Merge previewData into mergedData
  }

  return (
    <>
      {process.env.ROUTE_PARAMS_DEBUG_ENABLED ? (
        <RouteParamsDebug params={params} />
      ) : null}

      <PageTemplate
        archive={archive}
        data={mergedData}
        isPreview={preview.isEnabled}
        params={params}
        searchParams={searchParams}
        uri={uri}
        {...rest}
      />

      {preview.isEnabled ? (
        <PreviewToolbar
          data={data}
          previewData={previewData}
          searchParams={searchParams}
          uri={uri}
        />
      ) : null}
    </>
  );
}

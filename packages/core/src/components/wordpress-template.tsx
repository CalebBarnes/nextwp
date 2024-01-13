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
export async function WordpressTemplate({
  params,
  templates,
  searchParams,
  supressWarnings,
  ...rest
}: {
  params?: RouteParams;
  templates: Templates;
  searchParams?: SearchParams;
  supressWarnings?: boolean;
}) {
  const uri = params?.paths?.join("/") || "/";
  const preview = draftMode();
  const { data, archive, previewData, taxonomy, term } = await getPageData(uri);
  // console.log({ data, archive, previewData, taxonomy, term });
  if (!data && !previewData && !archive && !taxonomy && !term) {
    return (
      <>
        {process.env.ROUTE_PARAMS_DEBUG_ENABLED ? (
          <RouteParamsDebug params={params} />
        ) : null}

        <div>Temporary 404 page here!</div>
        <div>missing data, previewData, archive, taxonomy, and term</div>
      </>
    );
    // notFound();
  }

  const PageTemplate = getTemplate({
    uri,
    data,
    archive,
    taxonomy,
    term,
    templates,
    supressWarnings,
  });

  if (!PageTemplate) {
    return (
      <>
        {process.env.ROUTE_PARAMS_DEBUG_ENABLED ? (
          <RouteParamsDebug params={params} />
        ) : null}

        <div>Temporary 404 page here!</div>
        <div>missing PageTemplate</div>
      </>
    );
    // notFound();
  }

  let mergedData = data;
  if (previewData && mergedData) {
    // console.log({ previewData });
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
        taxonomy={taxonomy}
        term={term}
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

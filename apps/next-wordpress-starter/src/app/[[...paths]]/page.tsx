import type { RouteParams, SearchParams } from "@nextwp/core";
import {
  WordpressTemplate,
  generateStaticParams as nextWpStaticParams,
} from "@nextwp/core";
import templates from "@/templates";

export default function PageRoute(props: {
  params: RouteParams;
  searchParams?: SearchParams;
}) {
  return (
    <WordpressTemplate
      params={props.params}
      searchParams={props.searchParams}
      templates={templates}
    />
  );
}

export { generateMetadata } from "@nextwp/core";

export async function generateStaticParams() {
  return nextWpStaticParams({
    postTypes: ["pages", "posts", "product"],
  });
}

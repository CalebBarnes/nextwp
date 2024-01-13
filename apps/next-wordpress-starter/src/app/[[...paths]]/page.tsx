import type { RouteParams, SearchParams } from "@nextwp/core";
import { WordpressTemplate } from "@nextwp/core";
import templates from "@/templates";

export default function PageRoute(props: {
  params: RouteParams;
  searchParams?: SearchParams;
}) {
  console.log("PageRoute", props);
  return (
    <WordpressTemplate
      params={props.params}
      searchParams={props.searchParams}
      templates={templates}
    />
  );
}

export { generateMetadata, generateStaticParams } from "@nextwp/core";

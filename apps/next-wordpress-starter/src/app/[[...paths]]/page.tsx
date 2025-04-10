import {
  WordpressTemplate,
  generateStaticParams as nextWpStaticParams,
} from "@nextwp/core";
import templates from "@/templates";

export default async function PageRoute(props: {
  params: Promise<{ paths: string[] }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  return (
    <WordpressTemplate
      params={params}
      searchParams={searchParams}
      templates={templates}
    />
  );
}
export { generateMetadata } from "@nextwp/core";

export async function generateStaticParams() {
  return nextWpStaticParams({
    postTypes: ["pages", "posts"],
  });
}

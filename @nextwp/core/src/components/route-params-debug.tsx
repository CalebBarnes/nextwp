import type { RouteParams, SearchParams } from "./wordpress-template";

export function RouteParamsDebug(props: {
  params?: RouteParams;
  searchParams?: SearchParams;
}) {
  const uri = props.params?.paths?.join("/") || "/";

  return (
    <div className="bg-red-500">
      <h1>Route Params</h1>

      <span>
        uri: <code>{uri}</code>
      </span>

      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}

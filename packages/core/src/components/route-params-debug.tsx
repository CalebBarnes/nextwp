import type { RouteParams } from "./wordpress-template";

export function RouteParamsDebug(props: { params?: RouteParams }) {
  const uri = props.params?.paths?.join("/") || "/";

  return (
    <div className="m-10 p-10 border-red-500 border">
      <p>Route Params</p>

      <span>
        uri: <code>{uri}</code>
      </span>

      <pre>{JSON.stringify(props, null, 2)}</pre>
    </div>
  );
}

import { type TemplateProps } from "@nextwp/core";

export function MovieArchive(props: TemplateProps) {
  const { uri, data, archive } = props;

  if ("items" in data) {
    console.log("items in data");
  }

  return (
    <div>
      <h1>Movie Archive</h1>
      <pre>
        <code>{JSON.stringify({ uri }, null, 2)}</code>
      </pre>

      {data?.items ? <p>items length: {data?.items?.length}</p> : null}

      <pre>
        <code>{JSON.stringify({ page: data.page }, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify({ items: data.items }, null, 2)}</code>
      </pre>
      <pre>
        <code>{JSON.stringify({ archive }, null, 2)}</code>
      </pre>
    </div>
  );
}

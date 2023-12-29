// import { getItems } from "@nextwp/core/src/api/get-items";

export default function MovieArchive(props) {
  const { uri, data, archive } = props;
  //   console.log({ data });

  // const req = await fetch(
  //   `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/${archive?.rest_base}`
  // );
  // const movies = await req.json();
  // console.log(movies.length);

  return (
    <div>
      <h1>Movie Archive</h1>
      <pre>
        <code>{JSON.stringify({ uri }, null, 2)}</code>
      </pre>

      <p>items length: {data.items.length}</p>

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

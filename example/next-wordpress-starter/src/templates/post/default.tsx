export default function DefaultPostTemplate({ uri, data }) {
  return (
    <div>
      <h1>Default Post Template for {uri}</h1>

      <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}

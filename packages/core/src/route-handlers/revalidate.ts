import { revalidatePath } from "next/cache";

export async function revalidate(request: Request) {
  let paths: string[] | undefined;
  try {
    const body = (await request.json()) as { paths: string[] };
    paths = body.paths;
  } catch (err) {
    return new Response(JSON.stringify({ message: "Invalid payload" }));
  }

  if (!paths.length) {
    return new Response(JSON.stringify({ message: "No paths" }));
  }

  const correctPaths = paths.filter((path: string) => path.startsWith("/"));

  try {
    for (const path of correctPaths) {
      revalidatePath(path);
    }

    return new Response(
      JSON.stringify({
        revalidated: true,
        message: `Paths revalidated: ${correctPaths.join(", ")}`,
      })
    );
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }));
  }
}

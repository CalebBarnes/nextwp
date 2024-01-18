import { getAllItems } from "../../api/get-all-items";

export async function getSingleItemsStaticParams({
  postTypes,
}: {
  postTypes: string[];
}) {
  const staticParams: { paths: string[] }[] = [];
  const allItems = await getAllItems(postTypes);

  for (const item of allItems) {
    if (!item.path) {
      continue;
    }
    const pathBreadcrumbs = item.path.split("/").filter((x) => x);
    staticParams.push({
      paths: [...pathBreadcrumbs],
    });
  }

  return staticParams;
}

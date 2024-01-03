import type { WpLink, Menu, WpMenuItem } from "../types";

type MenuResponse = {
  id: number;
  title: {
    rendered: string;
  };
  status: string;
  url: string;
  attr_title: string;
  description: string;
  type: string;
  type_label: string;
  object: string;
  object_id: number;
  parent: number;
  menu_order: number;
  target: string;
  classes: string[];
  xfn: string[];
  invalid: boolean;
  meta: any;
  menus: number;
  acf: any[]; // This might include WpImage or WpLink
  _links: WpLink[]; // Replacing LinksType with WpLink
}[];

const args = {
  headers: {
    Authorization: `Basic ${btoa(process.env.WP_APPLICATION_PASSWORD!)}`,
  },
};

/**
 * Fetches menu items from WordPress.
 * @see https://www.nextwp.org/packages/nextwp/core/functions#get-menu-items
 */
export async function getMenuItems({
  slug,
}: {
  /**
   * The slug of the menu to fetch.
   */
  slug: string;
}): Promise<WpMenuItem[]> {
  if (!process.env.WP_APPLICATION_PASSWORD) {
    throw new Error(`'WP_APPLICATION_PASSWORD' environment variable is required for function 'getMenuItems'.

Check your ${
      process.env.NODE_ENV === "development"
        ? "local .env file"
        : "deployment's environment variables."
    }.

You can generate an application password in your WordPress admin under Users > Your Profile > Application Passwords. 
Make sure the user has the required permissions to view menus.

${
  process.env.NEXT_PUBLIC_WP_URL
    ? `See ${process.env.NEXT_PUBLIC_WP_URL}/wp-admin/profile.php#application-passwords-section`
    : ""
}`);
  }

  // get menu by slug
  const menu = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/menus?slug=${slug}`,
    args
  ).then(async (res) => {
    try {
      const json = (await res.json()) as {
        id: number;
        name: string;
        slug: string;
        items: number[];
      }[];
      return json[0];
    } catch (err) {
      throw new Error(`Error fetching menu with slug ${slug}: ${err.message}`);
    }
  });

  if (!menu.id) {
    // handle missing menu
    const availableMenus = await fetch(
      `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/menus`,
      args
    ).then(async (res) => {
      try {
        const json = (await res.json()) as {
          id: number;
          name: string;
          slug: string;
          items: number[];
        }[];
        return json.map((menu) => `"${menu.slug}"`);
      } catch (err) {
        throw new Error(`Error fetching menus`);
      }
    });

    throw new Error(
      `No menu found with slug "${slug}".\nAvailable menu slugs: ${availableMenus.join(
        ", "
      )}`
    );
  }

  // get menu items by menu id
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_WP_URL}/wp-json/wp/v2/menu-items?menus=${menu.id}&acf_format=standard`,
    args
  );

  let data;
  try {
    data = (await req.json()) as MenuResponse;
  } catch (err: any) {
    throw new Error(
      `Error fetching menu items for menu id ${menu.id}: ${err.message}`
    );
  }

  return structureMenuItems(data);
}

/**
 * Structure menu items into a tree with childItems instead of a single shallow array that the REST API returns.
 */
function structureMenuItems(menuItems: MenuResponse): Menu {
  // Create a map for easy lookup of child items
  const itemsById = new Map(
    menuItems.map((item) => [item.id, { ...item, childItems: [] }])
  );

  // The final structured menu items
  const structuredItems: Menu = [];

  // Iterate over the menu items to structure them
  for (const item of menuItems) {
    const structuredItem = itemsById.get(item.id) as WpMenuItem;
    structuredItem.label = item.title.rendered;
    structuredItem.path = item.url.replace(process.env.NEXT_PUBLIC_WP_URL!, "");

    if (item.parent === 0) {
      // This is a top-level menu item
      structuredItems.push(structuredItem);
    } else {
      // This item is a child of another item
      const parentItem = itemsById.get(item.parent) as WpMenuItem | undefined;
      if (parentItem) {
        parentItem.childItems?.push(structuredItem);
      }
    }
  }

  return structuredItems;
}

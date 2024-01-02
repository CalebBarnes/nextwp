import { getMenuItems, type WpMenuItem } from "@nextwp/core";

export default async function MenuItems({ className }) {
  const menuItems = await getMenuItems({ slug: "main-menu" });

  return (
    <div className={className}>
      {menuItems?.map?.((item: WpMenuItem, index) => {
        return (
          <a href={item.path} key={index} target={item.target}>
            {item.label}
          </a>
        );
      })}
    </div>
  );
}

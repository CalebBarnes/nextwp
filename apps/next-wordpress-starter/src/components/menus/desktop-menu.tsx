"use client";

import Link from "next/link";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import type { WpMenuItem } from "@nextwp/core";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function DesktopMenu({
  menuItems,
  className,
}: {
  menuItems?: WpMenuItem[];
  className?: string;
}) {
  return (
    <nav className={cn("flex space-x-4", className)}>
      {menuItems?.map((menuItem) => {
        if (menuItem?.childItems?.length > 0) {
          return (
            <DropdownMenu key={menuItem.id}>
              <DropdownMenuTrigger className="inline-flex items-center gap-x-1">
                <span>{menuItem.label}</span>
                <ChevronDownIcon aria-hidden="true" className="h-5 w-5" />
              </DropdownMenuTrigger>

              <DropdownMenuContent>
                {menuItem.childItems.map((childItem) => {
                  return (
                    <DropdownMenuItem asChild key={childItem.id}>
                      <Link
                        className="hover:cursor-pointer"
                        href={childItem.path}
                      >
                        {childItem.label}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        }

        return (
          <Link href={menuItem.path} key={menuItem.id}>
            {menuItem.label}
          </Link>
        );
      })}
    </nav>
  );
}

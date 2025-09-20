"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useCallback } from "react";

export function NavMenu({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
      icon: React.ElementType;
    }[];
  }[];
}) {
  const pathname = usePathname();

  const getClasses = useCallback(
    (url: string) => {
      let classes =
        "hover:bg-whtie hover:text-secondary hover:border-secondary hover:border-r-3 hover:border-b-1 hover:shadow-sm w-full flex items-center gap-3 px-4 py-5 rounded-lg transition-all duration-200 text-left font-medium shadow-sm border-b-1 border-white";
      if (pathname?.includes(url)) {
        classes +=
          "bg-blue-50 text-blue-700 border-r-3 border-blue-600 border-b-1";
      }
      return classes;
    },
    [items]
  );

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="font-bold !p-0 text-md mb-1">
        Menu
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          // Open if parent is active or pathname matches any child
          const shouldOpen =
            item.isActive ||
            pathname === item.url ||
            item.items?.some((subItem) => pathname.startsWith(subItem.url));

          if (!item?.items) {
            return (
              <SidebarMenuItem key={item.title}>
                <a href={item.url}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={getClasses(item.url)}
                  >
                    {item.icon && <item.icon className="w-12 h-12" />}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </a>
              </SidebarMenuItem>
            );
          }

          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={shouldOpen}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={getClasses(item.url)}
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>

                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a
                            href={subItem.url}
                            className={
                              pathname === subItem.url ||
                              subItem.url?.includes("view")
                                ? "font-bold"
                                : ""
                            }
                          >
                            {subItem.icon && <subItem.icon />}
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

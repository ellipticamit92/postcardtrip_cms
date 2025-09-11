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

  const getClasses = (url: string) => {
    let classes =
      "hover:bg-secondary hover:text-white p-3 py-5 text-sm rounded-none";
    if (pathname?.includes(url)) {
      classes += " bg-primary text-primary-foreground font-semibold";
    }
    return classes;
  };

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

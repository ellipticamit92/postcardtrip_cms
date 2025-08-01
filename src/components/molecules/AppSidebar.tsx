"use client";
import React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { SIDEBAR_URLS } from "@/consttants/constant";
import { AddUsers } from "./AddUsers";
import { NavMenu } from "./NavMenu";
import { NavUser } from "./NavUser";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AddUsers users={SIDEBAR_URLS.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMenu items={SIDEBAR_URLS.navMain} />
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        <NavUser user={SIDEBAR_URLS.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

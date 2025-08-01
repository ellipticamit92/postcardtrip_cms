"use client";

import React from "react";
import { SessionProvider } from "next-auth/react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/molecules/AppSidebar";
import { Header } from "@/components/molecules/Header";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <SessionProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <Header />
            <div className="px-10">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-4">{children}</div>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </SessionProvider>
    </div>
  );
}

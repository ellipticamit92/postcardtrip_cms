"use client";

import React, { useState } from "react";
import { SessionProvider } from "next-auth/react";

export default function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [notificationOpen, setNotificationOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-100">
      <SessionProvider>
        <div className="flex-1 flex flex-col">
          <main className="flex-1 overflow-auto pl-15">{children}</main>
        </div>
      </SessionProvider>
    </div>
  );
}

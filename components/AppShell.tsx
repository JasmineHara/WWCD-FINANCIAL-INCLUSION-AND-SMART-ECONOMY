"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import FloatingChat from "@/components/FloatingChat";

const BARE_ROUTES = ["/login"];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  if (BARE_ROUTES.some((route) => pathname.startsWith(route))) {
    return <>{children}</>;
  }

  return (
    <>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div
        className={`flex min-h-screen flex-col transition-[margin] duration-200 motion-reduce:transition-none ${
          collapsed ? "ml-20" : "ml-72"
        }`}
      >
        <Header />
        <main className="flex-1 px-8 pb-8">{children}</main>
      </div>
      <FloatingChat />
    </>
  );
}

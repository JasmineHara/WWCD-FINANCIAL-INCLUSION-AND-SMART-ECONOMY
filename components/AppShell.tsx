"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const BARE_ROUTES = ["/login"];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    if (BARE_ROUTES.some((route) => pathname.startsWith(route))) {
    return <>{children}</>;
    }

    return (
    <>
        <Sidebar />
        <div className="ml-56 flex min-h-screen flex-col">
        <Header />
        <main className="flex-1 px-8 pb-8">{children}</main>
    </div>
    </>
    );
}

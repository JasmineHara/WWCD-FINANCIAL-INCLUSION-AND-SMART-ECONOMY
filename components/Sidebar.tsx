// Sidebar - Keisha
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Database,
  GraduationCap,
  LayoutGrid,
  Lightbulb,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  Users,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/tracker", label: "Data Tracker", icon: Database },
  { href: "/tips", label: "Tip of the Day", icon: Lightbulb },
  { href: "/community", label: "Community Forum", icon: Users },
  { href: "/mentor", label: "Find a Mentor", icon: Search },
];

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
};

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`fixed inset-y-0 left-0 flex flex-col overflow-x-hidden overflow-y-auto bg-surface py-8 transition-[width] duration-200 motion-reduce:transition-none ${
        collapsed ? "w-20 px-3" : "w-72 px-6"
      }`}
    >
      {/* Logo + Brand Name + Collapse Button */}
      <div
        className={`mb-10 flex items-center ${
          collapsed ? "justify-center" : "justify-between px-2"
        }`}
      >
        {!collapsed ? (
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative h-9 w-9 shrink-0">
              <Image
                src="/mifi-logo.png"
                alt="mifi logo"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="font-heading text-3xl font-bold tracking-tight">
              mifi
            </span>
          </Link>
        ) : (
          <Link href="/" className="relative h-9 w-9 shrink-0" title="mifi">
            <Image
              src="/mifi-logo.png"
              alt="mifi logo"
              fill
              className="object-contain"
              priority
            />
          </Link>
        )}

        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Collapse sidebar"
            aria-expanded={!collapsed}
            className="rounded-lg p-2 transition hover:bg-bg cursor-pointer"
          >
            <PanelLeftClose className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Collapse button when sidebar is collapsed */}
      {collapsed && (
        <button
          type="button"
          onClick={onToggle}
          aria-label="Expand sidebar"
          aria-expanded={!collapsed}
          className="mb-6 mx-auto rounded-lg p-2 transition hover:bg-bg cursor-pointer"
        >
          <PanelLeftOpen className="h-6 w-6" aria-hidden="true" />
        </button>
      )}

      <nav aria-label="Main" className="flex flex-col gap-2">
        {links.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              aria-current={active ? "page" : undefined}
              className={`flex items-center rounded-lg py-2.5 text-lg transition hover:bg-bg ${
                collapsed ? "justify-center" : "gap-4 px-2"
              } ${active ? "font-bold" : ""}`}
            >
              <Icon className="h-6 w-6 shrink-0" aria-hidden="true" />
              <span className={collapsed ? "sr-only" : ""}>{label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/mentor/become"
        title={collapsed ? "Become a Mentor" : undefined}
        className={`mt-8 flex items-center justify-center rounded-lg bg-light-yellow text-lg text-black transition hover:brightness-95 ${
          collapsed ? "p-3" : "px-4 py-3"
        }`}
      >
        {collapsed ? (
          <GraduationCap className="h-6 w-6" aria-hidden="true" />
        ) : null}
        <span className={collapsed ? "sr-only" : ""}>Become a Mentor</span>
      </Link>

      <Link
        href="/chat"
        aria-label="Open chatbot"
        className={`mt-auto rounded-full bg-accent transition hover:brightness-110 ${
          collapsed ? "mx-auto h-12 w-12" : "ml-4 h-20 w-20"
        }`}
      />
    </aside>
  );
}
"use client";

import Link from "next/link";
import { ChevronDown, Menu } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background">
      <div className="flex h-14 items-center gap-2 px-3">
        <SidebarTrigger className="h-9 w-9">
          <Menu className="h-5 w-5" />
        </SidebarTrigger>

        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span>Spendify</span>
        </Link>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
              T
            </div>
            <span className="hidden sm:block text-sm">Temirlan</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </header>
  );
}

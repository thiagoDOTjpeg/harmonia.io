"use client";

import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { Button, HarmoniaLogo } from "@harmonia/ui";
import { Menu } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/95 px-4 backdrop-blur md:hidden">
        <Link
          href="/dashboard"
          className="hover:opacity-90 transition-opacity"
          aria-label="Harmonia Dashboard"
        >
          <HarmoniaLogo className="h-6 w-auto text-harmonia-lime" />
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-foreground"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </header>

      <DashboardSidebar
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

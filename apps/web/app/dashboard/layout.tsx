"use client";

import { ConsoleHeader } from "@/components/console-header";
import { ConsoleSubnav } from "@/components/console-subnav";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { OnboardingTourProvider } from "@/components/onboarding-tour";
import React, { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <OnboardingTourProvider>
      <div className="flex min-h-screen flex-col bg-background">
        {/* Global Enterprise Console Header (Cloudflare style) */}
        <ConsoleHeader onOpenMobileSidebar={() => setMobileOpen(true)} />

        {/* Subnav Tabs Bar */}
        <ConsoleSubnav />

        <div className="flex flex-1 min-h-[calc(100vh-6.5rem)]">
          <DashboardSidebar
            mobileOpen={mobileOpen}
            onCloseMobile={() => setMobileOpen(false)}
          />

          <main className="flex-1 overflow-y-auto min-w-0 bg-background/90">
            {children}
          </main>
        </div>
      </div>
    </OnboardingTourProvider>
  );
}

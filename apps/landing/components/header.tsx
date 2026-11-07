"use client";

import { Button, HarmoniaLogo } from "@harmonia/ui";
import { motion } from "framer-motion";
import { Github } from "lucide-react";
import Link from "next/link";
import type React from "react";

interface HeaderProps {
  setOpen: React.Dispatch<boolean>;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
}

const NAV_ITEMS = [
  { id: "palco", label: "Comparativo" },
  { id: "jornada", label: "Como funciona" },
  { id: "arquitetura", label: "Arquitetura" },
  { id: "self-host", label: "Self-Host" },
];

export function Header({
  setOpen,
  activeSection = "hero",
  onNavigate,
}: HeaderProps) {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(id);
    }
  };

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-5 z-50 w-full px-4 sm:px-6 pointer-events-none"
    >
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between rounded-full border border-white/[0.08] bg-zinc-950/80 px-4 sm:px-5 backdrop-blur-md pointer-events-auto">
        <Link
          href="/#hero"
          onClick={(e) => handleNavClick(e, "hero")}
          className="flex items-center hover:opacity-90 transition-opacity py-1"
          aria-label="Harmonia Início"
        >
          <HarmoniaLogo className="h-7 sm:h-7.5 w-auto text-harmonia-lime" />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleNavClick(e, item.id)}
                className={`relative py-1 text-xs transition-colors duration-200 ${
                  isActive
                    ? "text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="headerActiveIndicator"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-harmonia-lime"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </a>
            );
          })}
          <Link
            href="/docs"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Docs
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/thiagoDOTjpeg/harmonia.io"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <Github className="h-4 w-4" />
          </Link>
          <Button
            size="sm"
            className="h-7 rounded-full px-3.5 text-xs font-semibold bg-harmonia-lime text-harmonia-green hover:bg-harmonia-lime/90 transition-all shadow-[0_0_14px_rgba(217,242,122,0.22)]"
            onClick={() => setOpen(true)}
          >
            Pedir acesso
          </Button>
        </div>
      </div>
    </motion.header>
  );
}

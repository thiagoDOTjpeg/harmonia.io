"use client";

import { Button, HarmoniaLogo } from "@harmonia/ui";
import { AnimatePresence, motion } from "framer-motion";
import { Github, Menu, X } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ) => {
    setMobileMenuOpen(false);
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
      className="fixed inset-x-0 top-3 sm:top-5 z-50 w-full px-3 sm:px-6 pointer-events-none"
    >
      <div className="mx-auto flex h-12 max-w-3xl items-center justify-between rounded-full border border-white/[0.08] bg-zinc-950/85 px-3.5 sm:px-5 backdrop-blur-md pointer-events-auto shadow-lg">
        <Link
          href="/#hero"
          onClick={(e) => handleNavClick(e, "hero")}
          className="flex items-center hover:opacity-90 transition-opacity py-1 shrink-0"
          aria-label="Harmonia Início"
        >
          <HarmoniaLogo className="h-6 sm:h-7.5 w-auto text-harmonia-lime" />
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

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="https://github.com/thiagoDOTjpeg/harmonia.io"
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
          >
            <Github className="h-4 w-4" />
          </Link>

          <Button
            size="sm"
            className="h-7 rounded-full px-3 sm:px-3.5 text-xs font-semibold bg-harmonia-lime text-harmonia-green hover:bg-harmonia-lime/90 transition-all shadow-[0_0_14px_rgba(217,242,122,0.22)]"
            onClick={() => {
              setMobileMenuOpen(false);
              setOpen(true);
            }}
          >
            Pedir acesso
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-foreground md:hidden p-0"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mx-auto mt-2 max-w-xs rounded-2xl border border-white/10 bg-zinc-950/95 p-3 backdrop-blur-xl pointer-events-auto md:hidden shadow-2xl space-y-1"
          >
            {NAV_ITEMS.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2 text-xs transition-colors ${
                    isActive
                      ? "bg-white/10 font-semibold text-foreground text-harmonia-lime"
                      : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && <span className="h-1.5 w-1.5 rounded-full bg-harmonia-lime" />}
                </a>
              );
            })}
            <div className="border-t border-white/[0.08] pt-1 mt-1">
              <Link
                href="/docs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between rounded-xl px-3.5 py-2 text-xs text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
              >
                <span>Documentação</span>
                <span className="font-mono text-[10px] uppercase text-muted-foreground/70">Docs</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

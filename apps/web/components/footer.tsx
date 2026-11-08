import { HarmoniaMark } from "@harmonia/ui";
import { ExternalLink, Github, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border/80 bg-background/60 backdrop-blur-xs py-4 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <HarmoniaMark className="h-3.5 w-auto text-harmonia-lime" />
          <span className="font-mono text-[11px]">
            © {new Date().getFullYear()} Harmonia Open Source • Enterprise-Grade Music Sync
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] font-medium">
          <Link
            href="https://github.com/thiagoDOTjpeg/harmonia"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <Github className="h-3 w-3" />
            GitHub
          </Link>
        </div>
      </div>
    </footer>
  );
}

"use client";

import Link from "next/link";
import { ArrowUpRight, Moon, Sun, Terminal } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { href: "#platform", label: "Platform" },
  { href: "#capabilities", label: "Capabilities" },
  { href: "#architecture", label: "Architecture" },
  { href: "#deploy", label: "Deploy" },
];

export function SiteHeader() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 text-foreground">
          <span className="flex size-8 items-center justify-center rounded-md border border-border bg-card shadow-xs">
            <Terminal className="size-4 text-foreground" aria-hidden="true" />
          </span>
          <span className="font-mono text-sm font-semibold tracking-wider uppercase">AMTRAK</span>
          <span className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground sm:inline-block">
            v2.2
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Toggle color theme"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            <Sun className="size-4 scale-100 rotate-0 transition-transform dark:scale-0 dark:-rotate-90" />
            <Moon className="absolute size-4 scale-0 rotate-90 transition-transform dark:scale-100 dark:rotate-0" />
          </Button>
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <a href="https://github.com/jcald81-art/AMTRAK" target="_blank" rel="noreferrer">
              GitHub
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </Button>
          <Button asChild size="sm">
            <Link href="/dashboard">Open Console</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

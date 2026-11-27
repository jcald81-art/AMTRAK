import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="flex flex-col gap-1">
          <span className="font-mono text-sm font-semibold tracking-wider text-foreground uppercase">
            AMTRAK
          </span>
          <span className="text-xs text-muted-foreground">
            Autonomous Penetration Testing Platform · AGPL-3.0 License
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">
            Dashboard
          </Link>
          <Link href="/function/tasks" className="hover:text-foreground">
            Tasks
          </Link>
          <Link href="/function/findings" className="hover:text-foreground">
            Findings
          </Link>
          <Link href="/chat" className="hover:text-foreground">
            Chat
          </Link>
          <Link href="/system/llm" className="hover:text-foreground">
            LLM Config
          </Link>
          <a
            href="https://github.com/jcald81-art/AMTRAK"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

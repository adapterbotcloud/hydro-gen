"use client";

import { Icons } from "@/components/Icons";

interface TopbarProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  return (
    <header className="px-5 py-2.5 border-b border-hydro-border flex items-center justify-between bg-hydro-card min-h-12">
      <button
        onClick={toggleSidebar}
        className="p-1 text-hydro-textMuted hover:text-hydro-accent transition-colors"
      >
        <Icons.Menu />
      </button>

      <div className="flex items-center gap-3">
        {/* Status indicator */}
        <span className="flex items-center gap-1.5 text-[11px] text-hydro-accentDim font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-hydro-accent inline-block" />
          SISTEMA ONLINE
        </span>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-hydro-accentGlow border border-hydro-border flex items-center justify-center text-[13px] text-hydro-accent font-bold">
          GP
        </div>
      </div>
    </header>
  );
}

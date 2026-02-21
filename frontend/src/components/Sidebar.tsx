"use client";

import { PageType } from "@/app/page";
import { Icons } from "@/components/Icons";
import clsx from "clsx";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  locked?: boolean;
  isOpen: boolean;
}

function NavItem({ icon, label, active, onClick, locked, isOpen }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={clsx(
        "flex items-center gap-2.5 px-4 py-2.5 rounded-lg w-full text-left transition-all duration-200",
        active && "bg-hydro-accentGlow border border-hydro-borderHover text-hydro-accent font-semibold",
        !active && !locked && "hover:bg-hydro-accentGlow2 hover:border-hydro-border border border-transparent text-hydro-textMuted",
        locked && "opacity-50 cursor-not-allowed text-hydro-textDim",
      )}
    >
      <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
      {isOpen && (
        <>
          <span className="text-sm">{label}</span>
          {locked && <Icons.Lock className="ml-auto" />}
        </>
      )}
    </button>
  );
}

interface SidebarProps {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  isOpen: boolean;
}

export default function Sidebar({ activePage, setActivePage, isOpen }: SidebarProps) {
  return (
    <aside
      className={clsx(
        "flex flex-col border-r border-hydro-border bg-gradient-to-b from-hydro-card to-hydro-bg transition-all duration-300",
        isOpen ? "w-60 min-w-60" : "w-16 min-w-16"
      )}
    >
      {/* Logo */}
      <div
        className={clsx(
          "flex items-center gap-2.5 border-b border-hydro-border min-h-[70px]",
          isOpen ? "px-5 py-5" : "px-3 py-5 justify-center"
        )}
      >
        <Icons.H2 />
        {isOpen && (
          <div>
            <div className="font-mono text-base font-bold text-hydro-accent">
              HYDRO GEN
            </div>
            <div className="text-[10px] text-hydro-textDim tracking-[2px]">
              CEARÁ • H₂ VERDE
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 mt-2">
        <NavItem
          icon={<Icons.Chat />}
          label="Assistente"
          active={activePage === "chat"}
          onClick={() => setActivePage("chat")}
          isOpen={isOpen}
        />
        <NavItem
          icon={<Icons.Simulate />}
          label="Simulação"
          active={activePage === "simulate"}
          onClick={() => setActivePage("simulate")}
          isOpen={isOpen}
        />
        <NavItem
          icon={<Icons.Dashboard />}
          label="Dashboard"
          active={activePage === "dashboard"}
          onClick={() => setActivePage("dashboard")}
          isOpen={isOpen}
        />
        <NavItem
          icon={<Icons.Docs />}
          label="Documentos"
          active={activePage === "docs"}
          onClick={() => setActivePage("docs")}
          isOpen={isOpen}
        />
      </nav>

      {/* Footer */}
      {isOpen && (
        <div className="mt-auto p-4 border-t border-hydro-border">
          <div className="p-3 bg-hydro-accentGlow border border-hydro-border rounded-lg mb-3">
            <div className="text-[11px] text-hydro-accentDim font-semibold mb-1">
              PLANO GRATUITO
            </div>
            <div className="text-[10px] text-hydro-textDim leading-relaxed">
              Consultas básicas. Para simulação e relatórios, contrate o plano SaaS.
            </div>
          </div>
          <div className="text-[10px] text-hydro-textDim text-center">
            v0.1.0-beta • Programa Centelha
          </div>
        </div>
      )}
    </aside>
  );
}

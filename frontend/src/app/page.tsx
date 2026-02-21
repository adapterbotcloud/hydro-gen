"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ChatPage from "@/components/pages/ChatPage";
import SimulationPage from "@/components/pages/SimulationPage";
import DashboardPage from "@/components/pages/DashboardPage";
import DocsPage from "@/components/pages/DocsPage";

export type PageType = "chat" | "simulate" | "dashboard" | "docs";

export default function Home() {
  const [activePage, setActivePage] = useState<PageType>("chat");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pages: Record<PageType, React.ReactNode> = {
    chat: <ChatPage />,
    simulate: <SimulationPage />,
    dashboard: <DashboardPage />,
    docs: <DocsPage />,
  };

  return (
    <div className="flex h-screen w-screen bg-hydro-bg overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        isOpen={sidebarOpen}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />

        {/* Page content */}
        <div className="flex-1 overflow-hidden">
          {pages[activePage]}
        </div>
      </div>
    </div>
  );
}

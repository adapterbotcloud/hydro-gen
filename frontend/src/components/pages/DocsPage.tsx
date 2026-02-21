"use client";

import { useState } from "react";
import { Icons } from "@/components/Icons";
import clsx from "clsx";

interface Document {
  title: string;
  type: string;
  date: string;
  relevance: number;
}

// Documents from prototype
const documents: Document[] = [
  { title: "Lei Estadual nº 18.032/2023 – Política Estadual do H2V", type: "Legislação", date: "2023", relevance: 98 },
  { title: "Plano Estratégico do Hub de H2V do Pecém", type: "Relatório", date: "2024", relevance: 95 },
  { title: "Resolução ANEEL nº 1.059/2023", type: "Regulação", date: "2023", relevance: 88 },
  { title: "Relatório IPECE – Indicadores Socioeconômicos do Ceará", type: "Dados", date: "2024", relevance: 85 },
  { title: "Marco Regulatório do H2V – PL 2.308/2023", type: "Legislação", date: "2023", relevance: 82 },
  { title: "Estudo BNDES – Oportunidades de H2V no Brasil", type: "Estudo", date: "2024", relevance: 79 },
];

const types = ["Todos", "Legislação", "Relatório", "Regulação", "Dados", "Estudo"];

export default function DocsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");

  const filtered = documents.filter(
    (d) => (filter === "Todos" || d.type === filter) &&
      (search === "" || d.title.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex items-center gap-2 mb-1">
        <Icons.Docs />
        <span className="text-hydro-accent font-mono text-[13px] font-bold">
          BASE DOCUMENTAL
        </span>
      </div>
      <p className="text-hydro-textDim text-[13px] mb-6">
        Navegue pela base de documentos indexados no sistema.
      </p>

      {/* Search */}
      <div className="flex gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar documentos..."
          className="flex-1 px-4 py-2.5 bg-hydro-card border border-hydro-border rounded-lg text-sm text-hydro-text placeholder:text-hydro-textDim focus:outline-none focus:border-hydro-accent"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={clsx(
              "px-3.5 py-1.5 rounded-full text-xs border transition-all",
              filter === t
                ? "bg-hydro-accentGlow border-hydro-accent text-hydro-accent"
                : "bg-transparent border-hydro-border text-hydro-textMuted hover:border-hydro-accent"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Document list */}
      <div className="flex flex-col gap-2">
        {filtered.map((doc, i) => (
          <div
            key={i}
            className="flex items-center gap-4 bg-hydro-card border border-hydro-border rounded-xl px-5 py-3.5 cursor-pointer transition-all hover:border-hydro-borderHover hover:bg-hydro-cardHover animate-fade-in-up"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            <div className="flex-1">
              <div className="text-sm text-hydro-text mb-1">{doc.title}</div>
              <div className="flex gap-3 text-[11px] text-hydro-textDim">
                <span className="px-2 py-0.5 rounded bg-hydro-accentGlow text-hydro-accentDim font-mono">
                  {doc.type}
                </span>
                <span>{doc.date}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono font-bold text-hydro-accent">
                {doc.relevance}%
              </div>
              <div className="text-[10px] text-hydro-textDim">relevância</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

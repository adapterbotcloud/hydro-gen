"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/Icons";
import { api } from "@/lib/api";
import clsx from "clsx";

const types = ["Todos", "Legislação", "Relatório", "Regulação", "Dados", "Estudo"];

interface Document {
  id: number;
  title: string;
  type: string;
  source: string;
  date?: string;
  chunk_count: number;
  is_indexed: boolean;
}

export default function DocsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Todos");

  const { data, isLoading } = useQuery({
    queryKey: ["documents", filter, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (filter !== "Todos") params.append("type", filter);
      if (search) params.append("search", search);
      const response = await api.get(`/documents?${params}`);
      return response.data;
    },
  });

  const documents: Document[] = data?.documents || [];

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
          className="flex-1 px-4 py-2.5 bg-hydro-card border border-hydro-border rounded-xl text-hydro-text text-sm outline-none focus:border-hydro-accent transition-colors"
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
        {isLoading ? (
          <div className="text-center py-10 text-hydro-textDim">
            Carregando documentos...
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-10 text-hydro-textDim">
            Nenhum documento encontrado
          </div>
        ) : (
          documents.map((doc, i) => (
            <div
              key={doc.id}
              className="flex items-center gap-4 bg-hydro-card border border-hydro-border rounded-xl px-5 py-3.5 cursor-pointer transition-all hover:border-hydro-borderHover hover:bg-hydro-cardHover animate-fade-in-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex-1">
                <div className="text-sm text-hydro-text mb-1">{doc.title}</div>
                <div className="flex gap-3 text-[11px] text-hydro-textDim">
                  <span className="px-2 py-0.5 rounded bg-hydro-accentGlow text-hydro-accentDim font-mono">
                    {doc.type}
                  </span>
                  <span>{doc.source}</span>
                  {doc.date && <span>{doc.date}</span>}
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-mono font-bold text-hydro-accent">
                  {doc.chunk_count}
                </div>
                <div className="text-[10px] text-hydro-textDim">chunks</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

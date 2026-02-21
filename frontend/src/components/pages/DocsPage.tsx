"use client";

import { useState } from "react";
import { Icons } from "@/components/Icons";
import clsx from "clsx";

interface Document {
  id: number;
  title: string;
  source: string;
  type: string;
  date: string;
  category: string;
  pages?: number;
  size?: string;
}

// Mock documents data
const mockDocuments: Document[] = [
  {
    id: 1,
    title: "Lei Estadual nº 18.314/2023 - Marco Legal do Hidrogênio Verde",
    source: "Diário Oficial do Ceará",
    type: "pdf",
    date: "2023-08-15",
    category: "Legislação",
    pages: 24,
    size: "1.2 MB"
  },
  {
    id: 2,
    title: "Decreto nº 35.216/2023 - Regulamentação do Marco Legal H2V",
    source: "Casa Civil do Ceará",
    type: "pdf",
    date: "2023-11-20",
    category: "Legislação",
    pages: 18,
    size: "890 KB"
  },
  {
    id: 3,
    title: "Portaria ADECE nº 12/2024 - Incentivos Fiscais para H2V",
    source: "ADECE",
    type: "pdf",
    date: "2024-02-10",
    category: "Legislação",
    pages: 12,
    size: "456 KB"
  },
  {
    id: 4,
    title: "Masterplan Hub Pecém 2030 - Complexo de Hidrogênio Verde",
    source: "CIPP S/A",
    type: "pdf",
    date: "2024-01-15",
    category: "Planejamento",
    pages: 156,
    size: "28.5 MB"
  },
  {
    id: 5,
    title: "Estudo de Impacto Socioeconômico do Hub H2V Pecém",
    source: "IPECE",
    type: "pdf",
    date: "2023-12-01",
    category: "Estudos",
    pages: 89,
    size: "12.3 MB"
  },
  {
    id: 6,
    title: "Atlas Eólico do Ceará 2024 - Potencial para H2V",
    source: "SEINFRA",
    type: "pdf",
    date: "2024-02-01",
    category: "Técnico",
    pages: 234,
    size: "45.7 MB"
  },
  {
    id: 7,
    title: "Relatório de Investimentos em Energia Renovável - Ceará",
    source: "ADECE",
    type: "pdf",
    date: "2024-03-01",
    category: "Relatórios",
    pages: 67,
    size: "8.9 MB"
  },
  {
    id: 8,
    title: "Estudo de Viabilidade H2V - Corredor Pecém-Europa",
    source: "EPE",
    type: "pdf",
    date: "2023-09-15",
    category: "Estudos",
    pages: 112,
    size: "18.2 MB"
  },
  {
    id: 9,
    title: "Análise Comparativa de Renováveis para Produção de H2",
    source: "ANEEL",
    type: "pdf",
    date: "2024-01-20",
    category: "Técnico",
    pages: 78,
    size: "6.4 MB"
  },
  {
    id: 10,
    title: "Mapa do Emprego Verde no Ceará 2024",
    source: "SINE/CE",
    type: "pdf",
    date: "2024-03-01",
    category: "Relatórios",
    pages: 45,
    size: "5.1 MB"
  },
  {
    id: 11,
    title: "Demanda Profissional H2V - Projeções 2025-2030",
    source: "SENAI",
    type: "pdf",
    date: "2024-02-15",
    category: "Estudos",
    pages: 56,
    size: "4.3 MB"
  },
  {
    id: 12,
    title: "Panorama H2V Ceará 2024 - Relatório Executivo",
    source: "SEDET",
    type: "pdf",
    date: "2024-01-01",
    category: "Relatórios",
    pages: 38,
    size: "3.8 MB"
  },
  {
    id: 13,
    title: "MoU Fortescue - Governo do Ceará (H2V)",
    source: "Casa Civil",
    type: "pdf",
    date: "2023-06-15",
    category: "Acordos",
    pages: 15,
    size: "2.1 MB"
  },
  {
    id: 14,
    title: "MoU EDP - CIPP (Projeto H2 Pecém)",
    source: "CIPP S/A",
    type: "pdf",
    date: "2023-07-22",
    category: "Acordos",
    pages: 12,
    size: "1.8 MB"
  },
  {
    id: 15,
    title: "Plano Estadual de Transição Energética 2050",
    source: "SEINFRA",
    type: "pdf",
    date: "2023-10-01",
    category: "Planejamento",
    pages: 198,
    size: "35.2 MB"
  }
];

const categories = ["Todos", "Legislação", "Planejamento", "Estudos", "Técnico", "Relatórios", "Acordos"];

function DocumentCard({ doc }: { doc: Document }) {
  const typeColors: Record<string, string> = {
    pdf: "#FF5252",
    doc: "#2196F3",
    xlsx: "#4CAF50",
  };

  return (
    <div className="bg-hydro-card border border-hydro-border rounded-xl p-4 hover:border-hydro-accent transition-all cursor-pointer group">
      <div className="flex items-start gap-3">
        <div 
          className="w-10 h-12 rounded flex items-center justify-center text-xs font-bold uppercase"
          style={{ backgroundColor: `${typeColors[doc.type] || '#666'}22`, color: typeColors[doc.type] || '#666' }}
        >
          {doc.type}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-hydro-text truncate group-hover:text-hydro-accent transition-colors">
            {doc.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5 text-xs text-hydro-textDim">
            <span>{doc.source}</span>
            <span>•</span>
            <span>{new Date(doc.date).toLocaleDateString('pt-BR')}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="px-2 py-0.5 bg-hydro-accentGlow border border-hydro-border rounded text-[10px] text-hydro-accentDim">
              {doc.category}
            </span>
            {doc.pages && (
              <span className="text-[10px] text-hydro-textDim">{doc.pages} págs</span>
            )}
            {doc.size && (
              <span className="text-[10px] text-hydro-textDim">{doc.size}</span>
            )}
          </div>
        </div>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-hydro-accentGlow rounded">
          <Icons.Download />
        </button>
      </div>
    </div>
  );
}

export default function DocsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const filteredDocs = mockDocuments.filter((doc) => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.source.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "Todos" || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex items-center gap-2 mb-1">
        <Icons.Docs />
        <span className="text-hydro-accent font-mono text-[13px] font-bold">
          BASE DE DOCUMENTOS
        </span>
      </div>
      <p className="text-hydro-textDim text-[13px] mb-6">
        {mockDocuments.length} documentos oficiais indexados • Atualização semanal
      </p>

      {/* Search and filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-hydro-textDim" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar documentos..."
            className="w-full pl-10 pr-4 py-2.5 bg-hydro-card border border-hydro-border rounded-lg text-sm text-hydro-text placeholder:text-hydro-textDim focus:outline-none focus:border-hydro-accent"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={clsx(
                "px-3 py-2 rounded-lg text-xs border transition-all",
                selectedCategory === cat
                  ? "bg-hydro-accentGlow border-hydro-accent text-hydro-accent"
                  : "bg-hydro-card border-hydro-border text-hydro-textMuted hover:border-hydro-accent"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-hydro-card border border-hydro-border rounded-xl p-4 text-center">
          <div className="text-2xl font-mono font-bold text-hydro-accent">{mockDocuments.length}</div>
          <div className="text-[11px] text-hydro-textDim mt-1">Total de Documentos</div>
        </div>
        <div className="bg-hydro-card border border-hydro-border rounded-xl p-4 text-center">
          <div className="text-2xl font-mono font-bold text-[#40C4FF]">
            {mockDocuments.filter(d => d.category === "Legislação").length}
          </div>
          <div className="text-[11px] text-hydro-textDim mt-1">Legislação</div>
        </div>
        <div className="bg-hydro-card border border-hydro-border rounded-xl p-4 text-center">
          <div className="text-2xl font-mono font-bold text-[#FFD740]">
            {mockDocuments.filter(d => d.category === "Estudos").length}
          </div>
          <div className="text-[11px] text-hydro-textDim mt-1">Estudos</div>
        </div>
        <div className="bg-hydro-card border border-hydro-border rounded-xl p-4 text-center">
          <div className="text-2xl font-mono font-bold text-[#CE93D8]">
            {mockDocuments.filter(d => d.category === "Acordos").length}
          </div>
          <div className="text-[11px] text-hydro-textDim mt-1">Acordos (MoUs)</div>
        </div>
      </div>

      {/* Document list */}
      <div className="grid grid-cols-1 gap-3">
        {filteredDocs.length > 0 ? (
          filteredDocs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))
        ) : (
          <div className="text-center py-10 text-hydro-textDim">
            <Icons.Docs className="w-10 h-10 mx-auto mb-3 opacity-50" />
            <p>Nenhum documento encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}

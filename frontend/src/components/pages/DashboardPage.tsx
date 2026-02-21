"use client";

import { useQuery } from "@tanstack/react-query";
import { Icons } from "@/components/Icons";
import { api } from "@/lib/api";

export default function DashboardPage() {
  const { data: analytics } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const response = await api.get("/analytics");
      return response.data;
    },
  });

  const { data: recentQueries } = useQuery({
    queryKey: ["recent-queries"],
    queryFn: async () => {
      const response = await api.get("/analytics/recent-queries");
      return response.data;
    },
  });

  const stats = [
    {
      label: "Documentos Indexados",
      value: analytics?.documents?.total || "—",
      trend: `${analytics?.documents?.chunks || 0} chunks`,
    },
    {
      label: "Consultas Realizadas",
      value: analytics?.queries?.total || "—",
      trend: `${analytics?.queries?.last_7_days || 0} nos últimos 7 dias`,
    },
    {
      label: "Fontes Integradas",
      value: Object.keys(analytics?.documents?.by_type || {}).length || "—",
      trend: "IBGE, ANEEL, IPECE...",
    },
    {
      label: "Tempo Médio de Resposta",
      value: analytics?.queries?.avg_response_time_ms ? `${(analytics.queries.avg_response_time_ms / 1000).toFixed(1)}s` : "—",
      trend: "Meta: < 5s",
    },
  ];

  const performanceMetrics = [
    {
      label: "Tempo Médio de Resposta",
      value: analytics?.queries?.avg_response_time_ms ? `${(analytics.queries.avg_response_time_ms / 1000).toFixed(1)}s` : "—",
      target: "< 5s",
      ok: (analytics?.queries?.avg_response_time_ms || 0) < 5000,
    },
    {
      label: "Satisfação dos Usuários",
      value: analytics?.satisfaction?.average_score ? `${analytics.satisfaction.average_score}/5` : "—",
      target: "> 4.0",
      ok: (analytics?.satisfaction?.average_score || 0) >= 4.0,
    },
    {
      label: "Uptime do Sistema",
      value: analytics?.system?.uptime_percent ? `${analytics.system.uptime_percent}%` : "—",
      target: "> 99%",
      ok: (analytics?.system?.uptime_percent || 0) >= 99,
    },
    {
      label: "Status do Sistema",
      value: analytics?.system?.status === "online" ? "Online" : "Offline",
      target: "Online",
      ok: analytics?.system?.status === "online",
    },
  ];

  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex items-center gap-2 mb-1">
        <Icons.Dashboard />
        <span className="text-hydro-accent font-mono text-[13px] font-bold">
          PAINEL DE MONITORAMENTO
        </span>
      </div>
      <p className="text-hydro-textDim text-[13px] mb-6">
        Métricas de uso e desempenho do sistema em tempo real.
      </p>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {stats.map((s, i) => (
          <div
            key={i}
            className="bg-hydro-card border border-hydro-border rounded-xl p-5 animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="text-[11px] text-hydro-textDim uppercase tracking-wider">
              {s.label}
            </div>
            <div className="text-[32px] font-mono font-bold text-hydro-accent mt-2 mb-1">
              {s.value}
            </div>
            <div className="text-xs text-hydro-textMuted">{s.trend}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Recent queries */}
        <div className="bg-hydro-card border border-hydro-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-hydro-text mb-4">
            Consultas Recentes
          </div>
          {recentQueries?.queries?.length > 0 ? (
            recentQueries.queries.map((q: { id: number; question: string; response_time_ms: number; created_at: string }, i: number) => (
              <div
                key={q.id}
                className={`py-3 ${i < recentQueries.queries.length - 1 ? "border-b border-hydro-border" : ""} animate-fade-in-up`}
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="text-[13px] text-hydro-text mb-1">
                  {q.question}
                </div>
                <div className="flex gap-3 text-[11px] text-hydro-textDim">
                  <span className="text-hydro-accentDim font-mono">
                    {q.response_time_ms}ms
                  </span>
                  <span>
                    {new Date(q.created_at).toLocaleString("pt-BR")}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-hydro-textDim text-sm py-4 text-center">
              Nenhuma consulta recente
            </div>
          )}
        </div>

        {/* Performance */}
        <div className="bg-hydro-card border border-hydro-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-hydro-text mb-4">
            Desempenho do Sistema
          </div>
          {performanceMetrics.map((m, i) => (
            <div
              key={i}
              className={`flex items-center justify-between py-2.5 ${i < performanceMetrics.length - 1 ? "border-b border-hydro-border" : ""}`}
            >
              <span className="text-[13px] text-hydro-textMuted">{m.label}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono font-bold text-hydro-accent">
                  {m.value}
                </span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded ${
                    m.ok
                      ? "bg-[rgba(0,230,118,0.1)] text-hydro-accent"
                      : "bg-[rgba(255,82,82,0.1)] text-hydro-danger"
                  }`}
                >
                  Meta: {m.target}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

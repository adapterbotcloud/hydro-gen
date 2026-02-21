"use client";

import { Icons } from "@/components/Icons";

const stats = [
  { label: "Documentos Indexados", value: "847", trend: "+23 esta semana" },
  { label: "Consultas Realizadas", value: "12.4k", trend: "+18% vs mês anterior" },
  { label: "Fontes Integradas", value: "42", trend: "IBGE, ANEEL, IPECE..." },
  { label: "Usuários Ativos", value: "156", trend: "87 gestores públicos" },
];

const recentQueries = [
  { query: "Incentivos fiscais para empresas de H2V em Pecém", user: "SEDET", time: "2min" },
  { query: "Dados de empregabilidade no setor de energia renovável", user: "STDS", time: "15min" },
  { query: "Comparativo de legislação H2V entre Ceará e Bahia", user: "PGE", time: "1h" },
  { query: "Impacto ambiental de parques eólicos na zona costeira", user: "SEMACE", time: "3h" },
];

const metrics = [
  { label: "Tempo Médio de Resposta", value: "2.3s", target: "< 5s", ok: true },
  { label: "Precisão de Recuperação", value: "87%", target: "> 80%", ok: true },
  { label: "Satisfação dos Usuários", value: "4.2/5", target: "> 4.0", ok: true },
  { label: "Uptime do Sistema", value: "99.7%", target: "> 99%", ok: true },
  { label: "Taxa de Alucinação", value: "3.1%", target: "< 5%", ok: true },
];

export default function DashboardPage() {
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
            <div className="text-[32px] font-mono font-bold text-hydro-accent my-2">
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
          {recentQueries.map((q, i) => (
            <div
              key={i}
              className="py-3 border-b border-hydro-border last:border-0 animate-fade-in-up"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="text-[13px] text-hydro-text mb-1">{q.query}</div>
              <div className="flex gap-3 text-[11px] text-hydro-textDim">
                <span className="text-hydro-accentDim font-mono">{q.user}</span>
                <span>{q.time} atrás</span>
              </div>
            </div>
          ))}
        </div>

        {/* Performance */}
        <div className="bg-hydro-card border border-hydro-border rounded-2xl p-5">
          <div className="text-sm font-semibold text-hydro-text mb-4">
            Desempenho do Sistema
          </div>
          {metrics.map((m, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2.5 border-b border-hydro-border last:border-0"
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

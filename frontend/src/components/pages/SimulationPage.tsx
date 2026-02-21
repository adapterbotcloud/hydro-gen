"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Icons } from "@/components/Icons";
import { api } from "@/lib/api";
import clsx from "clsx";

interface SimulationParams {
  investimento: number;
  capacidade: number;
  localizacao: string;
  fonteEnergia: string;
}

interface SimulationResults {
  empregos: number;
  pib: number;
  co2Reduzido: number;
  h2Produzido: number;
  roi: number;
  riskScore: number;
  dimensoes: {
    economico: number;
    social: number;
    ambiental: number;
    infraestrutura: number;
  };
}

function SliderInput({
  label,
  value,
  min,
  max,
  step,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mb-5">
      <div className="flex justify-between mb-2">
        <span className="text-[13px] text-hydro-textMuted">{label}</span>
        <span className="text-[13px] font-mono text-hydro-accent">
          {value} {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-1 appearance-none bg-hydro-border rounded cursor-pointer accent-hydro-accent"
      />
    </div>
  );
}

function SelectInput({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-5">
      <span className="text-[13px] text-hydro-textMuted block mb-2">{label}</span>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={clsx(
              "flex-1 px-3 py-2 rounded-lg text-[13px] border transition-all",
              value === opt
                ? "bg-hydro-accentGlow border-hydro-accent text-hydro-accent"
                : "bg-transparent border-hydro-border text-hydro-textMuted hover:border-hydro-accent"
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function ResultCard({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string | number;
  unit: string;
  color?: string;
}) {
  return (
    <div className="bg-hydro-card border border-hydro-border rounded-xl p-4 animate-fade-in-up">
      <div className="text-[11px] text-hydro-textDim uppercase tracking-wider mb-2">
        {label}
      </div>
      <div
        className="text-[28px] font-mono font-bold"
        style={{ color: color || "#00E676" }}
      >
        {value}
      </div>
      <div className="text-xs text-hydro-textMuted mt-1">{unit}</div>
    </div>
  );
}

export default function SimulationPage() {
  const [params, setParams] = useState<SimulationParams>({
    investimento: 500,
    capacidade: 200,
    localizacao: "Pecém",
    fonteEnergia: "Eólica",
  });
  const [results, setResults] = useState<SimulationResults | null>(null);

  const simulationMutation = useMutation({
    mutationFn: async (params: SimulationParams) => {
      const response = await api.post("/simulation", params);
      return response.data;
    },
    onSuccess: (data) => {
      setResults(data);
    },
  });

  const dimensionBars = results
    ? [
        { label: "Econômico", value: results.dimensoes.economico, color: "#00E676" },
        { label: "Social", value: results.dimensoes.social, color: "#40C4FF" },
        { label: "Ambiental", value: results.dimensoes.ambiental, color: "#FFD740" },
        { label: "Infraestrutura", value: results.dimensoes.infraestrutura, color: "#CE93D8" },
      ]
    : [];

  return (
    <div className="h-full overflow-auto p-6">
      <div className="flex items-center gap-2 mb-1">
        <Icons.Simulate />
        <span className="text-hydro-accent font-mono text-[13px] font-bold">
          SIMULAÇÃO DE CENÁRIOS
        </span>
      </div>
      <p className="text-hydro-textDim text-[13px] mb-6">
        Altere as variáveis e visualize previsões de impacto socioeconômico e ambiental.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-6">
        {/* Controls */}
        <div className="bg-hydro-card border border-hydro-border rounded-2xl p-6">
          <div className="text-sm font-semibold text-hydro-text mb-5">
            Parâmetros do Cenário
          </div>

          <SliderInput
            label="Investimento"
            value={params.investimento}
            min={100}
            max={2000}
            step={50}
            unit="M US$"
            onChange={(v) => setParams({ ...params, investimento: v })}
          />

          <SliderInput
            label="Capacidade de Produção"
            value={params.capacidade}
            min={50}
            max={1000}
            step={25}
            unit="MW"
            onChange={(v) => setParams({ ...params, capacidade: v })}
          />

          <SelectInput
            label="Localização"
            value={params.localizacao}
            options={["Pecém", "Fortaleza", "Interior"]}
            onChange={(v) => setParams({ ...params, localizacao: v })}
          />

          <SelectInput
            label="Fonte de Energia"
            value={params.fonteEnergia}
            options={["Eólica", "Solar", "Híbrida"]}
            onChange={(v) => setParams({ ...params, fonteEnergia: v })}
          />

          <button
            onClick={() => simulationMutation.mutate(params)}
            disabled={simulationMutation.isPending}
            className="w-full py-3 mt-2 bg-gradient-to-r from-hydro-accentDim to-hydro-accent rounded-xl text-hydro-bg font-bold text-sm transition-all hover:shadow-lg hover:shadow-hydro-accentGlow disabled:opacity-50"
          >
            {simulationMutation.isPending ? "Processando cenário..." : "Simular Cenário"}
          </button>
        </div>

        {/* Results */}
        <div>
          {!results && !simulationMutation.isPending && (
            <div className="h-full flex items-center justify-center flex-col gap-3 text-hydro-textDim border-2 border-dashed border-hydro-border rounded-2xl p-10">
              <Icons.Simulate />
              <span className="text-sm">Configure os parâmetros e clique em &quot;Simular Cenário&quot;</span>
            </div>
          )}

          {simulationMutation.isPending && (
            <div className="h-full flex items-center justify-center flex-col gap-3">
              <div className="w-10 h-10 border-[3px] border-hydro-border border-t-hydro-accent rounded-full animate-spin" />
              <span className="text-hydro-textMuted text-[13px]">Processando modelo de impacto...</span>
            </div>
          )}

          {results && !simulationMutation.isPending && (
            <div>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <ResultCard
                  label="Empregos Gerados"
                  value={results.empregos.toLocaleString("pt-BR")}
                  unit="diretos e indiretos"
                />
                <ResultCard
                  label="Impacto no PIB"
                  value={`+${results.pib}%`}
                  unit="crescimento estimado"
                  color="#40C4FF"
                />
                <ResultCard
                  label="CO₂ Evitado"
                  value={results.co2Reduzido.toLocaleString("pt-BR")}
                  unit="toneladas/ano"
                  color="#FFD740"
                />
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <ResultCard
                  label="H₂ Produzido"
                  value={results.h2Produzido}
                  unit="mil ton/ano"
                  color="#CE93D8"
                />
                <ResultCard
                  label="ROI Estimado"
                  value={`${results.roi} anos`}
                  unit="payback"
                />
                <ResultCard
                  label="Score de Risco"
                  value={results.riskScore}
                  unit="de 100 (menor=melhor)"
                  color={results.riskScore > 50 ? "#FF5252" : "#FFD740"}
                />
              </div>

              {/* Bar chart */}
              <div className="bg-hydro-card border border-hydro-border rounded-2xl p-5 animate-fade-in-up">
                <div className="text-[13px] text-hydro-textMuted mb-4">
                  Comparativo de Impacto por Dimensão
                </div>
                {dimensionBars.map((item, i) => (
                  <div key={i} className="mb-3 flex items-center gap-3">
                    <span className="text-xs text-hydro-textMuted w-24 text-right">
                      {item.label}
                    </span>
                    <div className="flex-1 h-2 bg-hydro-bg rounded overflow-hidden">
                      <div
                        className="h-full rounded transition-all duration-1000"
                        style={{
                          width: `${item.value}%`,
                          backgroundColor: item.color,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-mono w-8"
                      style={{ color: item.color }}
                    >
                      {item.value}%
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 bg-[rgba(255,215,64,0.08)] border border-[rgba(255,215,64,0.2)] rounded-xl text-xs text-hydro-warning leading-relaxed">
                ⚠️ Resultados baseados em modelos preditivos e dados oficiais. Use como subsídio complementar, mantendo o julgamento humano como elemento central.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

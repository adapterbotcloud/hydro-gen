"use client";

import { useState, useRef, useEffect } from "react";
import { Icons } from "@/components/Icons";
import clsx from "clsx";

interface Message {
  role: "user" | "assistant";
  text: string;
  sources?: { title: string; source: string; type: string; date?: string }[];
}

const sampleQuestions = [
  "Qual a legislação vigente sobre H2V no Ceará?",
  "Quais os impactos socioeconômicos do hub de Pecém?",
  "Compare cenários de investimento em eólica vs solar para H2V",
  "Dados de empregabilidade na cadeia de energia renovável",
];

// Mock responses for demo
const mockResponses: Record<string, { text: string; sources: { title: string; source: string; type: string; date?: string }[] }> = {
  "legislação": {
    text: `A legislação de Hidrogênio Verde no Ceará é uma das mais avançadas do Brasil. Os principais marcos legais são:

**Lei Estadual nº 18.314/2023** - Marco Legal do Hidrogênio Verde
• Estabelece diretrizes para produção, armazenamento e comercialização de H2V
• Cria o Programa Estadual de Hidrogênio Verde (ProH2V)
• Define incentivos fiscais para empresas do setor

**Decreto nº 35.216/2023** - Regulamentação do Marco Legal
• Detalha procedimentos para licenciamento ambiental simplificado
• Estabelece zonas prioritárias para instalação de plantas de H2V
• Define critérios para certificação de origem renovável

**Portaria ADECE nº 12/2024** - Incentivos Fiscais
• Redução de 75% no ICMS para operações com H2V por 15 anos
• Isenção de IPVA para veículos movidos a hidrogênio
• Créditos presumidos para investimentos em P&D`,
    sources: [
      { title: "Lei 18.314/2023", source: "Diário Oficial do Ceará", type: "pdf", date: "2023-08-15" },
      { title: "Decreto 35.216/2023", source: "Casa Civil do Ceará", type: "pdf", date: "2023-11-20" },
      { title: "Portaria ADECE 12/2024", source: "ADECE", type: "pdf", date: "2024-02-10" },
    ]
  },
  "pecém": {
    text: `O **Hub de Hidrogênio Verde do Pecém** terá impactos socioeconômicos significativos para o Ceará:

**Investimentos Previstos:**
• US$ 5,4 bilhões até 2030
• 3 plantas industriais de grande porte
• 2 GW de capacidade instalada inicial

**Geração de Empregos:**
• 12.000 empregos diretos na fase de construção
• 4.500 empregos diretos na operação
• 35.000 empregos indiretos na cadeia produtiva

**Impacto no PIB:**
• Incremento de 2,8% no PIB estadual até 2030
• Aumento de 15% nas exportações cearenses
• Arrecadação adicional de R$ 850 milhões/ano em impostos

**Desenvolvimento Regional:**
• Criação do Distrito Industrial de H2V
• Implantação de centro de P&D em parceria com UFC e IFCE
• Atração de fornecedores internacionais de eletrolisadores`,
    sources: [
      { title: "Masterplan Hub Pecém 2030", source: "CIPP S/A", type: "pdf", date: "2024-01-15" },
      { title: "Estudo de Impacto Socioeconômico", source: "IPECE", type: "pdf", date: "2023-12-01" },
      { title: "Relatório de Investimentos", source: "ADECE", type: "pdf", date: "2024-03-01" },
    ]
  },
  "eólica": {
    text: `**Comparativo de Investimento: Eólica vs Solar para produção de H2V no Ceará**

| Critério | Energia Eólica | Energia Solar |
|----------|---------------|---------------|
| CAPEX (US$/kW) | 1.200-1.500 | 800-1.000 |
| Fator de Capacidade | 45-55% | 22-28% |
| LCOE (US$/MWh) | 28-35 | 32-40 |
| Custo H2 (US$/kg) | 2,80-3,50 | 3,20-4,00 |

**Recomendação para o Ceará:**
O modelo **híbrido eólico-solar** é o mais vantajoso:
• Fator de capacidade combinado: 65-70%
• Custo de H2 otimizado: US$ 2,50-3,00/kg
• Menor necessidade de armazenamento

**Vantagens do Ceará:**
• Ventos constantes (média 8,5 m/s no litoral)
• Irradiação solar elevada (5,9 kWh/m²/dia)
• Proximidade com porto para exportação`,
    sources: [
      { title: "Atlas Eólico do Ceará 2024", source: "SEINFRA", type: "pdf", date: "2024-02-01" },
      { title: "Estudo de Viabilidade H2V", source: "EPE", type: "pdf", date: "2023-09-15" },
      { title: "Análise Comparativa Renováveis", source: "ANEEL", type: "pdf", date: "2024-01-20" },
    ]
  },
  "emprego": {
    text: `**Dados de Empregabilidade na Cadeia de Energia Renovável do Ceará**

**Situação Atual (2024):**
• 28.500 empregos diretos em energia renovável
• 15.200 na cadeia eólica
• 8.300 na cadeia solar
• 5.000 em serviços e manutenção

**Projeções para H2V (2025-2030):**
• +45.000 novos empregos diretos
• +120.000 empregos indiretos
• Salário médio 40% acima da média estadual

**Perfil Profissional Demandado:**
• Engenheiros químicos e eletricistas (25%)
• Técnicos em eletromecânica (35%)
• Operadores de planta industrial (20%)
• Especialistas em segurança e meio ambiente (10%)
• Gestão e administrativo (10%)

**Capacitação:**
• 5 cursos técnicos em H2V já em funcionamento
• Parceria UFC/IFCE para formação de 2.000 profissionais/ano
• Programa de qualificação para trabalhadores da região`,
    sources: [
      { title: "Mapa do Emprego Verde CE", source: "SINE/CE", type: "pdf", date: "2024-03-01" },
      { title: "Demanda Profissional H2V", source: "SENAI", type: "pdf", date: "2024-02-15" },
      { title: "Relatório Trimestral Energia", source: "CAGED", type: "pdf", date: "2024-04-01" },
    ]
  },
  "default": {
    text: `Obrigado pela sua pergunta! Com base na nossa base de documentos sobre Hidrogênio Verde no Ceará, posso informar que:

O Ceará está posicionado como líder nacional na produção de H2V, com:
• 23 memorandos de entendimento assinados
• Mais de US$ 30 bilhões em investimentos previstos
• Meta de produzir 2 milhões de toneladas de H2V/ano até 2030

O estado possui vantagens competitivas únicas:
• Excelente recurso eólico e solar
• Porto do Pecém com acesso direto à Europa
• Marco regulatório avançado
• Mão de obra qualificada disponível

Para informações mais específicas, por favor reformule sua pergunta ou selecione um dos temas sugeridos.`,
    sources: [
      { title: "Panorama H2V Ceará 2024", source: "SEDET", type: "pdf", date: "2024-01-01" },
    ]
  }
};

function getMockResponse(question: string): { text: string; sources: { title: string; source: string; type: string; date?: string }[] } {
  const q = question.toLowerCase();
  if (q.includes("legisla") || q.includes("lei") || q.includes("decreto") || q.includes("marco legal")) {
    return mockResponses["legislação"];
  }
  if (q.includes("pecém") || q.includes("hub") || q.includes("socioecon") || q.includes("impacto")) {
    return mockResponses["pecém"];
  }
  if (q.includes("eólica") || q.includes("solar") || q.includes("compar") || q.includes("investimento")) {
    return mockResponses["eólica"];
  }
  if (q.includes("emprego") || q.includes("trabalho") || q.includes("profission") || q.includes("capacita")) {
    return mockResponses["emprego"];
  }
  return mockResponses["default"];
}

function SourceBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1 bg-hydro-accentGlow border border-hydro-border rounded px-2 py-0.5 text-[11px] text-hydro-accentDim font-mono">
      <Icons.Source />
      {text}
    </span>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Olá! Sou o assistente Hydro Gen. Posso ajudá-lo com informações sobre hidrogênio verde no Ceará, legislação energética, dados socioeconômicos e simulação de cenários. Como posso ajudar?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    const question = input;
    setInput("");
    setIsLoading(true);

    // Simulate API delay (1.5-3 seconds)
    const delay = 1500 + Math.random() * 1500;
    setTimeout(() => {
      const response = getMockResponse(question);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: response.text,
          sources: response.sources,
        },
      ]);
      setIsLoading(false);
    }, delay);
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Header */}
      <div className="px-6 py-4 border-b border-hydro-border flex items-center gap-2 bg-gradient-to-b from-hydro-card to-transparent">
        <Icons.Bolt />
        <span className="text-hydro-accent font-mono text-[13px] font-bold">
          ASSISTENTE HYDRO GEN
        </span>
        <span className="text-hydro-textDim text-xs ml-2">
          RAG + LLM • Base: 847 documentos
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-5">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={clsx(
              "flex flex-col animate-fade-in-up",
              msg.role === "user" ? "items-end" : "items-start"
            )}
          >
            <div
              className={clsx(
                "max-w-[75%] px-4 py-3.5 text-sm leading-relaxed text-hydro-text whitespace-pre-line",
                msg.role === "user"
                  ? "bg-hydro-accentGlow border border-hydro-borderHover rounded-2xl rounded-br-sm"
                  : "bg-hydro-card border border-hydro-border rounded-2xl rounded-bl-sm"
              )}
            >
              {msg.text}
            </div>
            {msg.sources && msg.sources.length > 0 && (
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {msg.sources.map((s, j) => (
                  <SourceBadge key={j} text={s.title} />
                ))}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-1.5 text-hydro-textDim text-[13px] animate-fade-in">
            <span className="animate-pulse">●</span>
            <span className="animate-pulse animation-delay-200">●</span>
            <span className="animate-pulse animation-delay-400">●</span>
            <span className="ml-1.5">Consultando base de dados...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length <= 1 && (
        <div className="px-6 pb-3 flex flex-wrap gap-2">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => setInput(q)}
              className="px-3.5 py-2 bg-hydro-card border border-hydro-border rounded-full text-hydro-textMuted text-xs hover:border-hydro-accent hover:text-hydro-accent transition-all"
            >
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="px-6 py-4 border-t border-hydro-border bg-hydro-card">
        <div className="flex items-center gap-3 bg-hydro-bg rounded-xl border border-hydro-border p-1 pl-4">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Faça uma pergunta sobre H2V no Ceará..."
            className="flex-1 bg-transparent border-none outline-none text-hydro-text text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={clsx(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
              input.trim() && !isLoading
                ? "bg-hydro-accent text-hydro-bg cursor-pointer"
                : "bg-hydro-card text-hydro-textDim cursor-default"
            )}
          >
            <Icons.Send />
          </button>
        </div>
        <div className="text-[11px] text-hydro-textDim mt-2 text-center">
          Respostas geradas com base em documentos oficiais via RAG. Sempre verifique as fontes citadas.
        </div>
      </div>
    </div>
  );
}

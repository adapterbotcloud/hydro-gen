"use client";

import { useState, useRef, useEffect } from "react";
import { Icons } from "@/components/Icons";
import clsx from "clsx";

interface Message {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
}

const sampleQuestions = [
  "Qual a legislação vigente sobre H2V no Ceará?",
  "Quais os impactos socioeconômicos do hub de Pecém?",
  "Compare cenários de investimento em eólica vs solar para H2V",
  "Dados de empregabilidade na cadeia de energia renovável",
];

// Mock response from prototype
const mockResponse = {
  text: `Com base na análise dos documentos disponíveis na base de dados do Hydro Gen, posso informar que o Ceará possui um marco regulatório robusto para o hidrogênio verde. A Lei Estadual nº 18.032/2023 estabelece a Política Estadual do Hidrogênio Verde, definindo incentivos fiscais e diretrizes para investimentos no setor.

O hub industrial de Pecém concentra os principais projetos, com investimentos previstos superiores a US$ 15 bilhões até 2030. Os indicadores socioeconômicos do IPECE mostram potencial de geração de mais de 50 mil empregos diretos e indiretos na cadeia produtiva.`,
  sources: ["Lei Estadual nº 18.032/2023", "IPECE 2024", "BNDES - H2V Brasil"],
};

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
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMsg: Message = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    // Simulate API delay (2 seconds as in prototype)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: mockResponse.text,
          sources: mockResponse.sources,
        },
      ]);
      setIsTyping(false);
    }, 2000);
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
                  <SourceBadge key={j} text={s} />
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
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
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className={clsx(
              "w-10 h-10 rounded-lg flex items-center justify-center transition-all",
              input.trim() && !isTyping
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

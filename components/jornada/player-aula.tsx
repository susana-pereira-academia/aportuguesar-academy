"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, ChevronRight, ChevronLeft, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { VOC } from "@/lib/vocabulario";
import { alternarProgresso } from "@/app/jornada/actions";
import type { Conteudo, Estacao } from "@/lib/data/jornada";

interface Navegacao {
  href: string;
  titulo: string;
}

interface Props {
  estacao: Estacao;
  conteudo: Conteudo;
  concluidoInicial: boolean;
  anterior: Navegacao | null;
  seguinte: Navegacao | null;
}

export function PlayerAula({
  estacao,
  conteudo,
  concluidoInicial,
  anterior,
  seguinte,
}: Props) {
  const [concluido, setConcluido] = useState(concluidoInicial);
  const [pendente, startTransition] = useTransition();

  function toggle() {
    const novo = !concluido;
    setConcluido(novo);
    startTransition(async () => {
      try {
        await alternarProgresso(conteudo.id, novo);
      } catch {
        setConcluido(!novo);
      }
    });
  }

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-8 lg:py-12">
      {/* Cabeçalho — estação + título aula */}
      <div className="mb-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-2">
          {VOC.estacao.s} {String(estacao.numero).padStart(2, "0")} ·{" "}
          {estacao.nome}
        </p>
        <h1 className="font-serif italic text-3xl sm:text-4xl noite-text-rich">
          {conteudo.titulo}
        </h1>
      </div>

      {/* Player / material */}
      {conteudo.tipo === "video" && conteudo.vimeo_id && (
        <div className="aspect-video rounded-2xl overflow-hidden bg-ink marca-shadow-lg mb-8">
          <iframe
            src={`https://player.vimeo.com/video/${conteudo.vimeo_id}?byline=0&portrait=0&title=0`}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}

      {conteudo.tipo === "material" && conteudo.material_url && (
        <div className="rounded-2xl bg-areia-50 marca-border-rich p-8 mb-8 text-center">
          <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-3">
            Material
          </p>
          <a
            href={conteudo.material_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-md marca-border-rich text-noite-700 hover:bg-areia-100 text-sm tracking-[0.05em] uppercase font-medium transition-all"
          >
            <ExternalLink className="w-4 h-4" />
            Abrir material
          </a>
        </div>
      )}

      {/* Descrição */}
      {conteudo.descricao && (
        <div className="rounded-2xl bg-areia-50/60 p-6 mb-8">
          <p className="text-base text-ink leading-relaxed whitespace-pre-wrap">
            {conteudo.descricao}
          </p>
        </div>
      )}

      {/* Botão concluir */}
      <div className="mb-10">
        <button
          onClick={toggle}
          disabled={pendente}
          className={cn(
            "w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-md text-sm tracking-[0.1em] uppercase font-medium transition-all border-2",
            concluido
              ? "bg-success/10 text-success border-success/30"
              : "bg-noite-foil text-white border-transparent hover:opacity-90 marca-shadow",
          )}
        >
          {concluido ? (
            <>
              <Check className="w-4 h-4" />
              {VOC.conteudo.g("Concluído", "Concluída")}
            </>
          ) : (
            `Marcar como ${VOC.conteudo.g("concluído", "concluída")}`
          )}
        </button>
      </div>

      {/* Navegação anterior / seguinte */}
      <div className="grid gap-3 sm:grid-cols-2 border-t border-areia-200/40 pt-6">
        {anterior ? (
          <Link
            href={anterior.href}
            className="group rounded-xl bg-areia-50 marca-border p-4 flex items-start gap-3 hover:marca-shadow transition-all"
          >
            <ChevronLeft className="w-4 h-4 text-noite-600 mt-1 shrink-0 group-hover:-translate-x-0.5 transition-transform" />
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-1">
                Anterior
              </p>
              <p className="text-sm font-medium text-ink truncate">
                {anterior.titulo}
              </p>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {seguinte ? (
          <Link
            href={seguinte.href}
            className="group rounded-xl bg-areia-50 marca-border p-4 flex items-start gap-3 justify-end text-right hover:marca-shadow transition-all sm:col-start-2"
          >
            <div className="min-w-0">
              <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-1">
                Seguinte
              </p>
              <p className="text-sm font-medium text-ink truncate">
                {seguinte.titulo}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-noite-600 mt-1 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}

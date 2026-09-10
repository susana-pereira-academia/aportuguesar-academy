"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Check, Play, FileText, CheckCircle2, Calendar, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { VOC } from "@/lib/vocabulario";
import type { EstacaoComConteudos, Conteudo } from "@/lib/data/jornada";

interface Props {
  estacoes: EstacaoComConteudos[];
  idsFeitos: string[];
  progressoTotal: { feitos: number; total: number };
}

export function Sidebar({ estacoes, idsFeitos, progressoTotal }: Props) {
  const pathname = usePathname();
  const feitosSet = new Set(idsFeitos);

  // qual estação está aberta pelo URL atual
  const slugAtivo = (() => {
    const m = pathname.match(/^\/jornada\/([^/]+)/);
    return m ? m[1] : estacoes[0]?.slug ?? null;
  })();

  const [abertas, setAbertas] = useState<Set<string>>(
    new Set(slugAtivo ? [slugAtivo] : []),
  );

  function toggle(slug: string) {
    setAbertas((prev) => {
      const nova = new Set(prev);
      if (nova.has(slug)) nova.delete(slug);
      else nova.add(slug);
      return nova;
    });
  }

  const pct =
    progressoTotal.total > 0
      ? Math.round((progressoTotal.feitos / progressoTotal.total) * 100)
      : 0;

  return (
    <aside className="w-full lg:w-80 shrink-0 border-r border-areia-200 bg-areia-100 min-h-screen">
      {/* Progresso total */}
      <div className="px-6 py-6 border-b border-areia-200/40">
        <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-2">
          O teu progresso
        </p>
        <div className="flex items-baseline justify-between mb-2">
          <p className="font-serif italic text-[1.75rem] font-medium noite-text-rich">
            {progressoTotal.feitos}
            <span className="text-ink-faint">/{progressoTotal.total}</span>
          </p>
          <span className="text-xs text-ink-soft">{pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-areia-200 overflow-hidden">
          <div
            className="h-full bg-noite-foil transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Atalhos: Agenda + Gravações */}
      <nav className="py-2 border-b border-areia-200/20">
        <AtalhoLink
          href="/jornada/agenda"
          icone={Calendar}
          nome="Agenda"
          ativo={pathname === "/jornada/agenda"}
        />
        <AtalhoLink
          href="/jornada/gravacoes"
          icone={Video}
          nome="Gravações"
          ativo={pathname === "/jornada/gravacoes"}
        />
      </nav>

      {/* Lista de estações */}
      <nav className="py-2">
        {estacoes.map((estacao) => {
          const aberta = abertas.has(estacao.slug);
          const feitosNaEstacao = estacao.conteudos.filter((c) =>
            feitosSet.has(c.id),
          ).length;

          return (
            <div key={estacao.id} className="border-b border-areia-200/20 last:border-0">
              <button
                onClick={() => toggle(estacao.slug)}
                className="w-full flex items-center gap-3 px-6 py-4 text-left hover:bg-white transition-colors"
              >
                <span className="text-[10px] font-semibold text-dourado-700 shrink-0 w-6">
                  {String(estacao.numero).padStart(2, "0")}
                </span>
                <span className="flex-1 text-sm font-medium text-ink">
                  {estacao.nome}
                </span>
                <span className="text-[10px] text-ink-faint">
                  {feitosNaEstacao}/{estacao.conteudos.length}
                </span>
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-noite-600 transition-transform shrink-0",
                    aberta && "rotate-180",
                  )}
                />
              </button>

              {aberta && (
                <div className="pb-3">
                  {estacao.conteudos.length === 0 ? (
                    <p className="px-6 py-2 text-xs text-ink-faint">
                      Sem {VOC.conteudo.pMin}.
                    </p>
                  ) : (
                    <>
                      {/* aulas que não estão dentro de nenhuma secção */}
                      {estacao.soltas.length > 0 && (
                        <ul>
                          {estacao.soltas.map((c) => (
                            <LinhaAula
                              key={c.id}
                              conteudo={c}
                              slugEstacao={estacao.slug}
                              pathname={pathname}
                              feito={feitosSet.has(c.id)}
                            />
                          ))}
                        </ul>
                      )}

                      {/* secções, cada uma com as suas aulas */}
                      {estacao.seccoes.map((seccao) => {
                        const feitosNaSeccao = seccao.conteudos.filter((c) =>
                          feitosSet.has(c.id),
                        ).length;
                        return (
                          <div key={seccao.id} className="mt-1">
                            <div className="flex items-center gap-2 pl-10 pr-6 py-2">
                              <span className="text-[9px] tracking-[0.25em] uppercase text-dourado-700 flex-1 truncate">
                                {seccao.nome}
                              </span>
                              <span className="text-[10px] text-ink-faint shrink-0">
                                {feitosNaSeccao}/{seccao.conteudos.length}
                              </span>
                            </div>
                            {seccao.conteudos.length === 0 ? (
                              <p className="pl-14 pr-6 py-1.5 text-xs text-ink-faint">
                                Sem {VOC.conteudo.pMin}.
                              </p>
                            ) : (
                              <ul>
                                {seccao.conteudos.map((c) => (
                                  <LinhaAula
                                    key={c.id}
                                    conteudo={c}
                                    slugEstacao={estacao.slug}
                                    pathname={pathname}
                                    feito={feitosSet.has(c.id)}
                                    recuada
                                  />
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

function LinhaAula({
  conteudo,
  slugEstacao,
  pathname,
  feito,
  recuada = false,
}: {
  conteudo: Conteudo;
  slugEstacao: string;
  pathname: string;
  feito: boolean;
  recuada?: boolean;
}) {
  const href = `/jornada/${slugEstacao}/${conteudo.numero}`;
  const ativa = pathname === href;
  const Icone =
    conteudo.tipo === "video"
      ? Play
      : conteudo.tipo === "material"
      ? FileText
      : CheckCircle2;

  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 pr-6 py-2 text-sm transition-colors",
          recuada ? "pl-16" : "pl-14",
          ativa
            ? "bg-areia-200/70 text-noite-800 font-medium border-l-2 border-dourado-500"
            : "text-ink-soft hover:bg-white hover:text-ink border-l-2 border-transparent",
          feito && !ativa && "text-ink-faint",
        )}
      >
        {feito ? (
          <Check className="w-3.5 h-3.5 text-success shrink-0" />
        ) : (
          <Icone className="w-3.5 h-3.5 text-noite-500 shrink-0" />
        )}
        <span className="flex-1 truncate">{conteudo.titulo}</span>
      </Link>
    </li>
  );
}

function AtalhoLink({
  href,
  icone: Icone,
  nome,
  ativo,
}: {
  href: string;
  icone: React.ElementType;
  nome: string;
  ativo: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-6 py-3 text-sm transition-colors border-l-2",
        ativo
          ? "bg-areia-200/70 text-noite-800 font-medium border-dourado-500"
          : "text-ink-soft hover:bg-white hover:text-ink border-transparent",
      )}
    >
      <Icone className="w-4 h-4 text-noite-500 shrink-0" />
      <span className="flex-1">{nome}</span>
    </Link>
  );
}

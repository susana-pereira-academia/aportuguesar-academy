import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Check, Circle, Video, FileText, CheckCircle2 } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { requerMentora } from "@/lib/auth";
import { getAlunaDetalhe } from "@/lib/data/admin";
import { formatarData } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { VOC } from "@/lib/vocabulario";

interface Props {
  params: Promise<{ id: string }>;
}

export const metadata = { title: "Detalhe da aluna" };

export default async function AlunaDetalhePage({ params }: Props) {
  await requerMentora();
  const { id } = await params;
  const aluna = await getAlunaDetalhe(id);
  if (!aluna) notFound();

  const pct =
    aluna.conteudos_totais > 0
      ? Math.round((aluna.conteudos_feitos / aluna.conteudos_totais) * 100)
      : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-sm text-noite-700 hover:text-noite-600 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Voltar ao painel
          </Link>

          {/* Cabeçalho aluna */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 dourado-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700">
                Detalhe da aluna
              </p>
            </div>
            <h1 className="font-serif italic text-4xl sm:text-5xl noite-text-rich mb-2">
              {aluna.nome ?? aluna.email.split("@")[0]}
            </h1>
            <p className="text-sm text-ink-soft">{aluna.email}</p>
          </div>

          {/* Progresso resumo */}
          <div className="rounded-2xl bg-areia-50 marca-border marca-shadow p-6 mb-8">
            <div className="grid gap-6 sm:grid-cols-3">
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-2">
                  Progresso
                </p>
                <p className="font-serif italic text-3xl noite-text-rich">
                  {aluna.conteudos_feitos}
                  <span className="text-ink-faint">/{aluna.conteudos_totais}</span>
                </p>
                <div className="h-1.5 rounded-full bg-areia-200 mt-3 overflow-hidden">
                  <div
                    className="h-full bg-noite-foil transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-ink-soft mt-1">{pct}%</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-2">
                  Registada em
                </p>
                <p className="font-serif italic text-2xl font-medium text-ink">
                  {formatarData(aluna.criada_em)}
                </p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-2">
                  Última atividade
                </p>
                <p className="font-serif italic text-2xl font-medium text-ink">
                  {aluna.ultima_atividade
                    ? formatarData(aluna.ultima_atividade)
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          {/* Estações + aulas com marcação */}
          <div className="space-y-4">
            {aluna.estacoes.map((estacao) => {
              const feitosNaEstacao = estacao.conteudos.filter((c) =>
                estacao.conteudosFeitos.has(c.id),
              ).length;
              const total = estacao.conteudos.length;

              return (
                <div
                  key={estacao.id}
                  className="rounded-2xl bg-areia-50 marca-border overflow-hidden"
                >
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-areia-200/40">
                    <span className="text-[11px] font-semibold text-dourado-700 w-8">
                      {String(estacao.numero).padStart(2, "0")}
                    </span>
                    <span className="font-serif italic text-xl font-medium noite-text-rich flex-1">
                      {estacao.nome}
                    </span>
                    {!estacao.publicada && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full uppercase tracking-[0.15em] bg-areia-100 text-ink-faint">
                        Rascunho
                      </span>
                    )}
                    <span className="text-xs text-ink-soft">
                      {feitosNaEstacao}/{total}
                    </span>
                  </div>

                  {estacao.conteudos.length === 0 ? (
                    <p className="px-5 py-4 text-xs text-ink-faint text-center">
                      Sem {VOC.conteudo.pMin}.
                    </p>
                  ) : (
                    <ul>
                      {estacao.conteudos.map((c) => {
                        const feito = estacao.conteudosFeitos.has(c.id);
                        const Icone =
                          c.tipo === "video"
                            ? Video
                            : c.tipo === "material"
                            ? FileText
                            : CheckCircle2;
                        return (
                          <li
                            key={c.id}
                            className={cn(
                              "flex items-center gap-3 px-5 py-3 border-t border-areia-200/30 first:border-0",
                              feito ? "bg-success/5" : "",
                            )}
                          >
                            {feito ? (
                              <Check className="w-4 h-4 text-success shrink-0" />
                            ) : (
                              <Circle className="w-4 h-4 text-ink-faint shrink-0" />
                            )}
                            <Icone className="w-3.5 h-3.5 text-noite-500 shrink-0" />
                            <span
                              className={cn(
                                "text-sm flex-1 truncate",
                                feito ? "text-ink" : "text-ink-soft",
                              )}
                            >
                              {c.numero}. {c.titulo}
                            </span>
                            <span className="text-[10px] text-ink-faint uppercase tracking-[0.15em]">
                              {c.tipo === "video"
                                ? "Vídeo"
                                : c.tipo === "material"
                                ? "Material"
                                : "Marco"}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

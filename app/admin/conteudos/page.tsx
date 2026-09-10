import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { GerirConteudos } from "@/components/admin/gerir-conteudos";
import { requerMentora } from "@/lib/auth";
import { getEstacoesComConteudos } from "@/lib/data/jornada";
import { VOC } from "@/lib/vocabulario";

export const metadata = { title: "Gerir conteúdos" };

export default async function AdminConteudosPage() {
  await requerMentora();
  const estacoes = await getEstacoesComConteudos(true);

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

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 dourado-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-noite-600">
                Gerir conteúdos
              </p>
            </div>
            <h1 className="font-serif italic text-4xl sm:text-5xl noite-text-rich mb-3">
              {VOC.estacao.g("Os teus", "As tuas")} {VOC.estacao.pMin}
            </h1>
            <p className="text-sm text-ink-soft">
              Cria {VOC.estacao.pMin}, adiciona {VOC.conteudo.pMin} dentro.
              Vídeos do Vimeo, PDFs, marcos.
            </p>
          </div>

          <GerirConteudos estacoes={estacoes} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { GerirConteudos } from "@/components/admin/gerir-conteudos";
import { requerMentora } from "@/lib/auth";
import { getEstacoesComConteudos } from "@/lib/data/jornada";

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
            className="inline-flex items-center gap-2 text-sm text-gold-700 hover:text-gold-600 mb-8 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Voltar ao painel
          </Link>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 gold-divider" />
              <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
                Gerir conteúdos
              </p>
            </div>
            <h1 className="font-serif italic text-4xl sm:text-5xl gold-text-rich mb-3">
              As tuas estações
            </h1>
            <p className="text-sm text-ink-soft">
              Cria estações, adiciona aulas dentro. Vídeos do Vimeo, PDFs, marcos.
            </p>
          </div>

          <GerirConteudos estacoes={estacoes} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

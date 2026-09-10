import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/layout/nav";
import { Footer } from "@/components/layout/footer";
import { GerirAgenda } from "@/components/admin/gerir-agenda";
import { requerMentora } from "@/lib/auth";
import { getEncontros } from "@/lib/data/agenda";

export const metadata = { title: "Gerir agenda" };

export default async function AdminAgendaPage() {
  await requerMentora();
  const encontros = await getEncontros();

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
                Gerir agenda
              </p>
            </div>
            <h1 className="font-serif italic text-4xl sm:text-5xl noite-text-rich mb-3">
              Os teus encontros
            </h1>
            <p className="text-sm text-ink-soft">
              Cria encontros com data, hora e link. Depois de passarem, se tiverem gravação
              (Vimeo ID), aparecem também na secção Gravações.
            </p>
          </div>

          <GerirAgenda encontros={encontros} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

import { redirect } from "next/navigation";
import { PLATAFORMA } from "@/lib/config";
import { requerUtilizador } from "@/lib/auth";
import { getEstacoesComConteudos } from "@/lib/data/jornada";

export const metadata = { title: "A minha jornada" };

export default async function JornadaHome() {
  const user = await requerUtilizador();
  const estacoes = await getEstacoesComConteudos();

  // Se há aulas, entra logo na primeira aula da primeira estação
  const primeira = estacoes.find((e) => e.conteudos.length > 0);
  if (primeira) {
    redirect(`/jornada/${primeira.slug}/${primeira.conteudos[0].numero}`);
  }

  const nomeAluna =
    (user.user_metadata as { nome?: string })?.nome ??
    user.email?.split("@")[0] ??
    "aluna";

  return (
    <div className="flex items-center justify-center min-h-[70vh] px-6 py-16 text-center">
      <div className="max-w-md">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-8 gold-divider" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600">
            Olá, {nomeAluna}
          </p>
          <div className="w-8 gold-divider" />
        </div>
        <h1 className="font-serif italic text-3xl gold-text-rich mb-4">
          O teu lugar está a ser preparado.
        </h1>
        <p className="text-sm text-ink-soft">
          As {PLATAFORMA.vocabulario.estacoes.toLowerCase()} vão sendo abertas.
          Volta em breve.
        </p>
      </div>
    </div>
  );
}

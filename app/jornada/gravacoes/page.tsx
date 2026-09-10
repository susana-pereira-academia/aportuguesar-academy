import { Video } from "lucide-react";
import { requerUtilizador } from "@/lib/auth";
import { getEncontros, separarEncontros, type Encontro } from "@/lib/data/agenda";

export const metadata = { title: "Gravações" };

export default async function GravacoesPage() {
  await requerUtilizador();
  const encontros = await getEncontros();
  const { passados } = separarEncontros(encontros);
  const comGravacao = passados.filter((e) => e.vimeo_id);

  return (
    <div className="max-w-4xl mx-auto px-6 lg:px-10 py-10">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-2">
          Encontros já realizados
        </p>
        <h1 className="font-serif italic text-4xl sm:text-5xl noite-text-rich mb-3">
          Gravações
        </h1>
        <p className="text-sm text-ink-soft">
          Todas as gravações num só sítio. Podes voltar sempre que quiseres.
        </p>
      </div>

      {comGravacao.length === 0 ? (
        <div className="rounded-2xl bg-areia-50 marca-border p-10 text-center">
          <Video className="w-8 h-8 text-noite-500 mx-auto mb-3" />
          <p className="font-serif italic text-2xl font-medium noite-text-rich mb-2">
            Ainda sem gravações
          </p>
          <p className="text-sm text-ink-soft">
            Assim que houver um encontro com gravação, aparece aqui.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {comGravacao.map((e) => (
            <CardGravacao key={e.id} encontro={e} />
          ))}
        </div>
      )}
    </div>
  );
}

function CardGravacao({ encontro }: { encontro: Encontro }) {
  return (
    <article className="rounded-2xl bg-areia-50 marca-border marca-shadow overflow-hidden">
      <div className="aspect-video bg-ink">
        <iframe
          src={`https://player.vimeo.com/video/${encontro.vimeo_id}?byline=0&portrait=0&title=0`}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
      <div className="p-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-2">
          {new Date(encontro.data_inicio).toLocaleDateString("pt-PT", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}{" "}
          · {encontro.duracao_min} min
        </p>
        <h2 className="font-serif italic text-[1.75rem] font-medium noite-text-rich mb-2">
          {encontro.titulo}
        </h2>
        {encontro.descricao && (
          <p className="text-sm text-ink-soft leading-relaxed whitespace-pre-wrap">
            {encontro.descricao}
          </p>
        )}
      </div>
    </article>
  );
}

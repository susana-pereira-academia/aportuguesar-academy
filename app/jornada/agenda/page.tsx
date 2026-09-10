import { Calendar, Clock, Video, ExternalLink } from "lucide-react";
import { requerUtilizador } from "@/lib/auth";
import { getEncontros, separarEncontros, type Encontro } from "@/lib/data/agenda";

export const metadata = { title: "Agenda" };

export default async function AgendaPage() {
  await requerUtilizador();
  const encontros = await getEncontros();
  const { proximos, passados } = separarEncontros(encontros);

  const proximo = proximos[0];

  return (
    <div className="max-w-3xl mx-auto px-6 lg:px-10 py-10">
      <div className="mb-8">
        <p className="text-[10px] tracking-[0.3em] uppercase text-noite-600 mb-2">
          Encontros ao vivo & presenciais
        </p>
        <h1 className="font-serif italic text-4xl sm:text-5xl noite-text-rich mb-3">
          Agenda
        </h1>
        <p className="text-sm text-ink-soft">
          Todos os encontros num só sítio.
        </p>
      </div>

      {proximo && <CardProximo encontro={proximo} />}

      {proximos.length > 1 && (
        <div className="mt-10 space-y-3">
          <p className="text-[10px] tracking-[0.3em] uppercase text-noite-600 mb-3">
            Também no calendário
          </p>
          {proximos.slice(1).map((e) => (
            <LinhaEncontro key={e.id} encontro={e} />
          ))}
        </div>
      )}

      {proximos.length === 0 && (
        <div className="rounded-2xl bg-areia-50 noite-border p-10 text-center">
          <Calendar className="w-8 h-8 text-noite-500 mx-auto mb-3" />
          <p className="font-serif italic text-xl noite-text-rich mb-2">
            Ainda sem encontros marcados
          </p>
          <p className="text-sm text-ink-soft">
            Assim que houver um encontro agendado, aparece aqui.
          </p>
        </div>
      )}

      {passados.length > 0 && (
        <div className="mt-14 pt-8 border-t border-noite-200/40 text-center">
          <Video className="w-5 h-5 text-noite-500 mx-auto mb-3" />
          <p className="text-sm text-ink-soft">
            Os encontros já realizados ficam em{" "}
            <a href="/jornada/gravacoes" className="text-noite-700 hover:underline">
              Gravações
            </a>
            .
          </p>
        </div>
      )}
    </div>
  );
}

function CardProximo({ encontro }: { encontro: Encontro }) {
  const inicio = new Date(encontro.data_inicio);
  const dias = Math.max(
    0,
    Math.ceil((inicio.getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
  );
  const proximo = inicio.getTime() - Date.now() < 60 * 60_000; // <1h

  return (
    <div className="rounded-3xl bg-noite-gradient/40 noite-border-rich noite-shadow-lg p-8 sm:p-10">
      <div className="flex items-center justify-between mb-6">
        <p className="text-[10px] tracking-[0.3em] uppercase text-noite-700">
          Próximo
        </p>
        <p className="text-[11px] tracking-[0.2em] uppercase text-noite-700">
          {proximo ? "Hoje" : dias === 0 ? "Hoje" : dias === 1 ? "Amanhã" : `Faltam ${dias} dias`}
        </p>
      </div>

      <h2 className="font-serif italic text-3xl sm:text-4xl noite-text-rich mb-4">
        {encontro.titulo}
      </h2>

      {encontro.descricao && (
        <p className="text-base text-ink leading-relaxed mb-6 whitespace-pre-wrap">
          {encontro.descricao}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-8 text-sm text-ink-soft">
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-noite-600" />
          <span className="font-serif italic">
            {formatarData(encontro.data_inicio)}
          </span>
        </span>
        <span className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-noite-600" />
          {formatarHora(encontro.data_inicio)} · {encontro.duracao_min} min
        </span>
        <span className="flex items-center gap-2">
          <Video className="w-4 h-4 text-noite-600" />
          {encontro.plataforma}
        </span>
      </div>

      {encontro.link ? (
        <>
          <a
            href={encontro.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-md bg-noite-foil text-white noite-shadow hover:opacity-90 text-sm tracking-[0.1em] uppercase font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Entrar na sala
          </a>
          <p className="text-[11px] text-noite-700 italic mt-3">
            A sala abre 5 minutos antes do início.
          </p>
        </>
      ) : (
        <p className="text-sm text-ink-faint italic">
          O link vai ser adicionado antes do encontro.
        </p>
      )}
    </div>
  );
}

function LinhaEncontro({ encontro }: { encontro: Encontro }) {
  return (
    <div className="flex items-start gap-4 rounded-xl bg-areia-50 noite-border p-4">
      <div className="text-center shrink-0 w-14">
        <p className="text-[9px] tracking-[0.2em] uppercase text-noite-600">
          {new Date(encontro.data_inicio).toLocaleDateString("pt-PT", {
            month: "short",
          })}
        </p>
        <p className="font-serif italic text-2xl noite-text-rich leading-none">
          {new Date(encontro.data_inicio).getDate()}
        </p>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-serif italic text-lg text-ink">{encontro.titulo}</p>
        <p className="text-xs text-ink-faint mt-0.5">
          {formatarHora(encontro.data_inicio)} · {encontro.duracao_min} min · {encontro.plataforma}
        </p>
      </div>
      {encontro.link && (
        <a
          href={encontro.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs tracking-[0.1em] uppercase text-noite-700 hover:text-noite-800 shrink-0 self-center"
        >
          Entrar →
        </a>
      )}
    </div>
  );
}

function formatarData(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
}

function formatarHora(iso: string) {
  return new Date(iso).toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

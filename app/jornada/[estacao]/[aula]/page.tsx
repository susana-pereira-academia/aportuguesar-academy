import { notFound } from "next/navigation";
import { PlayerAula } from "@/components/jornada/player-aula";
import { requerUtilizador } from "@/lib/auth";
import {
  getConteudo,
  getEstacoesComConteudos,
  getProgressoAluna,
} from "@/lib/data/jornada";

interface Props {
  params: Promise<{ estacao: string; aula: string }>;
}

export default async function AulaPage({ params }: Props) {
  const { estacao: estacaoSlug, aula: aulaParam } = await params;
  const aulaNumero = Number.parseInt(aulaParam, 10);
  if (Number.isNaN(aulaNumero)) notFound();

  const user = await requerUtilizador();
  const [dados, todas, progresso] = await Promise.all([
    getConteudo(estacaoSlug, aulaNumero),
    getEstacoesComConteudos(),
    getProgressoAluna(user.id),
  ]);
  if (!dados) notFound();

  const { estacao, conteudo } = dados;

  // Constrói sequência achatada para navegar anterior/seguinte
  const sequencia = todas.flatMap((e) =>
    e.conteudos.map((c) => ({
      href: `/jornada/${e.slug}/${c.numero}`,
      titulo: c.titulo,
      id: c.id,
    })),
  );
  const indice = sequencia.findIndex((s) => s.id === conteudo.id);
  const anterior = indice > 0 ? sequencia[indice - 1] : null;
  const seguinte = indice < sequencia.length - 1 ? sequencia[indice + 1] : null;

  const feito = progresso.some((p) => p.conteudo_id === conteudo.id && p.concluido);

  return (
    <PlayerAula
      estacao={estacao}
      conteudo={conteudo}
      concluidoInicial={feito}
      anterior={anterior}
      seguinte={seguinte}
    />
  );
}

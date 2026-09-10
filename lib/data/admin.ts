import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { EstacaoComConteudos, Conteudo } from "@/lib/data/jornada";

export interface AlunaResumo {
  id: string;
  email: string;
  nome: string | null;
  criada_em: string;
  ultima_atividade: string | null;
  conteudos_feitos: number;
  conteudos_totais: number;
}

export interface AlunaDetalhe extends AlunaResumo {
  estacoes: (EstacaoComConteudos & {
    conteudosFeitos: Set<string>;
  })[];
}

export async function getAlunasComProgresso(): Promise<AlunaResumo[]> {
  const supabase = await createClient();

  const { count: totaisRaw } = await supabase
    .from("conteudos")
    .select("*", { count: "exact", head: true });
  const conteudosTotais = totaisRaw ?? 0;

  const { data: alunas, error } = await supabase
    .from("alunas_view")
    .select("*")
    .order("criada_em", { ascending: false });

  if (error) {
    console.error("getAlunasComProgresso:", error);
    return [];
  }

  return (alunas ?? []).map((a) => ({
    id: a.id,
    email: a.email,
    nome: a.nome,
    criada_em: a.criada_em,
    ultima_atividade: a.ultima_atividade,
    conteudos_feitos: a.conteudos_feitos ?? 0,
    conteudos_totais: conteudosTotais,
  }));
}

export async function getAlunaDetalhe(alunaId: string): Promise<AlunaDetalhe | null> {
  const admin = createAdminClient();

  // Aluna base
  const { data: userData, error: userErr } =
    await admin.auth.admin.getUserById(alunaId);
  if (userErr || !userData?.user) return null;

  const u = userData.user;
  const nome = (u.user_metadata as { nome?: string })?.nome ?? null;

  // Estações + conteudos (com admin, vê tudo)
  const [estacoesRes, conteudosRes, progressoRes] = await Promise.all([
    admin.from("estacoes").select("*").order("numero", { ascending: true }),
    admin.from("conteudos").select("*").order("numero", { ascending: true }),
    admin
      .from("progresso")
      .select("conteudo_id, concluido, concluido_em, atualizado_em")
      .eq("aluna_id", alunaId),
  ]);

  const conteudosPorEstacao = new Map<string, Conteudo[]>();
  for (const c of conteudosRes.data ?? []) {
    const arr = conteudosPorEstacao.get(c.estacao_id) ?? [];
    arr.push(c);
    conteudosPorEstacao.set(c.estacao_id, arr);
  }

  const feitosSet = new Set(
    (progressoRes.data ?? [])
      .filter((p) => p.concluido)
      .map((p) => p.conteudo_id),
  );

  const estacoes = (estacoesRes.data ?? []).map((e) => ({
    ...e,
    conteudos: conteudosPorEstacao.get(e.id) ?? [],
    conteudosFeitos: feitosSet,
  }));

  const totais = (conteudosRes.data ?? []).length;
  const feitos = feitosSet.size;

  const ultimaAtividade =
    (progressoRes.data ?? []).reduce<string | null>((max, p) => {
      const d = p.atualizado_em ?? p.concluido_em;
      if (!d) return max;
      if (!max || d > max) return d;
      return max;
    }, null);

  return {
    id: u.id,
    email: u.email ?? "",
    nome,
    criada_em: u.created_at,
    ultima_atividade: ultimaAtividade,
    conteudos_feitos: feitos,
    conteudos_totais: totais,
    estacoes,
  };
}

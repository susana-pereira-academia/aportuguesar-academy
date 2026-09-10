import { createClient } from "@/lib/supabase/server";

export interface Estacao {
  id: string;
  slug: string;
  numero: number;
  nome: string;
  descricao: string | null;
  publicada: boolean;
}

export interface Seccao {
  id: string;
  estacao_id: string;
  numero: number;
  nome: string;
  descricao: string | null;
  publicada: boolean;
}

export interface Conteudo {
  id: string;
  estacao_id: string;
  seccao_id: string | null;
  numero: number;
  titulo: string;
  descricao: string | null;
  tipo: "video" | "material" | "checkbox";
  vimeo_id: string | null;
  material_url: string | null;
}

export interface ProgressoConteudo {
  conteudo_id: string;
  concluido: boolean;
  concluido_em: string | null;
}

export interface SeccaoComConteudos extends Seccao {
  conteudos: Conteudo[];
}

export interface EstacaoComConteudos extends Estacao {
  /** todas as aulas da estação, por ordem de número — secção ou não */
  conteudos: Conteudo[];
  /** as secções da estação, cada uma com as suas aulas */
  seccoes: SeccaoComConteudos[];
  /** aulas que ainda não estão dentro de nenhuma secção */
  soltas: Conteudo[];
}

export async function getEstacoes(): Promise<Estacao[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("estacoes")
    .select("*")
    .eq("publicada", true)
    .order("numero", { ascending: true });
  if (error) {
    console.error("getEstacoes:", error);
    return [];
  }
  return data ?? [];
}

export async function getEstacoesComConteudos(
  incluirNaoPublicadas = false,
): Promise<EstacaoComConteudos[]> {
  const supabase = await createClient();

  let queryEstacoes = supabase.from("estacoes").select("*").order("numero", { ascending: true });
  if (!incluirNaoPublicadas) queryEstacoes = queryEstacoes.eq("publicada", true);

  let querySeccoes = supabase.from("seccoes").select("*").order("numero", { ascending: true });
  if (!incluirNaoPublicadas) querySeccoes = querySeccoes.eq("publicada", true);

  const [estacoesRes, seccoesRes, conteudosRes] = await Promise.all([
    queryEstacoes,
    querySeccoes,
    supabase.from("conteudos").select("*").order("numero", { ascending: true }),
  ]);

  if (estacoesRes.error) {
    console.error("getEstacoesComConteudos (estacoes):", estacoesRes.error.message);
    return [];
  }
  if (seccoesRes.error) {
    console.error("getEstacoesComConteudos (seccoes):", seccoesRes.error.message);
  }
  if (conteudosRes.error) {
    console.error("getEstacoesComConteudos (conteudos):", conteudosRes.error.message);
  }

  const seccoes = seccoesRes.data ?? [];
  const conteudos = conteudosRes.data ?? [];

  // quando uma secção está por publicar, as aulas dela não devem aparecer à aluna
  const seccoesVisiveis = new Set(seccoes.map((s) => s.id));

  const conteudosPorEstacao = new Map<string, Conteudo[]>();
  const conteudosPorSeccao = new Map<string, Conteudo[]>();
  const soltasPorEstacao = new Map<string, Conteudo[]>();

  for (const c of conteudos) {
    if (c.seccao_id && !seccoesVisiveis.has(c.seccao_id) && !incluirNaoPublicadas) continue;

    const daEstacao = conteudosPorEstacao.get(c.estacao_id) ?? [];
    daEstacao.push(c);
    conteudosPorEstacao.set(c.estacao_id, daEstacao);

    if (c.seccao_id) {
      const daSeccao = conteudosPorSeccao.get(c.seccao_id) ?? [];
      daSeccao.push(c);
      conteudosPorSeccao.set(c.seccao_id, daSeccao);
    } else {
      const soltas = soltasPorEstacao.get(c.estacao_id) ?? [];
      soltas.push(c);
      soltasPorEstacao.set(c.estacao_id, soltas);
    }
  }

  const seccoesPorEstacao = new Map<string, SeccaoComConteudos[]>();
  for (const s of seccoes) {
    const arr = seccoesPorEstacao.get(s.estacao_id) ?? [];
    arr.push({ ...s, conteudos: conteudosPorSeccao.get(s.id) ?? [] });
    seccoesPorEstacao.set(s.estacao_id, arr);
  }

  return (estacoesRes.data ?? []).map((e) => ({
    ...e,
    conteudos: conteudosPorEstacao.get(e.id) ?? [],
    seccoes: seccoesPorEstacao.get(e.id) ?? [],
    soltas: soltasPorEstacao.get(e.id) ?? [],
  }));
}

export async function getEstacaoPorSlug(slug: string): Promise<Estacao | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("estacoes")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

export async function getConteudo(
  estacaoSlug: string,
  aulaNumero: number,
): Promise<{ estacao: Estacao; conteudo: Conteudo } | null> {
  const estacao = await getEstacaoPorSlug(estacaoSlug);
  if (!estacao) return null;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudos")
    .select("*")
    .eq("estacao_id", estacao.id)
    .eq("numero", aulaNumero)
    .single();
  if (error || !data) return null;

  return { estacao, conteudo: data };
}

export async function getConteudosDaEstacao(estacaoId: string): Promise<Conteudo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudos")
    .select("*")
    .eq("estacao_id", estacaoId)
    .order("numero", { ascending: true });
  if (error) {
    console.error("getConteudosDaEstacao:", error);
    return [];
  }
  return data ?? [];
}

export async function getSeccoesDaEstacao(estacaoId: string): Promise<Seccao[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("seccoes")
    .select("*")
    .eq("estacao_id", estacaoId)
    .order("numero", { ascending: true });
  if (error) {
    console.error("getSeccoesDaEstacao:", error);
    return [];
  }
  return data ?? [];
}

export async function getProgressoAluna(alunaId: string): Promise<ProgressoConteudo[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("progresso")
    .select("conteudo_id, concluido, concluido_em")
    .eq("aluna_id", alunaId);
  if (error) return [];
  return data ?? [];
}

export async function contarConteudosPorEstacao(): Promise<Record<string, number>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conteudos")
    .select("estacao_id");
  if (error) return {};
  const contagem: Record<string, number> = {};
  for (const c of data ?? []) {
    contagem[c.estacao_id] = (contagem[c.estacao_id] ?? 0) + 1;
  }
  return contagem;
}

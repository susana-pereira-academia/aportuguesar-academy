import { createClient } from "@/lib/supabase/server";

export interface Estacao {
  id: string;
  slug: string;
  numero: number;
  nome: string;
  descricao: string | null;
  publicada: boolean;
}

export interface Conteudo {
  id: string;
  estacao_id: string;
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

export interface EstacaoComConteudos extends Estacao {
  conteudos: Conteudo[];
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

  const [estacoesRes, conteudosRes] = await Promise.all([
    queryEstacoes,
    supabase.from("conteudos").select("*").order("numero", { ascending: true }),
  ]);

  if (estacoesRes.error) {
    console.error("getEstacoesComConteudos (estacoes):", estacoesRes.error.message);
    return [];
  }
  if (conteudosRes.error) {
    console.error("getEstacoesComConteudos (conteudos):", conteudosRes.error.message);
  }

  const conteudosPorEstacao = new Map<string, Conteudo[]>();
  for (const c of conteudosRes.data ?? []) {
    const arr = conteudosPorEstacao.get(c.estacao_id) ?? [];
    arr.push(c);
    conteudosPorEstacao.set(c.estacao_id, arr);
  }

  return (estacoesRes.data ?? []).map((e) => ({
    ...e,
    conteudos: conteudosPorEstacao.get(e.id) ?? [],
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

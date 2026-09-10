import { createClient } from "@/lib/supabase/server";

export interface Encontro {
  id: string;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  duracao_min: number;
  plataforma: string;
  link: string | null;
  vimeo_id: string | null;
  criado_em: string;
}

export async function getEncontros(): Promise<Encontro[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("encontros")
    .select("*")
    .order("data_inicio", { ascending: true });
  if (error) {
    console.error("getEncontros:", error.message);
    return [];
  }
  return data ?? [];
}

export function separarEncontros(encontros: Encontro[]) {
  const agora = Date.now();
  const proximos: Encontro[] = [];
  const passados: Encontro[] = [];
  for (const e of encontros) {
    const inicio = new Date(e.data_inicio).getTime();
    const fim = inicio + e.duracao_min * 60_000;
    if (fim >= agora) proximos.push(e);
    else passados.push(e);
  }
  proximos.sort(
    (a, b) => new Date(a.data_inicio).getTime() - new Date(b.data_inicio).getTime(),
  );
  passados.sort(
    (a, b) => new Date(b.data_inicio).getTime() - new Date(a.data_inicio).getTime(),
  );
  return { proximos, passados };
}

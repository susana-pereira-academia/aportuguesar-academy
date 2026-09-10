"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function alternarProgresso(conteudoId: string, concluido: boolean) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase.from("progresso").upsert(
    {
      aluna_id: user.id,
      conteudo_id: conteudoId,
      concluido,
      concluido_em: concluido ? new Date().toISOString() : null,
    },
    { onConflict: "aluna_id,conteudo_id" },
  );
  if (error) throw error;

  revalidatePath("/jornada", "layout");
}

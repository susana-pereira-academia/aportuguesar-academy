import { NextResponse } from "next/server";
import { requerMentora } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  await requerMentora();
  const body = await req.json();

  const estacao_id = body.estacao_id;
  const titulo = (body.titulo ?? "").toString().trim();
  const tipo = body.tipo ?? "video";

  if (!estacao_id) return NextResponse.json({ erro: "estacao_id obrigatório." }, { status: 400 });
  if (!titulo) return NextResponse.json({ erro: "Título obrigatório." }, { status: 400 });
  if (!["video", "material", "checkbox"].includes(tipo))
    return NextResponse.json({ erro: "Tipo inválido." }, { status: 400 });

  const admin = createAdminClient();

  // próximo número dentro da estação
  const { data: existentes } = await admin
    .from("conteudos")
    .select("numero")
    .eq("estacao_id", estacao_id)
    .order("numero", { ascending: false })
    .limit(1);
  const numero = (existentes?.[0]?.numero ?? 0) + 1;

  const { data, error } = await admin
    .from("conteudos")
    .insert({
      estacao_id,
      numero,
      titulo,
      descricao: body.descricao ?? null,
      tipo,
      vimeo_id: body.vimeo_id ?? null,
      material_url: body.material_url ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ erro: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, conteudo: data });
}

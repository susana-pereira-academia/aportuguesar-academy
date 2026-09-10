import { NextResponse } from "next/server";
import { requerMentora } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  await requerMentora();
  const body = await req.json();

  const titulo = (body.titulo ?? "").toString().trim();
  const data_inicio = body.data_inicio;
  if (!titulo) return NextResponse.json({ erro: "Título obrigatório." }, { status: 400 });
  if (!data_inicio) return NextResponse.json({ erro: "Data obrigatória." }, { status: 400 });

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("encontros")
    .insert({
      titulo,
      descricao: body.descricao ?? null,
      data_inicio,
      duracao_min: body.duracao_min ?? 60,
      plataforma: body.plataforma ?? "Zoom",
      link: body.link ?? null,
      vimeo_id: body.vimeo_id ?? null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ erro: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, encontro: data });
}

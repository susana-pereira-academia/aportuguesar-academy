import { NextResponse } from "next/server";
import { requerMentora } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  await requerMentora();
  const body = await req.json();

  const estacao_id = body.estacao_id;
  const nome = (body.nome ?? "").toString().trim();

  if (!estacao_id) return NextResponse.json({ erro: "estacao_id obrigatório." }, { status: 400 });
  if (!nome) return NextResponse.json({ erro: "Nome obrigatório." }, { status: 400 });

  const admin = createAdminClient();

  // próximo número dentro da estação
  const { data: existentes } = await admin
    .from("seccoes")
    .select("numero")
    .eq("estacao_id", estacao_id)
    .order("numero", { ascending: false })
    .limit(1);
  const numero = (existentes?.[0]?.numero ?? 0) + 1;

  const { data, error } = await admin
    .from("seccoes")
    .insert({
      estacao_id,
      numero,
      nome,
      descricao: body.descricao ?? null,
      publicada: body.publicada ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ erro: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, seccao: data });
}

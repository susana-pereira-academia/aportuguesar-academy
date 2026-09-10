import { NextResponse } from "next/server";
import { requerMentora } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: Request, ctx: Ctx) {
  await requerMentora();
  const { id } = await ctx.params;
  const body = await req.json();

  const patch: Record<string, unknown> = {};
  if ("nome" in body) patch.nome = body.nome;
  if ("descricao" in body) patch.descricao = body.descricao;
  if ("publicada" in body) patch.publicada = body.publicada;
  if ("numero" in body) patch.numero = body.numero;
  if ("slug" in body) patch.slug = body.slug;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("estacoes")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ erro: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, estacao: data });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  await requerMentora();
  const { id } = await ctx.params;

  const admin = createAdminClient();
  const { error } = await admin.from("estacoes").delete().eq("id", id);

  if (error) return NextResponse.json({ erro: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

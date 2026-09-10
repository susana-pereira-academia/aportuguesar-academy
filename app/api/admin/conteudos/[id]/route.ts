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
  for (const key of ["titulo", "descricao", "tipo", "vimeo_id", "material_url", "numero"]) {
    if (key in body) patch[key] = body[key];
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("conteudos")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ erro: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, conteudo: data });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  await requerMentora();
  const { id } = await ctx.params;

  const admin = createAdminClient();
  const { error } = await admin.from("conteudos").delete().eq("id", id);

  if (error) return NextResponse.json({ erro: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}

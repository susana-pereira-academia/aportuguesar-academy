import { NextResponse } from "next/server";
import { requerMentora } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

function slugify(texto: string) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function POST(req: Request) {
  await requerMentora();
  const body = await req.json();

  const nome = (body.nome ?? "").toString().trim();
  if (!nome) return NextResponse.json({ erro: "Nome obrigatório." }, { status: 400 });

  const admin = createAdminClient();

  // próximo número
  const { data: existentes } = await admin
    .from("estacoes")
    .select("numero")
    .order("numero", { ascending: false })
    .limit(1);
  const numero = (existentes?.[0]?.numero ?? 0) + 1;

  const slug = body.slug ? slugify(body.slug) : slugify(nome) + "-" + numero;

  const { data, error } = await admin
    .from("estacoes")
    .insert({
      nome,
      slug,
      numero,
      descricao: body.descricao ?? null,
      publicada: body.publicada ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ erro: error.message }, { status: 400 });
  return NextResponse.json({ ok: true, estacao: data });
}

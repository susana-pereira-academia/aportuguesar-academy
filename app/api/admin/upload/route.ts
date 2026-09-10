import { NextResponse } from "next/server";
import { requerMentora } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  await requerMentora();

  const form = await req.formData();
  const ficheiro = form.get("ficheiro") as File | null;

  if (!ficheiro) return NextResponse.json({ erro: "Ficheiro em falta." }, { status: 400 });

  const nomeSeguro = ficheiro.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9._-]+/g, "-");
  const timestamp = Date.now().toString(36);
  const path = `${timestamp}-${nomeSeguro}`;

  const admin = createAdminClient();
  const { error } = await admin.storage
    .from("materiais")
    .upload(path, ficheiro, {
      contentType: ficheiro.type,
      upsert: false,
    });

  if (error) return NextResponse.json({ erro: error.message }, { status: 400 });

  const { data } = admin.storage.from("materiais").getPublicUrl(path);
  return NextResponse.json({ ok: true, url: data.publicUrl });
}

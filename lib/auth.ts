import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PLATAFORMA } from "@/lib/config";

export async function getUtilizador() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function requerUtilizador() {
  const user = await getUtilizador();
  if (!user) redirect("/login");
  return user;
}

export async function requerMentora() {
  const user = await requerUtilizador();
  const emailMentora = process.env.NEXT_PUBLIC_MENTORA_EMAIL ?? PLATAFORMA.mentora.email;
  if (user.email !== emailMentora) redirect("/jornada");
  return user;
}

import { redirect } from "next/navigation";
import { getUtilizador } from "@/lib/auth";

export default async function Home() {
  const user = await getUtilizador();
  if (user) redirect("/jornada");
  redirect("/login");
}

import { Nav } from "@/components/layout/nav";
import { Sidebar } from "@/components/jornada/sidebar";
import { requerUtilizador } from "@/lib/auth";
import {
  getEstacoesComConteudos,
  getProgressoAluna,
} from "@/lib/data/jornada";

export default async function JornadaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requerUtilizador();
  const [estacoes, progresso] = await Promise.all([
    getEstacoesComConteudos(),
    getProgressoAluna(user.id),
  ]);

  const feitos = progresso.filter((p) => p.concluido);
  const idsFeitos = feitos.map((p) => p.conteudo_id);
  const total = estacoes.reduce((acc, e) => acc + e.conteudos.length, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Nav autenticado />
      <div className="flex-1 flex flex-col lg:flex-row">
        <Sidebar
          estacoes={estacoes}
          idsFeitos={idsFeitos}
          progressoTotal={{ feitos: feitos.length, total }}
        />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}

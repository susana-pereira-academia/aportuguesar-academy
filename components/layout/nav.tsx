import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import { getUtilizador } from "@/lib/auth";
import { PLATAFORMA } from "@/lib/config";

interface NavProps {
  autenticado?: boolean;
}

export async function Nav({ autenticado = false }: NavProps) {
  let mentora = false;
  if (autenticado) {
    const user = await getUtilizador();
    const emailMentora =
      process.env.NEXT_PUBLIC_MENTORA_EMAIL ?? PLATAFORMA.mentora.email;
    mentora = user?.email === emailMentora;
  }

  return (
    <nav
      className="border-b backdrop-blur-sm"
      style={{
        borderColor: "rgba(200, 209, 236, 0.6)",
        backgroundColor: "rgba(253, 251, 248, 0.85)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-3">
          {autenticado ? (
            <>
              <Button href="/jornada" variant="ghost" size="sm">
                A minha jornada
              </Button>
              {mentora && (
                <Button href="/admin" variant="ghost" size="sm">
                  Painel
                </Button>
              )}
              <Button href="/definicoes" variant="ghost" size="sm">
                Definições
              </Button>
              <form action="/api/auth/logout" method="post">
                <Button variant="outline" size="sm" type="submit">
                  Sair
                </Button>
              </form>
            </>
          ) : (
            <Button href="/login" size="sm">
              Entrar
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

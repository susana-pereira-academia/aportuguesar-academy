import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getUtilizador } from "@/lib/auth";
import { PLATAFORMA } from "@/lib/config";

interface NavProps {
  autenticado?: boolean;
}

/** Fundo de azulejo das páginas internas.
 *  Vive aqui porque é o par do topo: onde há este cabeçalho, há este fundo.
 *  Afina-se em app/globals.css, na classe .azulejo-fundo. */
function FundoAzulejo() {
  return (
    <div
      aria-hidden
      className="azulejo-fundo fixed inset-0 z-[-1] pointer-events-none"
    >
      <div className="azulejo azulejo-camada absolute inset-0" />
      <div className="azulejo-veu absolute inset-x-0 top-0" />
    </div>
  );
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
    <>
      <FundoAzulejo />

      {/* Sem barra: o nome ao centro e o filete dourado, como na página de
          login. Os botões pousam no canto, sobre o azulejo — em ecrã
          estreito descem para cima do nome, para não lhe passarem por cima. */}
      <header className="relative">
        <div className="flex flex-wrap items-center justify-center gap-2 px-4 pt-3 sm:absolute sm:right-0 sm:top-0 sm:justify-end sm:px-5 sm:pt-4">
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
                <Button
                  variant="outline"
                  size="sm"
                  type="submit"
                  className="bg-white/70"
                >
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

        <div className="px-6 pt-5 pb-6 text-center sm:pt-7">
          <Link
            href="/"
            className="font-serif italic text-2xl sm:text-3xl text-noite-800 hover:text-noite-600 transition-colors"
          >
            {PLATAFORMA.nome}
          </Link>
          <div className="w-20 dourado-divider mx-auto mt-3" />
        </div>
      </header>
    </>
  );
}

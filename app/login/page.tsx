import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/ui/logo";
import { PLATAFORMA } from "@/lib/config";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-areia-50">
      {/* Azulejo — elemento de identidade da marca. Ténue, e só atrás do espaço
          em branco: o Manual pede que o layout respire. */}
      <div className="azulejo absolute inset-0 pointer-events-none" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 42%, var(--areia-50) 45%, transparent 100%)",
        }}
      />

      <main className="relative flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md text-center">
          <Logo variante="completa" className="mb-8" />

          {PLATAFORMA.marcaMae && (
            <p className="text-[11px] tracking-[0.35em] uppercase text-noite-600 mb-6">
              {PLATAFORMA.marcaMae}
            </p>
          )}

          <h1 className="font-serif italic text-5xl sm:text-6xl noite-text-rich mb-4">
            {PLATAFORMA.nome}
          </h1>

          <div className="flex items-center justify-center gap-3 mb-12">
            <div className="w-10 dourado-divider" />
            <p className="font-serif italic text-base text-dourado-700">
              Aportuguesar é connosco.
            </p>
            <div className="w-10 dourado-divider" />
          </div>

          <p className="font-serif italic text-2xl text-noite-800 mb-3">
            Bem-vinda
          </p>
          <p className="text-sm text-ink-soft mb-10">
            Escreve o teu email e a tua palavra-passe para entrares.
          </p>

          <div className="rounded-2xl bg-white noite-border-rich noite-shadow-lg px-6 sm:px-8 py-8 text-left">
            <LoginForm />
          </div>
        </div>
      </main>

      <footer className="relative py-10 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 dourado-divider" />
          <p className="text-[10px] tracking-[0.3em] uppercase text-noite-600">
            {PLATAFORMA.marcaMae ? `${PLATAFORMA.marcaMae} · ${PLATAFORMA.nome}` : PLATAFORMA.nome}
          </p>
          <div className="w-8 dourado-divider" />
        </div>
        <p className="text-[11px] text-ink-faint">
          © {new Date().getFullYear()} {PLATAFORMA.marcaMae ?? PLATAFORMA.nome}. Todos os direitos reservados.
        </p>
      </footer>
    </div>
  );
}

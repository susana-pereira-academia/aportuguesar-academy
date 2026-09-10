import { LoginForm } from "@/components/auth/login-form";
import { Logo } from "@/components/ui/logo";
import { PLATAFORMA } from "@/lib/config";

export const metadata = { title: "Entrar" };

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col bg-areia-50">
      {/* Azulejo — elemento de identidade da marca. Fica só nas margens: a máscara
          abre o centro, para o conteúdo respirar como o Manual pede. */}
      <div
        className="azulejo absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          maskImage:
            "radial-gradient(ellipse 66% 62% at 50% 45%, transparent 42%, black 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 66% 62% at 50% 45%, transparent 42%, black 100%)",
        }}
      />

      <main className="relative flex-1 flex items-center justify-center px-6 py-12">
        {/* Só o logótipo e o nome da plataforma acima do formulário. */}
        <div className="w-full max-w-md text-center">
          <Logo variante="completa" className="mb-7" />

          <h1 className="font-serif italic text-5xl sm:text-6xl noite-text-rich mb-6 leading-[1.05]">
            {PLATAFORMA.nome}
          </h1>

          <div className="w-24 dourado-divider mx-auto mb-10" />

          <div className="rounded-2xl bg-white marca-border-rich marca-shadow-lg px-6 sm:px-8 py-8 text-left">
            <LoginForm />
          </div>
        </div>
      </main>
    </div>
  );
}

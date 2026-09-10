import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { PLATAFORMA } from "@/lib/config";

interface LogoProps {
  className?: string;
  href?: string;
  /** "compacta" — monograma SP + nome, para a barra de topo.
   *  "completa" — logótipo inteiro (SP + ACADEMIA), para o login. */
  variante?: "compacta" | "completa";
}

const LOGO = "/sp-academia-logo.png";
const LOGO_W = 352;
const LOGO_H = 323;

export function Logo({ className, href = "/", variante = "compacta" }: LogoProps) {
  if (variante === "completa") {
    return (
      <Image
        src={LOGO}
        alt={`${PLATAFORMA.marcaMae || PLATAFORMA.nome} — logótipo`}
        width={LOGO_W}
        height={LOGO_H}
        priority
        className={cn("h-24 w-auto mx-auto", className)}
      />
    );
  }

  // A barra de topo é baixa: mostra-se só o monograma SP, cortando a palavra
  // ACADEMIA (os últimos ~18% da altura do ficheiro), que a esta escala seria ilegível.
  return (
    <Link href={href} className={cn("inline-flex items-center gap-3 group", className)}>
      <span className="block h-[29px] w-[38px] overflow-hidden shrink-0">
        <Image
          src={LOGO}
          alt=""
          width={LOGO_W}
          height={LOGO_H}
          priority
          className="w-[38px] h-auto max-w-none"
        />
      </span>
      <span className="font-serif text-xl font-semibold tracking-wide text-noite-800 group-hover:text-noite-600 transition-colors">
        {PLATAFORMA.nome}
      </span>
    </Link>
  );
}

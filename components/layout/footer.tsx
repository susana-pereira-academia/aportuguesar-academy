import { PLATAFORMA } from "@/lib/config";

export function Footer() {
  return (
    <footer
      className="border-t py-8 mt-16"
      style={{ borderColor: "rgba(235, 220, 196, 0.9)" }}
    >
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-ink-faint">
        <p>
          © {new Date().getFullYear()} {PLATAFORMA.nome}. Construído no{" "}
          <a
            href="https://claude.com/claude-code"
            target="_blank"
            rel="noopener noreferrer"
            className="text-noite-700 hover:text-noite-600"
          >
            Claude Code
          </a>{" "}
          via eFounder.
        </p>
        <p className="tracking-[0.2em] uppercase text-[10px]">
          {PLATAFORMA.mentora.nome}
        </p>
      </div>
    </footer>
  );
}

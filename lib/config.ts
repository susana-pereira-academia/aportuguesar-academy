// ============================================================
// CONFIGURAÇÃO DA TUA PLATAFORMA
// ------------------------------------------------------------
// Preenchido a partir do desenho da Missão 2 (eSystem — Desenho v1).
// Edita à mão sempre que quiseres afinar textos.
// ============================================================

export const PLATAFORMA = {
  /** Nome que aparece no topo, no separador do browser e como título grande no login */
  nome: "Aportuguesar Academy",

  /** Iniciais (1-3 letras) para o logo pequeno */
  iniciais: "AA",

  /** Marca-mãe (chapéu pequeno acima do nome grande no login) — deixa string vazia para esconder */
  marcaMae: "SP ACADEMIA",

  /** Frase-âncora — não aparece no login, mas fica guardada para landing ou emails */
  fraseAncora: "Um pouco de cada vez, e um dia falas português.",

  /** Subtítulo curto */
  subtitulo: "Entra, erra em voz alta e avança ao teu ritmo.",

  /** Nome de quem tu és — a mentora atrás da plataforma */
  mentora: {
    nome: "Susana Pereira",
    email: "portuguescomsusana@gmail.com",
  },

  /** Password inicial das alunas. Vem da variável de ambiente PASSWORD_INICIAL,
   *  para não ficar escrita no repositório. Ver .env.local e o Vercel. */
  passwordInicial: "",

  /** Vocabulário que usas para os blocos da tua jornada.
   *  Muda aqui e o site inteiro acompanha — ver lib/vocabulario.ts. */
  vocabulario: {
    /** Nome plural do nível 1 — ex: "Níveis", "Módulos", "Estações", "Blocos" */
    estacoes: "Níveis",
    estacao: "Nível",
    /** Género do nível 1: "m" para "o nível", "f" para "a estação".
     *  É isto que faz o UI escrever "Novo nível" e não "Nova nível". */
    generoEstacao: "m",
    /** Nome plural do nível 2 (o conteúdo dentro) — ex: "Aulas", "Vídeos", "Desafios" */
    conteudos: "Aulas",
    conteudo: "Aula",
    /** Género do nível 2: "f" para "a aula", "m" para "o vídeo". */
    generoConteudo: "f",
  },
} as const;

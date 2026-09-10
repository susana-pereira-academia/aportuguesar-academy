// ============================================================
// CONFIGURAÇÃO DA TUA PLATAFORMA
// ------------------------------------------------------------
// A skill /esystem-jornada preenche isto a partir do teu
// desenho da Missão 2 (ou perguntando-te ali mesmo).
// Edita à mão sempre que quiseres afinar textos.
// ============================================================

export const PLATAFORMA = {
  /** Nome que aparece no topo, no separador do browser e como título grande no login */
  nome: "eSystem",

  /** Iniciais (1-3 letras) para o logo pequeno */
  iniciais: "eS",

  /** Marca-mãe (chapéu pequeno acima do nome grande no login) — deixa string vazia para esconder */
  marcaMae: "A MINHA ESCOLA",

  /** Frase-âncora — não aparece no login, mas fica guardada para landing ou emails */
  fraseAncora: "A tua transformação, com sistema por baixo.",

  /** Subtítulo curto */
  subtitulo: "Um método próprio, uma jornada guiada, uma comunidade de founders.",

  /** Nome de quem tu és — a mentora atrás da plataforma */
  mentora: {
    nome: "A Mentora",
    email: "tu@teudominio.pt",
  },

  /** Password inicial que a mentora dá às alunas para o primeiro login. */
  passwordInicial: "muda-me-2026",

  /** Vocabulário que usas para os blocos da tua jornada. */
  vocabulario: {
    /** Nome plural do nível 1 — ex: "Módulos", "Estações", "Blocos", "Programas" */
    estacoes: "Estações",
    estacao: "Estação",
    /** Nome plural do nível 2 (o conteúdo dentro) — ex: "Aulas", "Vídeos", "Desafios" */
    conteudos: "Aulas",
    conteudo: "Aula",
  },
} as const;

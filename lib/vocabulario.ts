// ============================================================
// VOCABULÁRIO — as tuas palavras, escritas uma vez só
// ------------------------------------------------------------
// O UI todo puxa daqui. Para trocares "Nível" por "Módulo", ou
// "Aula" por "Desafio", muda apenas o objeto `vocabulario` em
// lib/config.ts (a palavra e o género) — o resto do site acompanha,
// artigos e concordâncias incluídos.
//
// Nota: os nomes no código e na base de dados (estacoes, conteudos)
// não mudam. Isto é só o que a aluna lê no ecrã.
// ============================================================

import { PLATAFORMA } from "@/lib/config";

type Genero = "m" | "f";

function termo(singular: string, plural: string, genero: Genero) {
  const m = genero === "m";
  return {
    /** "Nível" */
    s: singular,
    /** "Níveis" */
    p: plural,
    /** "nível" */
    sMin: singular.toLowerCase(),
    /** "níveis" */
    pMin: plural.toLowerCase(),
    /** "o" / "a" */
    o: m ? "o" : "a",
    /** "os" / "as" */
    os: m ? "os" : "as",
    /** "um" / "uma" */
    um: m ? "um" : "uma",
    /** "Novo" / "Nova" */
    novo: m ? "Novo" : "Nova",
    /** "este" / "esta" */
    este: m ? "este" : "esta",
    /** "do" / "da" */
    do: m ? "do" : "da",
    /** "no" / "na" */
    no: m ? "no" : "na",
    /** Para concordâncias avulsas: g("solto", "solta") */
    g: (masculino: string, feminino: string) => (m ? masculino : feminino),
  };
}

const v = PLATAFORMA.vocabulario;

export const VOC = {
  /** O agrupador — nível 1 */
  estacao: termo(v.estacao, v.estacoes, v.generoEstacao),
  /** O que está lá dentro — nível 2 */
  conteudo: termo(v.conteudo, v.conteudos, v.generoConteudo),
};

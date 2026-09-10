# Aportuguesar Academy — Estado da Plataforma

*Susana Pereira · 10 de setembro de 2026*

Tudo o que precisas para retomar isto de qualquer computador.

---

## O que é

A plataforma de formação da SP Academia, construída com a skill `/esystem-jornada` a partir do template `Anacristinarosa/esystem-jornada-template` (Next.js + Supabase).

**No ar:** https://aportuguesar.com
**Também responde em:** https://www.aportuguesar.com e https://aportuguesar-academy.vercel.app

---

## Acessos

| O quê | Onde |
|---|---|
| Código | https://github.com/susana-pereira-academia/aportuguesar-academy (público) |
| Alojamento | Vercel, projeto `sp-academia/aportuguesar-academy` |
| Base de dados | Supabase, projeto `dxngdiabytgusylatuue` (lá dentro chama-se "Aportuguesar Acadmy", com typo — inofensivo) |
| Domínio | Cloudflare, registado a 10set2026 |
| Conta de mentora | portuguescomsusana@gmail.com · password `escola2026` |

Entras em todos com o login Google `portuguescomsusana@gmail.com`.

---

## Recomeçar noutro computador

Precisas de `git` e `node` instalados. Depois:

```
git clone https://github.com/susana-pereira-academia/aportuguesar-academy.git
cd aportuguesar-academy
npm install
```

Falta o ficheiro `.env.local` — não está no GitHub de propósito, porque tem a chave admin. Cria-o com este conteúdo:

```
NEXT_PUBLIC_SUPABASE_URL=https://dxngdiabytgusylatuue.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_NbXn2hADCw1fA1BGuqT0_g_LvQctv4g
SUPABASE_SERVICE_ROLE_KEY=<vai buscar>
NEXT_PUBLIC_MENTORA_EMAIL=portuguescomsusana@gmail.com
PASSWORD_INICIAL=escola2026
```

A chave que falta vais buscá-la ao Supabase: Settings → API Keys → Secret keys → clica no olho para revelar. Não a escrevi aqui de propósito: é a chave que dá acesso total à base de dados, e este documento sincroniza pelo iCloud.

Depois `npm run dev` e abre localhost:3000.

Para publicar alterações: `vercel --prod` (precisas de `npm install -g vercel` e `vercel login` da primeira vez).

---

## Como está organizada

Três níveis:

**Estação** → **Secção** → **Aula**

As sete estações vêm do teu documento "A Jornada — Aportuguesar Academy":

| Nº | Estação | Aulas |
|---|---|---|
| 0 | Entrada — Diagnóstico de Nível | 4 |
| 1 | A1 — Alicerces | 7 |
| 2 | A2 — Forma | 7 |
| 3 | B1 — Independência | 7 |
| 4 | B2 — Profundidade | 7 |
| 5 | C1 — Domínio | 7 |
| 6 | C2 — Autonomia Plena | 7 |

Os 46 conteúdos vieram um a um do teu "Mapa da Fusão — IA e Eu". Em cada nível: Diagnóstico → Módulo 1 a 4 → Avaliação → Transição. Diagnósticos e avaliações são do tipo "marco" (a aluna marca como feito); módulos e mensagens gravadas são do tipo "vídeo", ainda sem ID.

Está criada uma secção — **Módulo 1**, dentro do A1 — ainda vazia. As 46 aulas estão todas soltas nas estações.

### O que as secções te dão

- Nome e descrição próprios
- Interruptor publicada/rascunho: em rascunho, nem a secção nem as aulas dela aparecem às alunas
- Mover aulas entre secções pelo menu, ao editar a aula
- "Sem secção — solta na estação" para aulas que não pertencem a módulo nenhum
- Apagar uma secção **não apaga as aulas** — voltam a ficar soltas

---

## Design — decisão a meio (10set2026, fim da tarde)

Pediste fundo branco e menos linhas. Fiz três coisas, **guardadas no git mas ainda NÃO publicadas** — o site no ar continua como estava:

1. `--background` passou de creme (`#FDFAF4`) para branco puro (`#FFFFFF`) em `app/globals.css`
2. Os cartões passaram de `bg-areia-50` para `bg-white` (26 sítios); os filetes `.marca-border` ficaram mais esbatidos
3. A linha por baixo do cabeçalho foi tirada em `components/layout/nav.tsx`, e o fundo dele passou a branco translúcido
4. No painel, cada linha de aula deixou de trazer a sua borda — separa-se por espaço e realce ao passar o rato

Ficou uma pergunta por responder. Mostraste um recorte do topo da página de login e disseste "isto como está na página de login". A página de login não tem cabeçalho nenhum — só o nome grande sobre branco, com o azulejo a colorir as margens; é de lá que vem o tom creme do topo. Não ficou claro se querias:

- tirar a barra de navegação das páginas internas, deixando só o nome
- trazer o tom creme do topo de volta às páginas internas
- o nome sem o símbolo "SP" ao lado, como no login

**Para publicar quando decidires:** `vercel --prod`
**Para desfazer tudo isto:** `git revert` do commit "design: fundo branco e menos linhas"

---

## Falta fazer

**Os IDs de vídeo.** Os 30 conteúdos de vídeo estão vazios. Pões cada um no painel, em Gerir aulas.

**As secções restantes.** Falta criar Módulo 2, 3 e 4 no A1, e os quatro módulos de cada um dos outros cinco níveis.

**A password inicial.** O repositório é público e o histórico do git ainda guarda o commit antigo com `escola2026` lá dentro. Tirei-a do código atual (agora vem da variável de ambiente), mas o histórico fica. A saída limpa é mudares a password: mudas no `.env.local` e no Vercel, e nada no código precisa de mexer.

**A sessão mensal de tira-dúvidas.** É transversal a todos os níveis, pertence à Agenda e não a nenhuma estação. Ainda não está criada.

---

## O curso A1 no WordPress

O "Online Course – Portuguese A1" continua em susanapereiraacademia.com (Tutor LMS), curso id **8412**.

Estrutura lá: Boas-Vindas (4) · Módulo 1 (11) · Módulo 2 (13) · Módulo 3 (18) · Módulo 4 (11) · Sessões AO VIVO (1). **57 aulas com vídeo, todas no YouTube.**

Nada foi transferido. O levantamento foi feito uma vez; o obstáculo não é o acesso, é decidires como organizar.

Para voltar a puxar os dados (a REST `/wp-json/tutor/v1/` dá 403 com a sessão do browser; o que funciona é AJAX em `admin-ajax.php` com o nonce `_tutorobject._tutor_nonce`):

- `action=tutor_course_contents` + `course_id` → módulos e aulas
- `action=tutor_lesson_details` + `lesson_id` + `topic_id` + `course_id` → vídeo e anexos de cada aula

---

## Sobre alojar os vídeos

Perguntaste se havia alternativa gratuita ao YouTube. O resumo:

| Onde | Custo | O que ganhas / perdes |
|---|---|---|
| YouTube | grátis | publicidade em cima do teu conteúdo, vídeos de outros sugeridos no fim, a aluna a um clique de sair |
| Cloudflare Stream | ~5$/mês por 1000 min | limpo, sem publicidade, podes restringir ao teu domínio |
| Bunny Stream | ~1$/mês por 1000 min | igualmente limpo, mais barato |
| Vimeo | grátis até 25 vídeos | não chega para 53 aulas |
| Supabase Storage | 1GB grátis | dá para 8-12 aulas, e sem streaming adaptativo: com internet fraca, o vídeo pára |

---

## Decisões tomadas, e porquê

**Domínio `aportuguesar.com`, sem hífen.** Começaste por pedir `aportuguesar.academy.com`, mas `academy.com` pertence à MarkMonitor — não podia ser teu. Consideraste `aportuguesar-academy.com`; o hífen custa a dizer em voz alta e a escrever de cabeça, e escolheste a versão sem.

**Registos DNS com a nuvem cinzenta (DNS only).** Se ficarem laranja, a Cloudflare mete-se à frente do Vercel e o certificado HTTPS não é emitido. É o erro mais comum nesta ligação.

**A password inicial saiu do código.** Está agora na variável de ambiente `PASSWORD_INICIAL`, no `.env.local` e no Vercel. O painel continua a mostrá-la depois de criares cada aluna.

**Secções como tabela própria, não como campo de texto.** Assim tens identidade a sério — reordenar, descrever, esconder uma enquanto a preparas. Um campo de texto agrupava por nome, mas "Modulo 1" e "Módulo 1" apareciam como duas secções diferentes.

---

## Uma nota sobre o iCloud

O código vive em `~/Projetos/eSystem-aportuguesar-academy`, **fora do iCloud**. O iCloud despeja ficheiros e corrompe repositórios git — foi o que aconteceu ao dashboard em setembro de 2026. Este documento pode estar no iCloud porque é texto; o código não.

Noutro computador, clona do GitHub. Não copies a pasta pelo iCloud.

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
| Conta de mentora | portuguescomsusana@gmail.com (a password não se escreve aqui — ver abaixo) |

Entras em todos com o login Google `portuguescomsusana@gmail.com`.

> **Nenhuma password se escreve neste documento.** Ele vive num repositório
> público no GitHub: o que aqui ficar, fica à vista de toda a gente. As duas —
> a de mentora e a inicial das alunas — vivem no teu gestor de passwords. A do
> Vercel está guardada como *Secret* e não se consegue voltar a ler de lá.

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
PASSWORD_INICIAL=<vai buscar ao Vercel>
```

A **password inicial** está guardada no Vercel como *Secret*, e um Secret **não
se consegue voltar a ler** — nem no painel, nem por comando. Tem de estar no teu
gestor de passwords. Se a perderes, não a recuperas: defines uma nova com
`vercel env rm` + `vercel env add` e publicas.

A **chave do Supabase** vais buscá-la ao Supabase: Settings → API Keys → Secret keys → clica no olho para revelar. Não a escrevi aqui de propósito: é a chave que dá acesso total à base de dados, e este documento sincroniza pelo iCloud.

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

## Design — fechado e publicado (11set2026)

O topo das páginas internas passou a ser como o da página de login: o nome ao
centro em serifa itálica com o filete dourado por baixo, **sem barra de
navegação e sem o monograma SP**. Os botões (A minha jornada, Painel,
Definições, Sair) pousam no canto superior direito, sobre o azulejo; em ecrã
estreito descem para cima do nome.

O azulejo do login passa a pintar as margens de todas as páginas internas, mas
mais leve do que lá — aqui há texto por cima o tempo todo. A coluna da esquerda
deixou de ser creme e ficou branca.

**A página de login não mudou:** o logótipo SP fica lá, inteiro.

### Afinar o azulejo

Está tudo reunido em `app/globals.css`, na classe `.azulejo-fundo`, com três
valores comentados em português:

| Valor | O que faz | Está em |
|---|---|---|
| `--azulejo-forca` | quanto se vê no total (0 = nada, 1 = como no login) | `0.5` |
| `--azulejo-veu-topo` | quanto se alivia a faixa de cima, por trás do nome | `0.8` |
| `--azulejo-altura-topo` | até onde desce esse alívio | `180px` |

Mexes num número, gravas, e a página recarrega sozinha se tiveres o
`npm run dev` a correr.

---

## Falta fazer

**Os IDs de vídeo.** Os 30 conteúdos de vídeo estão vazios. Pões cada um no painel, em Gerir aulas.

**As secções.** Não há nada a fazer aqui por agora, e o ponto que aqui estava
estava errado. Em cada nível, os "Módulos" **já são aulas** — "Módulo 1 — A1" é
uma aula, não uma secção. Criar secções com esses nomes punha, na mesma coluna,
uma secção "Módulo 2" ao lado de uma aula "Módulo 2", vazia.

As secções só ganham sentido com a migração do curso: no WordPress, o que aqui é
*uma* aula chamada "Módulo 1 — A1" são na verdade **11 aulas**. Aí, "Módulo 1"
passa a ser a secção que as arruma. Fica para essa altura.

Há uma secção vazia chamada "Módulo 1" dentro do A1, dos primeiros testes.
Apaga-a no painel — apagar uma secção não mexe em aula nenhuma.

**As alunas de teste.** Há duas contas de teste na base de dados, criadas a 10set2026 com a password inicial antiga. Apaga-as no painel quando já não precisares delas.

**A sala da sessão de tira-dúvidas.** As sessões já estão criadas (ver abaixo),
mas sem link. Quando tiveres a sala do Zoom, põe o link em cada uma, no painel,
em Gerir agenda. Até lá a plataforma escreve à aluna "O link vai ser adicionado
antes do encontro".

**A sessão de 31 de dezembro.** A regra — última quinta-feira do mês — calha,
nesse mês, na noite de passagem de ano. Apaga-a ou muda-a para outro dia.

**As duas passwords.** Ver a secção "Segurança" mais abaixo.

---

## A agenda

A **Sessão de tira-dúvidas** repete-se na **última quinta-feira de cada mês, às
18h**, 60 minutos, Zoom. A plataforma não tem regra de repetição: cada sessão é
uma entrada própria. Estão criadas **doze**, de setembro de 2026 a agosto de
2027 — quando estiverem a acabar, criam-se as doze seguintes.

As horas ficam guardadas em UTC e mostradas em hora de Lisboa, portanto a
mudança da hora em outubro e em março está tratada: são 18h de Lisboa em todos
os meses, no verão e no inverno.

---

## Segurança

A password `escola2026` esteve escrita neste documento, num repositório público
do GitHub, ao lado do email da mentora e do endereço do Supabase. Foi retirada a
11set2026, mas **quem a tenha visto continua a saber**. Por isso:

1. **A password da conta de mentora** muda-se no próprio site, em Definições.
2. **A password inicial das alunas** muda-se no Vercel e no `.env.local`:

```
vercel env rm PASSWORD_INICIAL production --yes
vercel env add PASSWORD_INICIAL production
vercel deploy --prod --yes
```

A publicação no fim não é opcional: as variáveis de ambiente só entram no site na
publicação seguinte. Mudar a `PASSWORD_INICIAL` **não mexe em contas já criadas** —
só serve para as alunas novas.

Nenhuma password se escreve neste documento.

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

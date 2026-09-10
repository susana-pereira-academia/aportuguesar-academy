# eSystem Jornada — Template

Plataforma de formação para founders: login das alunas, área privada com mapa da jornada, encontros ao vivo, gravações, painel da mentora completo.

Base para o eSystem tipo "Jornada com Tutora Virtual" do eFounder.

**Stack:** Next.js 15 · Supabase (auth, DB, storage) · Tailwind CSS · TypeScript

## O que vem no template

**Para a aluna:**
- Login elegante (estilo eFounder) — chapéu da marca-mãe, nome grande em serif itálico, formulário simples
- Layout tipo Hotmart — sidebar com progresso, atalhos para Agenda e Gravações, lista de estações expansíveis
- Página da aula com player Vimeo grande, descrição, botão "concluída", navegação anterior/seguinte
- Página **Agenda** com próximo encontro em destaque + próximos abaixo (data, hora, duração, link Zoom)
- Página **Gravações** com encontros passados que tenham vídeo

**Para a mentora (`/admin`):**
- Tabela de alunas com progresso; clica no nome → detalhe com progresso aula a aula
- Adicionar aluna com 1 clique (email + password fixa)
- **Gerir estações e aulas** — CRUD completo, upload de PDFs para o Supabase Storage
- **Gerir agenda** — criar encontros com data/hora/link; quando passam, se tiverem Vimeo ID, aparecem em Gravações automaticamente

**Design:**
- Paleta creme + dourado (eFounder). Fácil de trocar por cores próprias em `app/globals.css`

## Quick start (feito pela skill)

A skill `/esystem-jornada` faz tudo por ti — clona este template, patcha textos, cria contas iniciais, e arranca. Se preferires manual:

```bash
npm install
cp .env.example .env.local
# preenche .env.local com URL + anon key + service_role key + email da mentora
npm run dev
```

Abre <http://localhost:3000>.

## Setup Supabase manual

1. Cria projeto novo em [supabase.com](https://supabase.com)
2. **Settings → API Keys** — copia:
   - Project URL
   - `anon public` key
   - `service_role` `secret` key
3. **SQL Editor** → cola e corre o `db/schema.sql` (cria tabelas, RLS, view do painel)
4. **Storage** → cria bucket `materiais` (público, para PDFs de aula)

## Variáveis de ambiente

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=sb_secret_...
NEXT_PUBLIC_MENTORA_EMAIL=tu@teudominio.pt
PASSWORD_INICIAL=umapassword2026
```

A `service_role` key é secreta — fica só no servidor. Nunca commit.

## Deploy

```bash
vercel deploy --prod
```

E adiciona as env vars no Vercel Dashboard.

---

Criado com a skill `/esystem-jornada` do eFounder.

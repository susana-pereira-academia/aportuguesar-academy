-- ============================================================
-- Schema da plataforma eSystem Jornada
-- Cola no SQL Editor do Supabase e corre uma vez.
-- Cria: tabelas, RLS, view do painel da mentora, seed de exemplo.
-- ============================================================

-- ─────────────── TABELAS ───────────────

create table if not exists public.estacoes (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  numero integer not null,
  nome text not null,
  descricao text,
  publicada boolean not null default true,
  criada_em timestamptz not null default now()
);

create index if not exists idx_estacoes_numero on public.estacoes(numero);

create table if not exists public.seccoes (
  id uuid primary key default gen_random_uuid(),
  estacao_id uuid not null references public.estacoes(id) on delete cascade,
  numero integer not null,
  nome text not null,
  descricao text,
  publicada boolean not null default true,
  criada_em timestamptz not null default now()
);

create index if not exists idx_seccoes_estacao on public.seccoes(estacao_id, numero);

do $$ begin
  create type conteudo_tipo as enum ('video', 'material', 'checkbox');
exception when duplicate_object then null; end $$;

create table if not exists public.conteudos (
  id uuid primary key default gen_random_uuid(),
  estacao_id uuid not null references public.estacoes(id) on delete cascade,
  seccao_id uuid references public.seccoes(id) on delete set null,
  numero integer not null,
  titulo text not null,
  descricao text,
  tipo conteudo_tipo not null default 'video',
  vimeo_id text,
  material_url text,
  criado_em timestamptz not null default now()
);

create index if not exists idx_conteudos_estacao on public.conteudos(estacao_id, numero);
create index if not exists idx_conteudos_seccao on public.conteudos(seccao_id);

create table if not exists public.progresso (
  aluna_id uuid not null references auth.users(id) on delete cascade,
  conteudo_id uuid not null references public.conteudos(id) on delete cascade,
  concluido boolean not null default false,
  concluido_em timestamptz,
  atualizado_em timestamptz not null default now(),
  primary key (aluna_id, conteudo_id)
);

create index if not exists idx_progresso_aluna on public.progresso(aluna_id);

create table if not exists public.encontros (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  descricao text,
  data_inicio timestamptz not null,
  duracao_min integer not null default 60,
  plataforma text not null default 'Zoom',
  link text,
  vimeo_id text,
  criado_em timestamptz not null default now()
);

create index if not exists idx_encontros_data on public.encontros(data_inicio desc);

-- ─────────────── ROW-LEVEL SECURITY ───────────────

alter table public.estacoes enable row level security;
alter table public.seccoes enable row level security;
alter table public.conteudos enable row level security;
alter table public.progresso enable row level security;
alter table public.encontros enable row level security;

drop policy if exists "Alunas autenticadas leem estações" on public.estacoes;
create policy "Alunas autenticadas leem estações"
  on public.estacoes for select
  using (auth.role() = 'authenticated' and publicada = true);

drop policy if exists "Alunas autenticadas leem secções" on public.seccoes;
create policy "Alunas autenticadas leem secções"
  on public.seccoes for select
  using (auth.role() = 'authenticated' and publicada = true);

drop policy if exists "Alunas autenticadas leem conteúdos" on public.conteudos;
create policy "Alunas autenticadas leem conteúdos"
  on public.conteudos for select
  using (auth.role() = 'authenticated');

drop policy if exists "Cada aluna vê o próprio progresso" on public.progresso;
create policy "Cada aluna vê o próprio progresso"
  on public.progresso for select
  using (auth.uid() = aluna_id);

drop policy if exists "Cada aluna insere o próprio progresso" on public.progresso;
create policy "Cada aluna insere o próprio progresso"
  on public.progresso for insert
  with check (auth.uid() = aluna_id);

drop policy if exists "Cada aluna atualiza o próprio progresso" on public.progresso;
create policy "Cada aluna atualiza o próprio progresso"
  on public.progresso for update
  using (auth.uid() = aluna_id)
  with check (auth.uid() = aluna_id);

drop policy if exists "Alunas autenticadas leem encontros" on public.encontros;
create policy "Alunas autenticadas leem encontros"
  on public.encontros for select
  using (auth.role() = 'authenticated');

-- ─────────────── VIEW DO PAINEL DA MENTORA ───────────────

create or replace view public.alunas_view as
select
  u.id,
  u.email,
  (u.raw_user_meta_data ->> 'nome') as nome,
  u.created_at as criada_em,
  (select max(p.atualizado_em) from public.progresso p where p.aluna_id = u.id) as ultima_atividade,
  (select count(*) from public.progresso p
    where p.aluna_id = u.id and p.concluido = true) as conteudos_feitos
from auth.users u
order by u.created_at desc;

-- ─────────────── SEED DE EXEMPLO (opcional — apaga se não precisares) ───────────────

insert into public.estacoes (slug, numero, nome, descricao) values
  ('primeira-estacao', 1, 'A primeira estação', 'O primeiro passo. Aqui começas.'),
  ('segunda-estacao', 2, 'A segunda estação', 'Aprofundamento. Aqui aterras.'),
  ('terceira-estacao', 3, 'A terceira estação', 'Consolidação. Aqui integras.')
on conflict (slug) do nothing;

insert into public.conteudos (estacao_id, numero, titulo, descricao, tipo, vimeo_id)
select e.id, 1, 'Vídeo de abertura',
  'Um primeiro contacto com o que vem a seguir.',
  'video'::conteudo_tipo, '76979871'
from public.estacoes e
where e.slug = 'primeira-estacao'
on conflict do nothing;

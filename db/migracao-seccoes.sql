-- ============================================================
-- Acrescenta o nível do meio: estação → secção → aula
-- Não apaga nada. As aulas que já existem ficam sem secção
-- (aparecem soltas no topo da estação) até lhes atribuíres uma.
-- ============================================================

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

-- a aula passa a poder pertencer a uma secção (null = solta na estação)
alter table public.conteudos
  add column if not exists seccao_id uuid references public.seccoes(id) on delete set null;

create index if not exists idx_conteudos_seccao on public.conteudos(seccao_id);

-- ─────────────── RLS ───────────────

alter table public.seccoes enable row level security;

drop policy if exists "Alunas autenticadas leem secções" on public.seccoes;
create policy "Alunas autenticadas leem secções"
  on public.seccoes for select
  using (auth.role() = 'authenticated' and publicada = true);

-- confirmar
select
  (select count(*) from public.seccoes) as seccoes,
  (select count(*) from public.conteudos) as conteudos,
  (select count(*) from public.conteudos where seccao_id is null) as aulas_sem_seccao;

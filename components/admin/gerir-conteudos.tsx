"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Upload,
  Video,
  FileText,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EstacaoComConteudos, Conteudo } from "@/lib/data/jornada";

type Tipo = "video" | "material" | "checkbox";

interface Props {
  estacoes: EstacaoComConteudos[];
}

export function GerirConteudos({ estacoes }: Props) {
  const router = useRouter();
  const [abertas, setAbertas] = useState<Set<string>>(new Set());
  const [novaEstacaoAberta, setNovaEstacaoAberta] = useState(false);
  const [estacaoEditada, setEstacaoEditada] = useState<string | null>(null);
  const [novaAulaEstacao, setNovaAulaEstacao] = useState<string | null>(null);
  const [aulaEditada, setAulaEditada] = useState<string | null>(null);

  function toggle(id: string) {
    setAbertas((prev) => {
      const nova = new Set(prev);
      if (nova.has(id)) nova.delete(id);
      else nova.add(id);
      return nova;
    });
  }

  return (
    <div className="space-y-3">
      {/* Nova estação */}
      {novaEstacaoAberta ? (
        <FormEstacao
          onOk={() => {
            setNovaEstacaoAberta(false);
            router.refresh();
          }}
          onCancel={() => setNovaEstacaoAberta(false)}
        />
      ) : (
        <button
          onClick={() => setNovaEstacaoAberta(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-gold-300 text-gold-700 hover:bg-gold-50 hover:border-gold-400 transition-all text-sm tracking-[0.1em] uppercase font-medium"
        >
          <Plus className="w-4 h-4" />
          Nova estação
        </button>
      )}

      {/* Lista de estações */}
      {estacoes.map((estacao) => {
        const aberta = abertas.has(estacao.id);
        const emEdicao = estacaoEditada === estacao.id;

        return (
          <div
            key={estacao.id}
            className="rounded-2xl bg-cream-50 gold-border gold-shadow overflow-hidden"
          >
            {/* Cabeçalho da estação */}
            <div className="flex items-center gap-3 px-5 py-4">
              <button
                onClick={() => toggle(estacao.id)}
                className="flex items-center gap-3 flex-1 text-left"
              >
                <ChevronDown
                  className={cn(
                    "w-4 h-4 text-gold-600 transition-transform shrink-0",
                    aberta && "rotate-180",
                  )}
                />
                <span className="text-[11px] font-serif italic text-gold-600 w-8">
                  {String(estacao.numero).padStart(2, "0")}
                </span>
                <span className="font-serif italic text-lg gold-text-rich">
                  {estacao.nome}
                </span>
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full uppercase tracking-[0.15em]",
                    estacao.publicada
                      ? "bg-success/10 text-success"
                      : "bg-cream-100 text-ink-faint",
                  )}
                >
                  {estacao.publicada ? "Publicada" : "Rascunho"}
                </span>
                <span className="text-xs text-ink-faint ml-auto">
                  {estacao.conteudos.length}{" "}
                  {estacao.conteudos.length === 1 ? "aula" : "aulas"}
                </span>
              </button>
              <button
                onClick={() =>
                  setEstacaoEditada(emEdicao ? null : estacao.id)
                }
                className="p-2 rounded-md text-gold-700 hover:bg-gold-50"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={async () => {
                  if (
                    !confirm(
                      `Apagar a estação "${estacao.nome}" e todas as aulas dentro?`,
                    )
                  )
                    return;
                  await fetch(`/api/admin/estacoes/${estacao.id}`, {
                    method: "DELETE",
                  });
                  router.refresh();
                }}
                className="p-2 rounded-md text-red-600 hover:bg-red-50"
                title="Apagar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Formulário editar estação */}
            {emEdicao && (
              <div className="border-t border-gold-200/50 px-5 py-4 bg-white/40">
                <FormEstacao
                  inicial={estacao}
                  onOk={() => {
                    setEstacaoEditada(null);
                    router.refresh();
                  }}
                  onCancel={() => setEstacaoEditada(null)}
                />
              </div>
            )}

            {/* Aulas */}
            {aberta && (
              <div className="border-t border-gold-200/50 bg-white/30">
                {estacao.conteudos.length === 0 && novaAulaEstacao !== estacao.id && (
                  <p className="px-5 py-6 text-sm text-ink-faint text-center">
                    Sem aulas ainda.
                  </p>
                )}

                {estacao.conteudos.map((c) => (
                  <LinhaAula
                    key={c.id}
                    conteudo={c}
                    emEdicao={aulaEditada === c.id}
                    onEditar={() =>
                      setAulaEditada(aulaEditada === c.id ? null : c.id)
                    }
                    onFechar={() => setAulaEditada(null)}
                  />
                ))}

                {novaAulaEstacao === estacao.id ? (
                  <div className="border-t border-gold-200/50 px-5 py-4">
                    <FormAula
                      estacaoId={estacao.id}
                      onOk={() => {
                        setNovaAulaEstacao(null);
                        router.refresh();
                      }}
                      onCancel={() => setNovaAulaEstacao(null)}
                    />
                  </div>
                ) : (
                  <button
                    onClick={() => setNovaAulaEstacao(estacao.id)}
                    className="w-full flex items-center justify-center gap-2 px-5 py-3 text-xs tracking-[0.15em] uppercase text-gold-700 hover:bg-gold-50 border-t border-gold-200/50 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Nova aula
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}

      {estacoes.length === 0 && (
        <p className="text-center text-ink-soft py-10">
          Ainda não tens estações. Cria a primeira.
        </p>
      )}
    </div>
  );
}

// ─────────────── Form estação ───────────────

function FormEstacao({
  inicial,
  onOk,
  onCancel,
}: {
  inicial?: { id: string; nome: string; descricao: string | null; publicada: boolean };
  onOk: () => void;
  onCancel: () => void;
}) {
  const [nome, setNome] = useState(inicial?.nome ?? "");
  const [descricao, setDescricao] = useState(inicial?.descricao ?? "");
  const [publicada, setPublicada] = useState(inicial?.publicada ?? true);
  const [pendente, setPendente] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setPendente(true);
    setErro(null);

    const url = inicial
      ? `/api/admin/estacoes/${inicial.id}`
      : "/api/admin/estacoes";
    const method = inicial ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, descricao, publicada }),
    });
    const data = await res.json();
    setPendente(false);

    if (!res.ok) {
      setErro(data.erro ?? "Erro.");
      return;
    }
    onOk();
  }

  return (
    <form onSubmit={submeter} className="rounded-2xl bg-cream-50 gold-border p-5 space-y-3">
      <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-1">
        {inicial ? "Editar estação" : "Nova estação"}
      </p>
      <input
        required
        placeholder="Nome da estação"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full rounded-lg border border-gold-200 bg-white px-3 py-2 text-sm font-serif italic focus:outline-none focus:border-gold-400"
      />
      <textarea
        placeholder="Descrição (opcional)"
        value={descricao ?? ""}
        onChange={(e) => setDescricao(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-gold-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
      />
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={publicada}
          onChange={(e) => setPublicada(e.target.checked)}
          className="accent-gold-500"
        />
        Publicada (visível para alunas)
      </label>
      {erro && <p className="text-sm text-red-600">{erro}</p>}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={pendente}
          className="px-4 py-2 rounded-md bg-gold-foil text-white text-xs tracking-[0.1em] uppercase font-medium hover:opacity-90 disabled:opacity-50"
        >
          {pendente ? "A guardar…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-xs tracking-[0.1em] uppercase text-ink-soft hover:bg-cream-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

// ─────────────── Linha aula ───────────────

function LinhaAula({
  conteudo,
  emEdicao,
  onEditar,
  onFechar,
}: {
  conteudo: Conteudo;
  emEdicao: boolean;
  onEditar: () => void;
  onFechar: () => void;
}) {
  const router = useRouter();
  const Icone =
    conteudo.tipo === "video" ? Video : conteudo.tipo === "material" ? FileText : CheckCircle2;

  return (
    <div className="border-t border-gold-200/50">
      <div className="flex items-center gap-3 px-5 py-3">
        <span className="text-[10px] text-ink-faint w-6">
          {conteudo.numero}.
        </span>
        <Icone className="w-4 h-4 text-gold-500 shrink-0" />
        <span className="text-sm text-ink flex-1 truncate">{conteudo.titulo}</span>
        <span className="text-[10px] text-ink-faint uppercase tracking-[0.15em]">
          {conteudo.tipo === "video" ? "Vídeo" : conteudo.tipo === "material" ? "Material" : "Marco"}
        </span>
        <button
          onClick={onEditar}
          className="p-2 rounded-md text-gold-700 hover:bg-gold-50"
          title="Editar"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={async () => {
            if (!confirm(`Apagar "${conteudo.titulo}"?`)) return;
            await fetch(`/api/admin/conteudos/${conteudo.id}`, { method: "DELETE" });
            router.refresh();
          }}
          className="p-2 rounded-md text-red-600 hover:bg-red-50"
          title="Apagar"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
      {emEdicao && (
        <div className="px-5 pb-4">
          <FormAula
            estacaoId={conteudo.estacao_id}
            inicial={conteudo}
            onOk={() => {
              onFechar();
              router.refresh();
            }}
            onCancel={onFechar}
          />
        </div>
      )}
    </div>
  );
}

// ─────────────── Form aula ───────────────

function FormAula({
  estacaoId,
  inicial,
  onOk,
  onCancel,
}: {
  estacaoId: string;
  inicial?: Conteudo;
  onOk: () => void;
  onCancel: () => void;
}) {
  const [tipo, setTipo] = useState<Tipo>(inicial?.tipo ?? "video");
  const [titulo, setTitulo] = useState(inicial?.titulo ?? "");
  const [descricao, setDescricao] = useState(inicial?.descricao ?? "");
  const [vimeoId, setVimeoId] = useState(inicial?.vimeo_id ?? "");
  const [materialUrl, setMaterialUrl] = useState(inicial?.material_url ?? "");
  const [pendente, setPendente] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [uploadPendente, setUploadPendente] = useState(false);

  async function uploadFicheiro(file: File) {
    setUploadPendente(true);
    setErro(null);
    const form = new FormData();
    form.append("ficheiro", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: form });
    const data = await res.json();
    setUploadPendente(false);
    if (!res.ok) {
      setErro(data.erro ?? "Erro no upload.");
      return;
    }
    setMaterialUrl(data.url);
  }

  function extrairVimeoId(input: string): string {
    const m = input.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : input.trim();
  }

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setPendente(true);
    setErro(null);

    const url = inicial
      ? `/api/admin/conteudos/${inicial.id}`
      : "/api/admin/conteudos";
    const method = inicial ? "PATCH" : "POST";

    const payload: Record<string, unknown> = {
      titulo,
      descricao,
      tipo,
      vimeo_id: tipo === "video" ? extrairVimeoId(vimeoId ?? "") : null,
      material_url: tipo === "material" ? materialUrl : null,
    };
    if (!inicial) payload.estacao_id = estacaoId;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setPendente(false);

    if (!res.ok) {
      setErro(data.erro ?? "Erro.");
      return;
    }
    onOk();
  }

  return (
    <form onSubmit={submeter} className="rounded-xl bg-cream-50 gold-border p-4 space-y-3">
      <p className="text-[10px] tracking-[0.3em] uppercase text-gold-600 mb-1">
        {inicial ? "Editar aula" : "Nova aula"}
      </p>

      <div className="flex gap-2">
        {(["video", "material", "checkbox"] as Tipo[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTipo(t)}
            className={cn(
              "px-3 py-1.5 rounded-md text-xs tracking-[0.1em] uppercase transition-all",
              tipo === t
                ? "bg-gold-foil text-white"
                : "bg-white text-ink-soft border border-gold-200 hover:bg-gold-50",
            )}
          >
            {t === "video" ? "Vídeo" : t === "material" ? "Material" : "Marco"}
          </button>
        ))}
      </div>

      <input
        required
        placeholder="Título da aula"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full rounded-lg border border-gold-200 bg-white px-3 py-2 text-sm font-serif italic focus:outline-none focus:border-gold-400"
      />

      <textarea
        placeholder="Descrição (opcional)"
        value={descricao ?? ""}
        onChange={(e) => setDescricao(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-gold-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
      />

      {tipo === "video" && (
        <input
          placeholder="ID do Vimeo ou link (ex: 76979871 ou vimeo.com/76979871)"
          value={vimeoId ?? ""}
          onChange={(e) => setVimeoId(e.target.value)}
          className="w-full rounded-lg border border-gold-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
        />
      )}

      {tipo === "material" && (
        <div className="space-y-2">
          <input
            placeholder="URL do material (Drive, Notion, etc)"
            value={materialUrl ?? ""}
            onChange={(e) => setMaterialUrl(e.target.value)}
            className="w-full rounded-lg border border-gold-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-gold-400"
          />
          <div className="flex items-center gap-2 text-xs text-ink-faint">
            <span>ou</span>
            <div className="flex-1 h-px bg-gold-200/60" />
          </div>
          <label
            className={cn(
              "flex items-center justify-center gap-2 py-3 rounded-lg border-2 border-dashed border-gold-300 text-gold-700 hover:bg-gold-50 cursor-pointer text-xs tracking-[0.1em] uppercase transition-all",
              uploadPendente && "opacity-50 pointer-events-none",
            )}
          >
            <Upload className="w-3.5 h-3.5" />
            {uploadPendente ? "A carregar…" : "Fazer upload de PDF"}
            <input
              type="file"
              accept="application/pdf,image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadFicheiro(f);
              }}
            />
          </label>
          {materialUrl && (
            <p className="text-xs text-ink-soft truncate">
              Ligado: <span className="text-gold-700">{materialUrl}</span>
            </p>
          )}
        </div>
      )}

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={pendente}
          className="px-4 py-2 rounded-md bg-gold-foil text-white text-xs tracking-[0.1em] uppercase font-medium hover:opacity-90 disabled:opacity-50"
        >
          {pendente ? "A guardar…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-xs tracking-[0.1em] uppercase text-ink-soft hover:bg-cream-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

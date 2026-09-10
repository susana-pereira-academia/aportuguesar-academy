"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Calendar, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Encontro } from "@/lib/data/agenda";

interface Props {
  encontros: Encontro[];
}

export function GerirAgenda({ encontros }: Props) {
  const router = useRouter();
  const [novoAberto, setNovoAberto] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);

  return (
    <div className="space-y-3">
      {novoAberto ? (
        <FormEncontro
          onOk={() => {
            setNovoAberto(false);
            router.refresh();
          }}
          onCancel={() => setNovoAberto(false)}
        />
      ) : (
        <button
          onClick={() => setNovoAberto(true)}
          className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl border-2 border-dashed border-areia-300 text-noite-700 hover:bg-areia-100 hover:border-noite-400 transition-all text-sm tracking-[0.1em] uppercase font-medium"
        >
          <Plus className="w-4 h-4" />
          Novo encontro
        </button>
      )}

      {encontros.length === 0 ? (
        <p className="text-center text-ink-soft py-10">
          Ainda não tens encontros. Cria o primeiro.
        </p>
      ) : (
        encontros.map((e) => (
          <div
            key={e.id}
            className="rounded-2xl bg-white marca-border marca-shadow overflow-hidden"
          >
            <div className="flex items-start gap-4 px-5 py-4">
              <div className="w-11 h-11 rounded-full bg-noite-gradient flex items-center justify-center shrink-0">
                {e.vimeo_id ? (
                  <Video className="w-4 h-4 text-noite-700" />
                ) : (
                  <Calendar className="w-4 h-4 text-noite-700" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-serif italic text-xl font-medium noite-text-rich">{e.titulo}</p>
                <p className="text-xs text-ink-faint mt-1">
                  {formatarDataHora(e.data_inicio)} · {e.duracao_min} min · {e.plataforma}
                </p>
                {e.descricao && (
                  <p className="text-sm text-ink-soft mt-2 line-clamp-2">{e.descricao}</p>
                )}
              </div>
              <button
                onClick={() =>
                  setEditando(editando === e.id ? null : e.id)
                }
                className="p-2 rounded-md text-noite-700 hover:bg-areia-100"
                title="Editar"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={async () => {
                  if (!confirm(`Apagar "${e.titulo}"?`)) return;
                  await fetch(`/api/admin/encontros/${e.id}`, { method: "DELETE" });
                  router.refresh();
                }}
                className="p-2 rounded-md text-red-600 hover:bg-red-50"
                title="Apagar"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {editando === e.id && (
              <div className="border-t border-areia-200/50 px-5 py-4 bg-white/40">
                <FormEncontro
                  inicial={e}
                  onOk={() => {
                    setEditando(null);
                    router.refresh();
                  }}
                  onCancel={() => setEditando(null)}
                />
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

function formatarDataHora(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("pt-PT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function toDateTimeLocal(iso: string) {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function FormEncontro({
  inicial,
  onOk,
  onCancel,
}: {
  inicial?: Encontro;
  onOk: () => void;
  onCancel: () => void;
}) {
  const [titulo, setTitulo] = useState(inicial?.titulo ?? "");
  const [descricao, setDescricao] = useState(inicial?.descricao ?? "");
  const [dataInicio, setDataInicio] = useState(
    inicial ? toDateTimeLocal(inicial.data_inicio) : "",
  );
  const [duracao, setDuracao] = useState(inicial?.duracao_min ?? 60);
  const [plataforma, setPlataforma] = useState(inicial?.plataforma ?? "Zoom");
  const [link, setLink] = useState(inicial?.link ?? "");
  const [vimeoId, setVimeoId] = useState(inicial?.vimeo_id ?? "");
  const [pendente, setPendente] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  function extrairVimeoId(input: string): string {
    const m = input.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    return m ? m[1] : input.trim();
  }

  async function submeter(e: React.FormEvent) {
    e.preventDefault();
    setPendente(true);
    setErro(null);

    const url = inicial ? `/api/admin/encontros/${inicial.id}` : "/api/admin/encontros";
    const method = inicial ? "PATCH" : "POST";

    const payload = {
      titulo,
      descricao,
      data_inicio: new Date(dataInicio).toISOString(),
      duracao_min: Number(duracao),
      plataforma,
      link: link || null,
      vimeo_id: vimeoId ? extrairVimeoId(vimeoId) : null,
    };

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
    <form onSubmit={submeter} className="rounded-xl bg-white marca-border p-4 space-y-3">
      <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-1">
        {inicial ? "Editar encontro" : "Novo encontro"}
      </p>

      <input
        required
        placeholder="Título do encontro"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        className="w-full rounded-lg border border-areia-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-noite-400"
      />

      <textarea
        placeholder="Descrição (opcional)"
        value={descricao ?? ""}
        onChange={(e) => setDescricao(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-areia-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-noite-400"
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-[10px] tracking-[0.2em] uppercase text-dourado-700 mb-1 block">
            Data e hora
          </label>
          <input
            required
            type="datetime-local"
            value={dataInicio}
            onChange={(e) => setDataInicio(e.target.value)}
            className="w-full rounded-lg border border-areia-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-noite-400"
          />
        </div>
        <div>
          <label className="text-[10px] tracking-[0.2em] uppercase text-dourado-700 mb-1 block">
            Duração (min)
          </label>
          <input
            required
            type="number"
            min={5}
            step={5}
            value={duracao}
            onChange={(e) => setDuracao(Number(e.target.value))}
            className="w-full rounded-lg border border-areia-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-noite-400"
          />
        </div>
        <div>
          <label className="text-[10px] tracking-[0.2em] uppercase text-dourado-700 mb-1 block">
            Plataforma
          </label>
          <input
            required
            value={plataforma}
            onChange={(e) => setPlataforma(e.target.value)}
            placeholder="Zoom"
            className="w-full rounded-lg border border-areia-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-noite-400"
          />
        </div>
      </div>

      <input
        placeholder="Link para entrar (Zoom, Meet, morada...)"
        value={link ?? ""}
        onChange={(e) => setLink(e.target.value)}
        className="w-full rounded-lg border border-areia-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-noite-400"
      />

      <div>
        <label className="text-[10px] tracking-[0.2em] uppercase text-dourado-700 mb-1 block">
          Gravação (Vimeo ID ou URL) — opcional, aparece em Gravações
        </label>
        <input
          placeholder="Ex: 76979871"
          value={vimeoId ?? ""}
          onChange={(e) => setVimeoId(e.target.value)}
          className="w-full rounded-lg border border-areia-200 bg-white px-3 py-2 text-sm focus:outline-none focus:border-noite-400"
        />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={pendente}
          className={cn(
            "px-4 py-2 rounded-md bg-noite-foil text-white text-xs tracking-[0.1em] uppercase font-medium hover:opacity-90 disabled:opacity-50",
          )}
        >
          {pendente ? "A guardar…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-md text-xs tracking-[0.1em] uppercase text-ink-soft hover:bg-areia-100"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}

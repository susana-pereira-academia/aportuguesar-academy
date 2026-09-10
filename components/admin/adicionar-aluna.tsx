"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function AdicionarAluna() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [estado, setEstado] = useState<
    { tipo: "idle" } | { tipo: "loading" } | { tipo: "ok"; msg: string } | { tipo: "erro"; msg: string }
  >({ tipo: "idle" });

  async function adicionar(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setEstado({ tipo: "loading" });
    const res = await fetch("/api/admin/criar-aluna", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, nome }),
    });
    const data = await res.json();

    if (!res.ok) {
      setEstado({ tipo: "erro", msg: data.erro ?? "Erro ao adicionar." });
      return;
    }

    setEstado({
      tipo: "ok",
      msg: `Aluna adicionada. Password: ${data.password}`,
    });
    setEmail("");
    setNome("");
    router.refresh();
  }

  return (
    <div className="rounded-2xl bg-areia-50 marca-border marca-shadow p-6 mb-10">
      <div className="mb-4">
        <p className="text-[10px] tracking-[0.3em] uppercase text-dourado-700 mb-2">
          Adicionar aluna
        </p>
        <p className="text-sm text-ink-soft">
          Escreve o email. A password inicial aparece aqui assim que a aluna for criada — ela pode mudar depois de entrar.
        </p>
      </div>

      <form onSubmit={adicionar} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <input
          type="email"
          required
          placeholder="email da aluna"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-areia-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-noite-400"
        />
        <input
          type="text"
          placeholder="nome (opcional)"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="rounded-lg border border-areia-200 bg-white px-4 py-2 text-sm focus:outline-none focus:border-noite-400"
        />
        <Button type="submit" size="sm" disabled={estado.tipo === "loading"}>
          {estado.tipo === "loading" ? "A adicionar…" : "Adicionar"}
        </Button>
      </form>

      {estado.tipo === "ok" && (
        <p className="mt-3 text-sm text-success">{estado.msg}</p>
      )}
      {estado.tipo === "erro" && (
        <p className="mt-3 text-sm text-red-600">{estado.msg}</p>
      )}
    </div>
  );
}

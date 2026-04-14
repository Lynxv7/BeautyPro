"use client";

import { useEffect, useState } from "react";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [name, setName] = useState("");

  async function loadClients() {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
  }

  async function createClient() {
    await fetch("/api/clients", {
      method: "POST",
      body: JSON.stringify({
        name,
        whatsapp: "38999999999",
        salonId: "TEMP", // depois vamos corrigir com auth
      }),
    });

    loadClients();
  }

  useEffect(() => {
    loadClients();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-bold">Clientes</h1>

      <input
        className="border p-2"
        placeholder="Nome"
        onChange={(e) => setName(e.target.value)}
      />

      <button className="bg-black text-white p-2" onClick={createClient}>
        Criar
      </button>

      <ul>
        {clients.map((c: any) => (
          <li key={c.id}>{c.name}</li>
        ))}
      </ul>
    </div>
  );
}

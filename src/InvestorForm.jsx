import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "./api";

export default function InvestorForm({ onCreated }) {
  const [form, setForm] = useState({ name: "", broker: "", amount: "", profile: "moderado" });
  const [saving, setSaving] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await api.post("/investors", {
        name: form.name.trim(),
        broker: form.broker.trim(),
        amount: Number(form.amount || 0),
        profile: form.profile,
      }, token);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      onCreated?.(await res.json());
      setForm({ name: "", broker: "", amount: "", profile: "moderado" });
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      <h2 className="text-xl font-semibold">Cadastro de Investidor</h2>
      <div className="grid gap-2 md:grid-cols-4">
        <input placeholder="Nome" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="p-2 border rounded"/>
        <input placeholder="Corretora" value={form.broker} onChange={e=>setForm({...form,broker:e.target.value})} className="p-2 border rounded"/>
        <input placeholder="Valor investido" type="number" value={form.amount} onChange={e=>setForm({...form,amount:e.target.value})} className="p-2 border rounded"/>
        <select value={form.profile} onChange={e=>setForm({...form,profile:e.target.value})} className="p-2 border rounded">
          <option value="conservador">Conservador</option>
          <option value="moderado">Moderado</option>
          <option value="agressivo">Agressivo</option>
        </select>
      </div>
      <button disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded">{saving? "Salvando..." : "Salvar investidor"}</button>
    </form>
  );
}

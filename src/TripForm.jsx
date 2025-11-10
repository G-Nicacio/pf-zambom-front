import { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "./api";

export default function TripForm({ onCreated }) {
  const [form, setForm] = useState({ destination:"", startDate:"", endDate:"", price:"", notes:"" });
  const [saving, setSaving] = useState(false);
  const { getAccessTokenSilently } = useAuth0();

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    try {
      const token = await getAccessTokenSilently();
      const res = await api.post("/trips", {
        destination: form.destination.trim(),
        startDate: form.startDate,
        endDate: form.endDate,
        price: Number(form.price || 0),
        notes: form.notes ?? "",
      }, token);
      if (!res.ok) throw new Error(`Erro ${res.status}`);
      onCreated?.(await res.json());
      setForm({ destination:"", startDate:"", endDate:"", price:"", notes:"" });
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 mb-6">
      <h2 className="text-xl font-semibold">Cadastro de Viagem</h2>
      <div className="grid gap-2 md:grid-cols-5">
        <input placeholder="Destino" value={form.destination} onChange={e=>setForm({...form,destination:e.target.value})} className="p-2 border rounded"/>
        <input type="date" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} className="p-2 border rounded"/>
        <input type="date" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} className="p-2 border rounded"/>
        <input placeholder="Preço" type="number" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="p-2 border rounded"/>
        <input placeholder="Notas (opcional)" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} className="p-2 border rounded"/>
      </div>
      <button disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded">{saving? "Salvando..." : "Cadastrar viagem"}</button>
    </form>
  );
}

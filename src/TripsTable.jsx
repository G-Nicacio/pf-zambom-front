import { useEffect, useMemo, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { api } from "./api";

function parseJwt(token) {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(atob(payload.replace(/-/g, "+").replace(/_/g, "/")));
  } catch { return {}; }
}

export default function TripsTable() {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [trips, setTrips] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  async function refresh() {
    setLoading(true);
    try {
      const token = await getAccessTokenSilently();
      // checa role admin a partir do access token (mesmo namespace usado no backend)
      const claims = parseJwt(token);
      const roles = claims["https://app/roles"] || claims.roles || [];
      setIsAdmin(Array.isArray(roles) && roles.includes("admin"));

      const res = await api.get("/trips", token);
      const data = await res.json();
      setTrips(Array.isArray(data) ? data : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { if (isAuthenticated) refresh(); }, [isAuthenticated]);

  async function onDelete(id) {
    if (!confirm("Excluir viagem?")) return;
    const token = await getAccessTokenSilently();
    const res = await api.del(`/trips/${id}`, token);
    if (!res.ok) { alert("Falha ao excluir (verifique se você é admin)."); return; }
    setTrips(prev => prev.filter(t => t.id !== id));
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-xl font-semibold">Viagens</h2>
        <button onClick={refresh} className="px-3 py-1 bg-gray-200 rounded">Recarregar</button>
        {isAdmin && <span className="text-xs bg-black text-white px-2 py-1 rounded">admin</span>}
      </div>

      {loading ? "Carregando..." : trips.length === 0 ? (
        <div>Nenhuma viagem cadastrada.</div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Destino</th>
              <th className="border p-2">Início</th>
              <th className="border p-2">Fim</th>
              <th className="border p-2">Preço</th>
              <th className="border p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {trips.map(t => (
              <tr key={t.id}>
                <td className="border p-2">{t.destination}</td>
                <td className="border p-2">{t.startDate}</td>
                <td className="border p-2">{t.endDate}</td>
                <td className="border p-2">{t.price}</td>
                <td className="border p-2 text-center">
                  {isAdmin ? (
                    <button onClick={() => onDelete(t.id)} className="px-2 py-1 bg-red-600 text-white rounded">Excluir</button>
                  ) : (
                    <span className="text-xs text-gray-500">Sem perm.</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

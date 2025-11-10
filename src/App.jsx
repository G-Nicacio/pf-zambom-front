import "./App.css";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import InvestorForm from "./InvestorForm";
import TripForm from "./TripForm";
import TripsTable from "./TripsTable";
import { useState } from "react";

export default function App() {
  const { isAuthenticated, user } = useAuth0();
  const [investors, setInvestors] = useState([]); // opcional: mostrar lista depois

  if (!isAuthenticated) return (
    <div className="min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-4">Prova – Investidores & Viagens</h1>
      <LoginButton />
    </div>
  );

  return (
    <div className="min-h-screen p-6 space-y-6">
      <header className="flex items-center gap-3">
        <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full"/>
        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-sm text-gray-600">{user.email}</div>
        </div>
        <div className="ml-auto"><LogoutButton /></div>
      </header>

      <section className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
        <h1 className="text-2xl font-bold">Investidores — cadastro</h1>
        <InvestorForm onCreated={(i)=>setInvestors(prev=>[i,...prev])} />

        <h1 className="text-2xl font-bold">Viagens — cadastro e listagem</h1>
        <TripForm onCreated={() => { /* opcional: chamar refresh via Events/Context */ }} />
        <TripsTable />
      </section>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";

// Step 1 placeholder: confirms login + database access. The search UI arrives in Step 3.
export default async function Home() {
  const supabase = await createClient();
  const { count, error } = await supabase.from("content").select("id", { count: "exact", head: true });
  const { data: owner } = await supabase.from("app_owner").select("user_id").maybeSingle();

  return (
    <div className="stack">
      <h1>Biblioteca</h1>
      {error && <p className="muted">Erro ao acessar o banco: {error.message}</p>}
      {!owner && !error && (
        <p className="muted">Usuário autenticado, mas não registrado como proprietário (app_owner). Veja o README.</p>
      )}
      {owner && <p className="muted">Conectado. {count ?? 0} conteúdos no banco.</p>}
    </div>
  );
}

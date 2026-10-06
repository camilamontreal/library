import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

async function login(formData: FormData) {
  "use server";
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  redirect(error ? "/login?erro=1" : "/");
}

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ erro?: string }> }) {
  const { erro } = await searchParams;
  return (
    <form action={login} className="card stack" style={{ maxWidth: 360, margin: "4rem auto" }}>
      <h1 style={{ margin: 0, fontSize: "1.25rem" }}>Entrar</h1>
      {erro && <p style={{ color: "var(--accent)", margin: 0 }}>E-mail ou senha incorretos.</p>}
      <input name="email" type="email" placeholder="E-mail" required autoComplete="email" />
      <input name="password" type="password" placeholder="Senha" required autoComplete="current-password" />
      <button className="primary" type="submit">Entrar</button>
    </form>
  );
}

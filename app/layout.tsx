import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  title: "Biblioteca de Conteúdo",
  robots: { index: false, follow: false },
};

const NAV = [
  ["/", "Biblioteca"],
  ["/producao", "Produção"],
  ["/distribuicao", "Distribuição"],
  ["/ideias", "Ideias"],
  ["/inspiracoes", "Inspirações"],
  ["/revisao", "Revisão"],
  ["/exportar", "Exportar"],
] as const;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html lang="pt-BR">
      <body>
        {user && (
          <header className="nav">
            <span className="brand">Cami · Biblioteca</span>
            {NAV.map(([href, label]) => (
              <a key={href} href={href}>{label}</a>
            ))}
            <form action="/logout" method="post">
              <button type="submit">Sair</button>
            </form>
          </header>
        )}
        <main>{children}</main>
      </body>
    </html>
  );
}

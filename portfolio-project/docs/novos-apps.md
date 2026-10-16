# Novos apps e detalhes

Tudo abaixo segue a regra do projeto: **nenhum texto, número ou link dentro de componente**. O conteúdo está em `site/src/content/*.json` (validado por `schema.ts`) e o que ainda é exemplo está marcado `exemplo: true`. `npm run check-content` lista o que falta trocar.

| App | Onde editar | O que é |
|---|---|---|
| **Notas** (livro de visitas) | `guestbook.json` (texto fixo) + Supabase (recados) | Visitantes deixam recados; aparecem na hora |
| **Mensagens** | `messages.json` | Visitante toca numa pergunta e a Cami "responde" em balões, com botões que abrem outros apps |
| **Fotos** | `albums.json` + `public/media/albums/` | Álbuns por viagem, foto em tela cheia (setas e Esc) |
| **Mapas** | `places.json` | Rotas de voo saindo de Montreal; tocar no pino abre álbum e projetos do lugar |
| **Música** | `music.json` | Playlist de viagem; toca aqui se houver `audio`, senão abre `url` |
| **Calendário** | `calendar.json` | Viagens, agenda fechada e janelas disponíveis; botão "Agendar conversa" |
| **Cartão de embarque** | `lib/ticket.ts` (visual) | O visitante digita o nome e baixa/compartilha um cartão (aparece depois de deixar um recado) |

## Detalhes escondidos
- **Busca (⌘K / Ctrl+K, ou o ícone de lupa)**: projetos, marcas, lugares, ferramentas e apps; ignora acento. No celular, botão "Buscar" na tela inicial.
- **Nome da marca na barra de menu**: abre um "Sobre este Mac" com a bio.
- **Relógio**: hora de Montréal, a do visitante e a de São Paulo.
- **Celular**: tocar nos ícones de status (canto superior direito) abre a Central de Controle com idioma e **Ver como Marca/Recrutador(a)**.

## Livro de visitas: ligar o banco (Supabase, grátis)
Sem isto o app funciona em **modo prévia** (aviso amarelo; recados só no aparelho de quem escreveu).

1. Crie uma conta em supabase.com e um projeto novo (pode ser o plano grátis).
2. No projeto: **SQL Editor → New query**, cole o conteúdo de `site/supabase/guestbook.sql` e clique em **Run**.
3. **Settings → API**: copie **Project URL** e a chave **anon / publishable** (nunca a `service_role`).
4. Copie `site/.env.example` para `site/.env.local` e preencha:
   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=...
   ```
5. Rode `npm run dev` para testar. Na publicação (Vercel/Netlify), cadastre as mesmas duas variáveis nas configurações do projeto e publique de novo: elas são embutidas no momento do build.

**Moderação.** Os recados aparecem na hora, sem aprovação. Para tirar um: **Table Editor → guestbook** → marque `hidden = true` na linha (ou apague a linha). Proteções que já existem:
- sem links (no site e no banco), 2 a 280 caracteres, nome até 40;
- 1 recado por minuto por navegador e um freio global de 20 por minuto no banco;
- campo escondido para barrar robôs simples;
- o visitante só consegue ler e inserir; não consegue editar, apagar nem definir `hidden` (permissões por coluna).

Não é à prova de tudo: alguém determinado pode escrever uma ofensa curta antes de você esconder. Se isso virar problema, a mudança é pequena: trocar a política de leitura para `approved = true` e aprovar pelo painel.

## O que ainda é exemplo (revisar)
Rode `npm run check-content`. Em especial: textos das **Mensagens** (tom escrito por mim, revise), **datas do Calendário**, **faixas da Música** e `playlistUrl`, `bookingUrl`, e as **fotos dos álbuns**.

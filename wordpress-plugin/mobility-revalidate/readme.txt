=== Mobility Revalidate (Headless Next.js) ===
Contributors: tec4udigital
Tags: headless, nextjs, isr, revalidate, webhook
Requires at least: 6.0
Tested up to: 6.6
Stable tag: 1.0.0
License: GPLv2 or later

Dispara webhooks de revalidação ISR para o front-end Next.js do Blog Mobility
Brasil sempre que conteúdo é criado, editado ou removido no WordPress.

== Description ==

Plugin standalone (independente de tema) que escuta hooks do WordPress e ACF
e dispara `POST` para a rota `/api/revalidate` do front-end Next.js.

Eventos cobertos:
* Post publicado / atualizado / despublicado / movido para lixeira / restaurado
* Página publicada / atualizada
* Campos ACF salvos
* Categoria criada / editada / excluída
* Exclusão definitiva de post ou página
* Botão manual "Revalidar cache" na lista de posts

Tags enviadas (espelham `lib/wordpress.ts`):
* `posts`
* `post:{slug}`
* `categories`
* `category:{slug}`
* `page:{uri}`

== Instalação ==

1. Compactar a pasta `mobility-revalidate/` em `mobility-revalidate.zip`.
2. WP Admin → Plugins → Adicionar novo → Enviar plugin → selecionar o zip.
3. Ativar.
4. Configurações → Mobility Revalidate:
   - **Endpoint**: `https://<dominio-vercel>/api/revalidate`
   - **Secret**: mesmo valor de `WORDPRESS_REVALIDATE_SECRET` na Vercel
5. Clicar em "Disparar teste" para validar.

== Changelog ==

= 1.0.0 =
* Versão inicial.

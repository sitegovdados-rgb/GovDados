# GovDados

Plataforma de visualização de indicadores e dados de políticas públicas do Estado do Rio de Janeiro (Programa Cidade Integrada).

Stack: **Next.js 15** · **React 19** · **TypeScript** · **Tailwind CSS** · **Directus** (CMS headless).

## Desenvolvimento local

```bash
npm install
cp .env.example .env.local   # edite se precisar
npm run dev
```

Abra http://localhost:3000.

## Variáveis de ambiente

| Nome | Obrigatória | Descrição |
|---|---|---|
| `NEXT_PUBLIC_DIRECTUS_URL` | Não (tem fallback) | URL base da API do Directus |

## Deploy no Vercel

1. Faça push do projeto para um repositório Git (GitHub, GitLab ou Bitbucket).
2. Em https://vercel.com → **Add New Project** → importe o repositório.
3. O Vercel detecta Next.js automaticamente. Não altere os comandos de build.
4. Em **Environment Variables**, adicione `NEXT_PUBLIC_DIRECTUS_URL` se quiser sobrescrever o fallback.
5. Clique em **Deploy**.

## ⚠️ Permissões do Directus

Para que as páginas mostrem dados em produção, as coleções `indicadores`, `programas` e `regioes` precisam estar com **leitura pública** habilitada no Directus:

> Settings → Roles & Permissions → **Public** → marcar `read` nas três coleções.

Se preferir manter o acesso restrito, adicione um token no header de `src/lib/directus.ts`.

## Estrutura

```
src/
├── app/              # Rotas (App Router)
│   ├── page.tsx      # Home
│   ├── painel/       # Painel executivo
│   ├── programas/    # Programas sociais
│   ├── territorios/  # Perfil dos territórios
│   └── dados/        # Dados abertos
├── components/ui/    # Navbar, Footer, KpiCard
└── lib/directus.ts   # Client da API
```

# PresetFolio (Next.js + TypeScript + Tailwind + shadcn-style)

This version upgrades PresetFolio into a React/TypeScript web app with Tailwind and shadcn-style component structure so advanced UI components can be integrated cleanly.

## Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn-style structure (`components/ui`, `lib/utils.ts`)
- framer-motion
- lucide-react

## Local run
```bash
npm install
npm run dev
```

## Render deployment (single Web Service)
`render.yaml` is configured for one service:
- Build: `npm install && npm run build`
- Start: `npm run start`

## Why `/components/ui` matters
shadcn components are designed to be copied into your codebase and imported directly. Keeping reusable building blocks in `/components/ui`:
- preserves predictable import paths,
- keeps design primitives separate from page logic,
- makes future component additions from shadcn consistent.

## If starting from a non-shadcn project
Initialize and align structure with:
```bash
npx shadcn@latest init
```
Then keep components in `/components/ui` and utility helpers in `/lib/utils.ts`.

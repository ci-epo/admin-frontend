# 2026-10-10 — Un seul lockfile (npm)

`pnpm-lock.yaml` supprimé : `package-lock.json` reste le seul lockfile. Raisons : le `Dockerfile` installe avec `npm ci`,
`CLAUDE.md` du workspace donne les commandes `npm`, et deux lockfiles rendent ambigu le choix du gestionnaire par Vercel.
Les deux étaient synchrones avec `package.json` (`npm ci --dry-run` et `pnpm install --frozen-lockfile --lockfile-only`).
`next build` vérifié dans une copie propre (`npm ci` puis `npm run build`, variables `NEXT_PUBLIC_API_BASE_URL` et
`API_INTERNAL_BASE_URL` renseignées) : 13 routes, middleware, build vert. Le `node_modules` du dépôt est vide (dossier
laissé par Docker) : lancer `npm ci` avant tout travail local.

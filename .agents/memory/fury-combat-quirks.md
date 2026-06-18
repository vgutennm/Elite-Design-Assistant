---
name: fury-combat framer-motion typecheck noise
description: Pre-existing typecheck errors in fury-combat that are NOT caused by your edits
---

# fury-combat: pre-existing framer-motion `ease: string` typecheck errors

`pnpm --filter @workspace/fury-combat run typecheck` fails with TS2322 errors
about `ease: string` not being assignable to `Easing` in motion `Variants`
(e.g. in `src/pages/ServiceDetail.tsx`). These are pre-existing and unrelated to
most feature edits.

**Why:** the variant objects type `ease` as a plain string instead of a
framer-motion `Easing` literal/array.

**How to apply:** when typechecking after an edit, confirm any failures are only
these `ease: string` errors before assuming your change broke the build. Only the
absence of *new* error categories matters. Fix the `ease` typing itself only if
asked to clean up the build.

# fury-combat: service data is duplicated in two places

The service list exists twice: `src/data/services.ts` (`allServices`, drives the
nav dropdown, footer, and service detail pages) AND `src/pages/Home.tsx` (a local
`services` array, drives only the homepage services grid).

**Why:** the homepage keeps its own trimmed copy (title/desc/isWorkshop/category)
instead of importing `allServices`. A change made in one file silently won't show
in the other surface.

**How to apply:** any change to a service's category, title, or whether it appears
at all must be made in BOTH files or the homepage and nav/footer will disagree.

# vite.config must not hard-throw on missing PORT/BASE_PATH (silent stale prod)

A vite-based web artifact whose `vite.config.ts` does `throw` when `PORT` (or
`BASE_PATH`) is absent will FAIL the production `vite build` during autoscale
publish, because the deploy build phase does not reliably inject the service
runtime env (`[services.env]` in artifact.toml). The failed build is silent to
the user: the deployment keeps serving the **last successful build**, so code
changes never reach production even though the dev preview is correct and the
user republishes / clears cache / uses private mode.

**Why:** `PORT` is only needed by the dev/preview server, not by a static build.
Requiring it at config-load time turns a build-time env gap into a hard failure.

**How to apply:** keep `PORT` optional in `vite.config.ts` — derive it only for
`server.port`/`preview.port`, never throw when it is missing. Default `BASE_PATH`
to `"/"`. Symptom to recognize: "published but prod still shows old content on
every device incl. private mode" + a `dist/public` whose mtime predates the
edits → check the production build command actually succeeds with NO env set.

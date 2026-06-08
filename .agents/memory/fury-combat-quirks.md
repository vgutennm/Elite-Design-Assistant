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

# FURY COMBAT SYSTEMS — Full Source Snapshot for AI Editing

This file contains the complete current source code of the Fury Combat Systems website. Paste this entire file into ChatGPT / OpenAI and ask for any changes you want.

## How To Use This File

1. Copy the entire contents of this file.
2. Paste it into ChatGPT (GPT-4 or newer recommended; the file is large).
3. At the bottom, type what you want to change. Be specific about which section, page, or service.
4. Ask ChatGPT to return the FULL updated file(s), not just the diff.
5. Paste ChatGPT's response back into Replit Agent and say: "Apply these changes to the corresponding files."

## Project Overview

Fury Combat Systems is a premium marketing website for an elite founder-led private martial arts and tactical training brand in Brooklyn, NY, led by Grandmaster Dr. David Furie (10th Dan, retired Secret Service Operative, world champion fighter).

The site is a single-page home + 8 dedicated service detail pages, all under the shared ServiceDetail template.

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 with @import "tailwindcss" and HSL CSS variables for theming
- shadcn/ui components (already installed in src/components/ui/)
- Framer Motion for animations
- wouter for client-side routing (NOT react-router)
- lucide-react for icons
- Cinzel (serif headings) + Inter (body) from Google Fonts

## Design Rules — DO NOT BREAK THESE

- Dark premium aesthetic: near-black background (HSL 0 0% 3%), deep red primary (HSL 350 89% 45%)
- Cinzel serif headings, Inter body, uppercase tracking-widest labels
- rounded-none on all buttons (sharp corners)
- NO emojis anywhere
- NO fake stats, fake testimonials, fake client counts
- NO em-dashes (use comma, period, or rephrase)
- NO pricing anywhere in the UI
- Founder-led brand: David Furie
- Contact: tel:9173402911 / david.furie@gmail.com / 24 Cobek Ct Brooklyn NY 11223

## Routes

- `/` — Home (single page with hero, services, the system, the legend, gallery, contact, FAQ)
- `/:slug` — Service detail pages, 8 of them, all using the shared ServiceDetail template

## Services (8 total)

private-instruction, advanced-tactical-instruction, womens-private-safety-training, tactical-conditioning, young-adult-readiness-training, executive-readiness, family-protection-session, private-workshops

## Important Conventions

- Image assets: loaded via Vite import.meta.glob with timestamp-tolerant prefix matching. Files live in attached_assets/ and use names like furycombat-website-photos-001_TIMESTAMP.jpg.
- All service data lives in src/data/services.ts (ServiceData interface). Both Home and ServiceDetail consume the same data.
- Hash anchors from service pages back to home sections use window.location.href, not wouter navigation.
- Mobile breakpoint: lg (1024px). Below that, hamburger menu with full-screen overlay.

---

# SOURCE FILES


## `replit.md`

```md
# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Contains the Fury Combat Systems website — a premium marketing site with 8 dedicated service pages for an elite martial arts and tactical training brand in Brooklyn, NY.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **API framework**: Express 5 (shared backend, not actively used by fury-combat)
- **Database**: PostgreSQL + Drizzle ORM (not used by fury-combat)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Structure

```text
artifacts-monorepo/
├── artifacts/              # Deployable applications
│   └── api-server/         # Express API server
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── scripts/                # Utility scripts (single workspace package)
│   └── src/                # Individual .ts scripts, run via `pnpm --filter @workspace/scripts run <script>`
├── pnpm-workspace.yaml     # pnpm workspace (artifacts/*, lib/*, lib/integrations/*, scripts)
├── tsconfig.base.json      # Shared TS options (composite, bundler resolution, es2022)
├── tsconfig.json           # Root TS project references
└── package.json            # Root package with hoisted devDeps
```

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references. This means:

- **Always typecheck from the root** — run `pnpm run typecheck` (which runs `tsc --build --emitDeclarationOnly`). This builds the full dependency graph so that cross-package imports resolve correctly. Running `tsc` inside a single package will fail if its dependencies haven't been built yet.
- **`emitDeclarationOnly`** — we only emit `.d.ts` files during typecheck; actual JS bundling is handled by esbuild/tsx/vite...etc, not `tsc`.
- **Project references** — when package A depends on package B, A's `tsconfig.json` must list B in its `references` array. `tsc --build` uses this to determine build order and skip up-to-date packages.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages that define it
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references

## Packages

### `artifacts/api-server` (`@workspace/api-server`)

Express 5 API server. Routes live in `src/routes/` and use `@workspace/api-zod` for request and response validation and `@workspace/db` for persistence.

- Entry: `src/index.ts` — reads `PORT`, starts Express
- App setup: `src/app.ts` — mounts CORS, JSON/urlencoded parsing, routes at `/api`
- Routes: `src/routes/index.ts` mounts sub-routers; `src/routes/health.ts` exposes `GET /health` (full path: `/api/health`)
- Depends on: `@workspace/db`, `@workspace/api-zod`
- `pnpm --filter @workspace/api-server run dev` — run the dev server
- `pnpm --filter @workspace/api-server run build` — production esbuild bundle (`dist/index.cjs`)
- Build bundles an allowlist of deps (express, cors, pg, drizzle-orm, zod, etc.) and externalizes the rest

### `lib/db` (`@workspace/db`)

Database layer using Drizzle ORM with PostgreSQL. Exports a Drizzle client instance and schema models.

- `src/index.ts` — creates a `Pool` + Drizzle instance, exports schema
- `src/schema/index.ts` — barrel re-export of all models
- `src/schema/<modelname>.ts` — table definitions with `drizzle-zod` insert schemas (no models definitions exist right now)
- `drizzle.config.ts` — Drizzle Kit config (requires `DATABASE_URL`, automatically provided by Replit)
- Exports: `.` (pool, db, schema), `./schema` (schema only)

Production migrations are handled by Replit when publishing. In development, we just use `pnpm --filter @workspace/db run push`, and we fallback to `pnpm --filter @workspace/db run push-force`.

### `lib/api-spec` (`@workspace/api-spec`)

Owns the OpenAPI 3.1 spec (`openapi.yaml`) and the Orval config (`orval.config.ts`). Running codegen produces output into two sibling packages:

1. `lib/api-client-react/src/generated/` — React Query hooks + fetch client
2. `lib/api-zod/src/generated/` — Zod schemas

Run codegen: `pnpm --filter @workspace/api-spec run codegen`

### `lib/api-zod` (`@workspace/api-zod`)

Generated Zod schemas from the OpenAPI spec (e.g. `HealthCheckResponse`). Used by `api-server` for response validation.

### `lib/api-client-react` (`@workspace/api-client-react`)

Generated React Query hooks and fetch client from the OpenAPI spec (e.g. `useHealthCheck`, `healthCheck`).

### `artifacts/fury-combat` (`@workspace/fury-combat`)

Premium Fury Combat Systems website. React + Vite + Tailwind + Framer Motion + wouter (client-side routing).

- **Pages**: Home (single-page with all sections) + 8 service detail pages
- **Routing**: wouter with `/:slug` pattern; SPA rewrite rule in artifact.toml (`/* → /index.html`)
- **Service pages**: Private Instruction, Advanced Tactical Instruction, Women's Private Safety Training, Tactical Conditioning, Young Adult Readiness Training, Executive Readiness, Family Protection Session, Private Workshops
- **Shared components**: `SiteHeader` (sticky nav with Services dropdown), `SiteFooter` (4-column footer with services column)
- **Service data**: `src/data/services.ts` — all service content, routes, FAQs, related services
- **Service detail template**: `src/pages/ServiceDetail.tsx` — hero, overview, who it's for, what you get, training focus, likely outcomes, why choose, FAQ, related services, CTA
- **Assets**: 39 photos in `attached_assets/` loaded via `import.meta.glob` with timestamp-based filename matching
- **SEO**: LocalBusiness + FAQ JSON-LD schemas, unique meta title/description per service page
- **Design**: Cinzel serif headings, Inter body, dark bg (#09090b), red primary accent (#dc2626), rounded-none buttons, uppercase tracking-widest labels
- **Contact**: tel:9173402911, mailto:david.furie@gmail.com, 24 Cobek Ct Brooklyn NY 11223

### `scripts` (`@workspace/scripts`)

Utility scripts package. Each script is a `.ts` file in `src/` with a corresponding npm script in `package.json`. Run scripts via `pnpm --filter @workspace/scripts run <script>`. Scripts can import any workspace package (e.g., `@workspace/db`) by adding it as a dependency in `scripts/package.json`.

```

## `artifacts/fury-combat/index.html`

```html
<!DOCTYPE html>
<html lang="en" class="dark scroll-smooth">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <title>Fury Combat Systems | Private Martial Arts & Tactical Training in Brooklyn</title>
    <meta name="description" content="Train privately with Grandmaster Dr. David Furie in personal readiness, tactical awareness, practical self-protection, and high-level instruction designed for real-world application." />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "SportsActivityLocation",
        "name": "Fury Combat Systems",
        "image": "https://furycombat.com/hero.jpg",
        "@id": "",
        "url": "https://furycombat.com",
        "telephone": "9173402911",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "24 Cobek Ct",
          "addressLocality": "Brooklyn",
          "addressRegion": "NY",
          "postalCode": "11223",
          "addressCountry": "US"
        },
        "founder": {
          "@type": "Person",
          "name": "Dr. David Furie"
        },
        "sameAs": [
          "https://www.facebook.com/furycombatbrooklyn/",
          "https://www.instagram.com/david.furie/",
          "https://www.linkedin.com/in/david-furie-17091548/",
          "https://www.youtube.com/channel/UC1bJFJVjk-0AqvfVAj18IOg"
        ]
      }
    </script>
    <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [{
          "@type": "Question",
          "name": "What is Fury Combat Systems?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fury Combat Systems is a Brooklyn-based private martial arts and tactical training brand built around the Fury System developed by Grandmaster Dr. David Furie."
          }
        }, {
          "@type": "Question",
          "name": "Who is David Furie?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "David Furie is a 10th degree black belt / dan, retired Secret Service Operative, former Special Forces member, world champion fighter, and International Combat Martial Arts Master."
          }
        }, {
          "@type": "Question",
          "name": "What kind of training does Fury Combat offer?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fury Combat focuses on private instruction in practical self-protection, hand-to-hand skill, tactical awareness, conditioning, and readiness for real-world situations."
          }
        }, {
          "@type": "Question",
          "name": "Are classes group classes or private lessons?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "At this time, Fury Combat offers private lessons and private workshops only."
          }
        }, {
          "@type": "Question",
          "name": "Where is Fury Combat Systems located?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Fury Combat Systems is based in Brooklyn, New York, at 24 Cobek Ct, Brooklyn, NY 11223."
          }
        }, {
          "@type": "Question",
          "name": "How do I contact David Furie?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can contact David directly by phone at (917) 340-2911 or by email at david.furie@gmail.com."
          }
        }, {
          "@type": "Question",
          "name": "Who is private instruction for?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Private instruction is for serious clients seeking personalized, founder-led training in awareness, readiness, protective skill, and real-world application."
          }
        }, {
          "@type": "Question",
          "name": "Is the Fury System only for sport fighting?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The Fury System is positioned around practical self-protection and readiness for real-life situations, with self-protection first and combat second."
          }
        }]
      }
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## `artifacts/fury-combat/vite.config.ts`

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

const rawPort = process.env.PORT;

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const basePath = process.env.BASE_PATH;

if (!basePath) {
  throw new Error(
    "BASE_PATH environment variable is required but was not provided.",
  );
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: false,
      deny: ["**/.*"],
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});

```

## `artifacts/fury-combat/package.json`

```json
{
  "name": "@workspace/fury-combat",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --config vite.config.ts --host 0.0.0.0",
    "build": "vite build --config vite.config.ts",
    "serve": "vite preview --config vite.config.ts --host 0.0.0.0",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "devDependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@radix-ui/react-accordion": "^1.2.4",
    "@radix-ui/react-alert-dialog": "^1.1.7",
    "@radix-ui/react-aspect-ratio": "^1.1.3",
    "@radix-ui/react-avatar": "^1.1.4",
    "@radix-ui/react-checkbox": "^1.1.5",
    "@radix-ui/react-collapsible": "^1.1.4",
    "@radix-ui/react-context-menu": "^2.2.7",
    "@radix-ui/react-dialog": "^1.1.7",
    "@radix-ui/react-dropdown-menu": "^2.1.7",
    "@radix-ui/react-hover-card": "^1.1.7",
    "@radix-ui/react-label": "^2.1.3",
    "@radix-ui/react-menubar": "^1.1.7",
    "@radix-ui/react-navigation-menu": "^1.2.6",
    "@radix-ui/react-popover": "^1.1.7",
    "@radix-ui/react-progress": "^1.1.3",
    "@radix-ui/react-radio-group": "^1.2.4",
    "@radix-ui/react-scroll-area": "^1.2.4",
    "@radix-ui/react-select": "^2.1.7",
    "@radix-ui/react-separator": "^1.1.3",
    "@radix-ui/react-slider": "^1.2.4",
    "@radix-ui/react-slot": "^1.2.0",
    "@radix-ui/react-switch": "^1.1.4",
    "@radix-ui/react-tabs": "^1.1.4",
    "@radix-ui/react-toast": "^1.2.7",
    "@radix-ui/react-toggle": "^1.1.3",
    "@radix-ui/react-toggle-group": "^1.1.3",
    "@radix-ui/react-tooltip": "^1.2.0",
    "@replit/vite-plugin-cartographer": "catalog:",
    "@replit/vite-plugin-dev-banner": "catalog:",
    "@replit/vite-plugin-runtime-error-modal": "catalog:",
    "@tailwindcss/typography": "^0.5.15",
    "@tailwindcss/vite": "catalog:",
    "@tanstack/react-query": "catalog:",
    "@types/node": "catalog:",
    "@types/react": "catalog:",
    "@types/react-dom": "catalog:",
    "@vitejs/plugin-react": "catalog:",
    "@workspace/api-client-react": "workspace:*",
    "class-variance-authority": "catalog:",
    "clsx": "catalog:",
    "cmdk": "^1.1.1",
    "date-fns": "^3.6.0",
    "embla-carousel-react": "^8.6.0",
    "framer-motion": "catalog:",
    "input-otp": "^1.4.2",
    "lucide-react": "catalog:",
    "next-themes": "^0.4.6",
    "react": "catalog:",
    "react-day-picker": "^9.11.1",
    "react-dom": "catalog:",
    "react-hook-form": "^7.55.0",
    "react-icons": "^5.4.0",
    "react-resizable-panels": "^2.1.7",
    "recharts": "^2.15.2",
    "sonner": "^2.0.7",
    "tailwind-merge": "catalog:",
    "tailwindcss": "catalog:",
    "tw-animate-css": "^1.4.0",
    "vaul": "^1.1.2",
    "vite": "catalog:",
    "wouter": "^3.3.5",
    "zod": "catalog:"
  }
}

```

## `artifacts/fury-combat/.replit-artifact/artifact.toml`

```toml
kind = "web"
previewPath = "/"
title = "Fury Combat Systems"
version = "1.0.0"
id = "artifacts/fury-combat"
router = "path"

[[integratedSkills]]
name = "react-vite"
version = "1.0.0"

[[services]]
name = "web"
paths = [ "/" ]
localPort = 26015

[services.development]
run = "pnpm --filter @workspace/fury-combat run dev"

[services.production]
build = [ "pnpm", "--filter", "@workspace/fury-combat", "run", "build" ]
publicDir = "artifacts/fury-combat/dist/public"
serve = "static"

[[services.production.rewrites]]
from = "/*"
to = "/index.html"

[services.env]
PORT = "26015"
BASE_PATH = "/"

```

## `artifacts/fury-combat/src/main.tsx`

```tsx
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(<App />);

```

## `artifacts/fury-combat/src/App.tsx`

```tsx
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ServiceDetail from "@/pages/ServiceDetail";
import ScrollToTop from "@/components/ScrollToTop";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/:slug" component={ServiceDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <ScrollToTop />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

```

## `artifacts/fury-combat/src/index.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@plugin "@tailwindcss/typography";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --color-background: hsl(var(--background));
  --color-foreground: hsl(var(--foreground));
  --color-border: hsl(var(--border));
  --color-input: hsl(var(--input));
  --color-ring: hsl(var(--ring));

  --color-card: hsl(var(--card));
  --color-card-foreground: hsl(var(--card-foreground));
  --color-card-border: hsl(var(--card-border));

  --color-popover: hsl(var(--popover));
  --color-popover-foreground: hsl(var(--popover-foreground));
  --color-popover-border: hsl(var(--popover-border));

  --color-primary: hsl(var(--primary));
  --color-primary-foreground: hsl(var(--primary-foreground));
  --color-primary-border: var(--primary-border);

  --color-secondary: hsl(var(--secondary));
  --color-secondary-foreground: hsl(var(--secondary-foreground));
  --color-secondary-border: var(--secondary-border);

  --color-muted: hsl(var(--muted));
  --color-muted-foreground: hsl(var(--muted-foreground));
  --color-muted-border: var(--muted-border);

  --color-accent: hsl(var(--accent));
  --color-accent-foreground: hsl(var(--accent-foreground));
  --color-accent-border: var(--accent-border);

  --color-destructive: hsl(var(--destructive));
  --color-destructive-foreground: hsl(var(--destructive-foreground));
  --color-destructive-border: var(--destructive-border);

  --font-sans: var(--app-font-sans);
  --font-serif: var(--app-font-serif);
  --font-mono: var(--app-font-mono);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

/* Base Theme - Forced to Dark / Premium Aesthetic */
:root, .dark {
  --button-outline: rgba(255,255,255, .10);
  --badge-outline: rgba(255,255,255, .05);

  --opaque-button-border-intensity: 9;

  --elevate-1: rgba(255,255,255, .04);
  --elevate-2: rgba(255,255,255, .09);

  /* Deep black / charcoal */
  --background: 0 0% 3%;
  --foreground: 0 0% 98%;

  --border: 0 0% 12%;
  --input: 0 0% 12%;
  
  /* Bold Red */
  --ring: 350 89% 45%;

  --card: 0 0% 6%;
  --card-foreground: 0 0% 98%;
  --card-border: 0 0% 12%;

  --popover: 0 0% 5%;
  --popover-foreground: 0 0% 98%;
  --popover-border: 0 0% 12%;

  --primary: 350 89% 45%;
  --primary-foreground: 0 0% 100%;

  --secondary: 0 0% 12%;
  --secondary-foreground: 0 0% 98%;

  --muted: 0 0% 15%;
  --muted-foreground: 0 0% 65%;

  --accent: 0 0% 15%;
  --accent-foreground: 0 0% 98%;

  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;

  --app-font-sans: 'Inter', sans-serif;
  --app-font-serif: 'Cinzel', serif;
  --app-font-mono: Menlo, monospace;
  
  --radius: 0.25rem;

  --sidebar: var(--background);
  --sidebar-foreground: var(--foreground);
  --sidebar-border: var(--border);
  --sidebar-primary: var(--primary);
  --sidebar-primary-foreground: var(--primary-foreground);
  --sidebar-accent: var(--accent);
  --sidebar-accent-foreground: var(--accent-foreground);
  --sidebar-ring: var(--ring);

  --chart-1: var(--primary);
  --chart-2: var(--secondary);
  --chart-3: var(--muted);
  --chart-4: var(--accent);
  --chart-5: var(--border);

  /* Computed Borders */
  --primary-border: hsl(from hsl(var(--primary)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);
  --secondary-border: hsl(from hsl(var(--secondary)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);
  --muted-border: hsl(from hsl(var(--muted)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);
  --accent-border: hsl(from hsl(var(--accent)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);
  --destructive-border: hsl(from hsl(var(--destructive)) h s calc(l + var(--opaque-button-border-intensity)) / alpha);
}

@layer base {
  * {
    @apply border-border;
  }

  body {
    @apply font-sans antialiased bg-background text-foreground selection:bg-primary/30;
  }
  
  h1, h2, h3, h4, h5, h6 {
    @apply font-serif tracking-tight;
  }
}

/* Image overlay texture */
.bg-noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.03;
  pointer-events: none;
}

html {
  scroll-behavior: smooth;
}

```

## `artifacts/fury-combat/src/data/services.ts`

```ts
export interface ServiceVideo {
  title: string;
  embedUrl: string;
  description?: string;
}

export type ServiceCategory = 'elite' | 'sport';

export interface CategoryMeta {
  id: ServiceCategory;
  label: string;
  shortLabel: string;
  tagline: string;
  description: string;
}

export const categories: Record<ServiceCategory, CategoryMeta> = {
  elite: {
    id: 'elite',
    label: 'Elite Private Training',
    shortLabel: 'Elite Private Training',
    tagline: 'Private Self Defense, Personal Protection & Tactical Training',
    description: 'Discreet, founder-led private instruction for executives, professionals, families, and serious individuals who want elite-level personal protection, situational readiness, and real combat skill, taught one-on-one by Grandmaster Dr. David Furie.',
  },
  sport: {
    id: 'sport',
    label: 'Martial Arts & Combat Sports',
    shortLabel: 'Martial Arts & Combat Sports',
    tagline: 'Competitive Martial Arts & Sport Combat Training',
    description: 'Private competitive martial arts instruction in Brooklyn for adults and young athletes who want the sport side of the system, including MMA, Jujitsu, Kickboxing, Ninjutsu, Self Defense, and Weapons and Tactics.',
  },
};

export const categoryOrder: ServiceCategory[] = ['elite', 'sport'];

export interface ServiceData {
  title: string;
  route: string;
  price: string;
  category: ServiceCategory;
  metaTitle: string;
  metaDescription: string;
  subheadline: string;
  overview: string;
  whoFor: string[];
  whatYouGet: string[];
  trainingFocus: string[];
  likelyOutcomes: string[];
  whyChoose: string;
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
  heroImage?: string;
  videos?: ServiceVideo[];
}

export const serviceRoutes: Record<string, string> = {
  "Private Instruction": "/private-instruction",
  "Advanced Tactical Instruction": "/advanced-tactical-instruction",
  "Women's Private Safety Training": "/womens-private-safety-training",
  "Tactical Conditioning": "/tactical-conditioning",
  "Young Adult Readiness Training": "/young-adult-readiness-training",
  "Executive Readiness": "/executive-readiness",
  "Family Protection Session": "/family-protection-session",
  "Private Workshops": "/private-workshops",
  "Self Defense": "/self-defense-in-brooklyn",
  "Jujitsu": "/jujitsu-in-brooklyn",
  "Ninjutsu": "/ninjutsu-in-brooklyn",
  "Kickboxing": "/kickboxing-in-brooklyn",
  "Mixed Martial Arts": "/mixed-martial-arts-in-brooklyn",
  "Weapons and Tactics": "/weapons-and-tactics-in-brooklyn",
};

export const allServices: ServiceData[] = [
  {
    title: "Private Instruction",
    route: "/private-instruction",
    price: "$250 / session",
    category: 'elite',
    metaTitle: "Private Instruction | Fury Combat Systems",
    metaDescription: "Private instruction with Grandmaster Dr. David Furie in Brooklyn. One-on-one training tailored to your goals, experience, and real-world readiness.",
    subheadline: "One-on-one training tailored to your goals, experience, and preferred areas of focus.",
    overview: "Private Instruction is designed for clients who want direct access to high-level founder-led training without the distractions of a group class. Sessions are tailored around the client's background, goals, comfort level, and priorities, with a focus on practical skill, personal readiness, and real-world application.",
    whoFor: [
      "Serious adults seeking personalized training",
      "Professionals looking for private, high-level instruction",
      "Beginners who want to learn in a private setting",
      "Returning martial artists looking to refine their skills",
      "Clients who value discretion and individual attention",
      "Individuals who want training built around their specific goals",
    ],
    whatYouGet: [
      "One-on-one instruction with Grandmaster Dr. David Furie",
      "Customized session focus based on your goals",
      "Direct feedback and correction throughout the session",
      "Practical skill development for real-world application",
      "A private training experience shaped around your needs",
    ],
    trainingFocus: [
      "Movement and positioning",
      "Striking techniques",
      "Grappling fundamentals",
      "Defensive positioning",
      "Situational awareness",
      "Tactical response",
      "Pressure-point application",
      "Controlled performance under stress",
    ],
    likelyOutcomes: [
      "Better confidence under pressure",
      "More awareness and control in everyday situations",
      "Improved movement, positioning, and reflexes",
      "Stronger personal readiness and self-command",
      "A clearer sense of what works for you in real life",
    ],
    whyChoose: "This is not generic class-based training. It is direct, personalized, founder-led instruction for people who want a more serious and practical learning experience.",
    faqs: [
      { q: "Do I need prior experience?", a: "No. Sessions are tailored to your background and comfort level, whether you are a complete beginner or an experienced practitioner." },
      { q: "Is this suitable for beginners?", a: "Absolutely. Private Instruction is one of the best ways to learn because every session is shaped around your specific needs and pace." },
      { q: "How are sessions customized?", a: "David assesses your goals, background, and areas of interest at the start and adjusts the focus, intensity, and content accordingly." },
      { q: "Is this offered privately only?", a: "Yes. All Fury Combat instruction is private. There are no group classes." },
      { q: "Can this focus on a specific area of concern?", a: "Yes. Sessions can be tailored around a specific skill, scenario, or area of readiness you want to develop." },
    ],
    relatedSlugs: ["/advanced-tactical-instruction", "/executive-readiness", "/tactical-conditioning"],
    heroImage: "furycombat-website-photos-017.jpg",
  },
  {
    title: "Advanced Tactical Instruction",
    route: "/advanced-tactical-instruction",
    price: "$500 / session",
    category: 'elite',
    metaTitle: "Advanced Tactical Instruction | Fury Combat Systems",
    metaDescription: "Advanced Tactical Instruction with David Furie for serious clients seeking higher-level readiness, awareness, and strategic response training.",
    subheadline: "An elevated private offering for serious individuals seeking instruction in readiness, tactical thinking, and strategic response.",
    overview: "Advanced Tactical Instruction is built for clients who want a deeper and more sophisticated level of private training. It is designed around readiness, awareness under pressure, protective movement, strategic thinking, and practical response in more demanding situations.",
    whoFor: [
      "Experienced trainees seeking elevated instruction",
      "Serious private clients with specific readiness goals",
      "Executives and high-profile individuals",
      "Security-minded professionals",
      "Individuals who want a higher level of preparedness",
    ],
    whatYouGet: [
      "Advanced private instruction with founder-level coaching",
      "Higher-level correction and strategic feedback",
      "Scenario-oriented training emphasis",
      "More strategic and readiness-focused development",
      "Personalized sessions shaped around your concerns and goals",
    ],
    trainingFocus: [
      "Readiness under pressure",
      "Tactical thinking and decision-making",
      "Awareness under pressure",
      "Protective movement",
      "Weapons familiarity",
      "Reconnaissance concepts",
      "Strategic response",
    ],
    likelyOutcomes: [
      "Stronger composure in uncertain situations",
      "Better decision-making under pressure",
      "Improved awareness and readiness",
      "Deeper tactical understanding",
      "More confidence in complex environments",
    ],
    whyChoose: "This offering is for clients who know ordinary training is not enough for what they want. It is more refined, more strategic, and more serious than standard instruction.",
    faqs: [
      { q: "Is this only for military or law enforcement?", a: "No. This training is available to serious civilian clients who want a higher standard of readiness and tactical awareness." },
      { q: "Can civilians do this training?", a: "Yes. Many clients are professionals, executives, or individuals who simply want more advanced and strategic private instruction." },
      { q: "Do I need prior experience?", a: "Some prior training or a strong fitness base is helpful, but David will assess your level and adjust the session accordingly." },
      { q: "How is this different from Private Instruction?", a: "Advanced Tactical Instruction is more strategic, more readiness-focused, and designed for clients seeking a deeper level of training beyond standard private sessions." },
      { q: "Can the focus be customized?", a: "Yes. Every session is tailored to the client's goals, concerns, and experience level." },
    ],
    relatedSlugs: ["/private-instruction", "/executive-readiness", "/private-workshops"],
    heroImage: "furycombat-website-photos-019.jpg",
  },
  {
    title: "Women's Private Safety Training",
    route: "/womens-private-safety-training",
    price: "$300 / session",
    category: 'elite',
    metaTitle: "Women's Private Safety Training | Fury Combat Systems",
    metaDescription: "Private safety training for women in Brooklyn focused on awareness, confidence, prevention, de-escalation, escape options, and real-world response.",
    subheadline: "Private instruction designed to help women strengthen awareness, confidence, prevention skills, and decisive real-world response.",
    overview: "Women's Private Safety Training is designed to help women feel more aware, more prepared, and more confident in everyday situations. The focus is not fear. The focus is practical skill, better decisions, and stronger personal presence under pressure.",
    whoFor: [
      "Women seeking private, personalized training",
      "Professionals who commute or travel regularly",
      "Women living or working in the city",
      "Mothers and daughters seeking shared training",
      "Students and young professionals",
    ],
    whatYouGet: [
      "Private one-on-one or small private session instruction",
      "Personalized attention and pacing",
      "Practical prevention and awareness coaching",
      "Training tailored to your comfort level and concerns",
      "A discreet and supportive learning environment",
    ],
    trainingFocus: [
      "Awareness and environmental reading",
      "Confidence and personal presence",
      "Prevention skills and early recognition",
      "De-escalation techniques",
      "Escape options and decisive action",
      "Boundary setting",
      "Voice and presence under pressure",
    ],
    likelyOutcomes: [
      "More confidence moving through public spaces",
      "Stronger awareness habits in everyday life",
      "Better boundary-setting ability",
      "Improved emotional control under stress",
      "Greater readiness to act earlier and more decisively",
    ],
    whyChoose: "This is practical women's safety training in a private setting, not a generic seminar or fear-based class. It is personalized, direct, and built around real-world application.",
    faqs: [
      { q: "Is this beginner-friendly?", a: "Yes. This training is designed to meet you where you are, regardless of prior experience." },
      { q: "Can this be tailored to a specific concern?", a: "Absolutely. Sessions can focus on commuting safety, travel, workplace awareness, or any personal concern." },
      { q: "Is it private only?", a: "Yes. All sessions are private, though small groups (such as mothers and daughters) can be arranged." },
      { q: "Is this fitness-based or practical training?", a: "The focus is practical awareness and safety skill, not fitness. Physical conditioning may be incorporated when relevant." },
      { q: "Can mothers and daughters train together?", a: "Yes. Private sessions can include family members when appropriate." },
    ],
    relatedSlugs: ["/young-adult-readiness-training", "/family-protection-session", "/private-instruction"],
    heroImage: "furycombat-website-photos-013.jpg",
  },
  {
    title: "Tactical Conditioning",
    route: "/tactical-conditioning",
    price: "$150 / session",
    category: 'elite',
    metaTitle: "Tactical Conditioning | Fury Combat Systems",
    metaDescription: "Tactical Conditioning with David Furie combines conditioning, reaction, coordination, and practical defensive drills in a private training format.",
    subheadline: "A private training experience that combines conditioning, coordination, movement, reaction, and practical defensive drills.",
    overview: "Tactical Conditioning is for clients who want to improve the physical side of readiness while staying connected to practical movement and defensive application. It blends conditioning with reaction, control, and purposeful training.",
    whoFor: [
      "Adults who want practical, purposeful conditioning",
      "Clients building physical readiness alongside tactical skill",
      "Professionals who want focused, efficient training",
      "Individuals seeking a lower barrier entry into private instruction",
      "People looking to sharpen movement and coordination",
    ],
    whatYouGet: [
      "Private guided training with David Furie",
      "Conditioning with real-world relevance",
      "Movement and reaction drills",
      "Practical defensive applications built into the work",
      "Training scaled to your level and pace",
    ],
    trainingFocus: [
      "Conditioning and endurance",
      "Coordination and body control",
      "Movement and footwork",
      "Reaction time and reflexes",
      "Practical defensive drills",
      "Balance and recovery under pressure",
    ],
    likelyOutcomes: [
      "Improved physical readiness and stamina",
      "Sharper reactions and quicker response time",
      "Better coordination and body control",
      "Stronger endurance and movement efficiency",
      "More confidence in your physical capabilities",
    ],
    whyChoose: "This is more purposeful than generic fitness training because it connects physical development to practical readiness and controlled application.",
    faqs: [
      { q: "Is this more fitness or self-defense?", a: "It bridges both. The conditioning work is purposeful and connected to practical defensive movement and readiness." },
      { q: "Is it beginner-friendly?", a: "Yes. Training is scaled to your fitness level and experience." },
      { q: "Can this be combined with Private Instruction?", a: "Yes. Many clients complement their tactical conditioning with private instruction sessions." },
      { q: "Is it appropriate for older adults?", a: "Yes. Sessions are tailored to your physical condition and adjusted accordingly." },
      { q: "How intense is a session?", a: "Intensity is scaled to your level. David will assess your baseline and adjust throughout the session." },
    ],
    relatedSlugs: ["/private-instruction", "/young-adult-readiness-training", "/family-protection-session"],
    heroImage: "furycombat-website-photos-021.jpg",
  },
  {
    title: "Young Adult Readiness Training",
    route: "/young-adult-readiness-training",
    price: "$225 / session",
    category: 'elite',
    metaTitle: "Young Adult Readiness Training | Fury Combat Systems",
    metaDescription: "Young Adult Readiness Training with David Furie for commuting, college, travel, city life, confidence, and practical real-world readiness.",
    subheadline: "Private instruction for young adults preparing for college, commuting, travel, city life, or greater independence.",
    overview: "Young Adult Readiness Training is designed to help young adults become more aware, more confident, and better prepared for the realities of independence. It is especially relevant for city life, commuting, travel, and transitional life stages.",
    whoFor: [
      "High school seniors preparing for the next chapter",
      "College students navigating campus and city life",
      "Young adults entering the workforce",
      "Commuters seeking stronger awareness habits",
      "Parents seeking private training for their children",
    ],
    whatYouGet: [
      "Private training tailored to the individual",
      "Real-world readiness coaching",
      "Awareness and decision-making support",
      "Practical skills for public-space and day-to-day situations",
      "A serious but age-appropriate learning environment",
    ],
    trainingFocus: [
      "Commuting awareness and city safety",
      "Travel readiness",
      "Confidence and personal presence",
      "Verbal boundaries and de-escalation",
      "Practical response habits",
      "Situational awareness in public spaces",
    ],
    likelyOutcomes: [
      "Stronger confidence in unfamiliar environments",
      "Better everyday awareness and observation habits",
      "Improved decision-making in real-time situations",
      "Greater readiness for independence and self-reliance",
      "More peace of mind for both the student and family",
    ],
    whyChoose: "This helps bridge the gap between dependence and independence with practical private instruction that is serious, modern, and relevant to real life.",
    faqs: [
      { q: "Is this appropriate for teens or only college-age students?", a: "This training is appropriate for older teens through young adulthood, typically ages 16 and up." },
      { q: "Can parents be involved?", a: "Yes. Parents are welcome to discuss goals and concerns, and can observe or participate if appropriate." },
      { q: "Is it private only?", a: "Yes. All sessions are private and tailored to the individual." },
      { q: "Can this focus on commuting or city life?", a: "Absolutely. Sessions can be tailored to the specific situations and environments the young adult will encounter." },
      { q: "Is prior experience required?", a: "No. This training is designed to meet the student where they are." },
    ],
    relatedSlugs: ["/womens-private-safety-training", "/family-protection-session", "/private-instruction"],
    heroImage: "furycombat-website-photos-008.jpg",
  },
  {
    title: "Executive Readiness",
    route: "/executive-readiness",
    price: "$400 / session",
    category: 'elite',
    metaTitle: "Executive Readiness | Fury Combat Systems",
    metaDescription: "Executive Readiness with David Furie is premium private training for executives, entrepreneurs, and professionals who value preparedness, discretion, and self-command.",
    subheadline: "A premium private training offering for executives, entrepreneurs, professionals, and public-facing individuals who value preparedness, discretion, awareness, and self-command.",
    overview: "Executive Readiness is built for higher-level clients who want a discreet, serious, and premium private training experience. The emphasis is on composure, awareness, preparedness, and real-world self-command.",
    whoFor: [
      "Executives and C-suite professionals",
      "Entrepreneurs and business owners",
      "Public-facing individuals and thought leaders",
      "Clients who value discretion and privacy",
      "Higher-income private clients seeking serious instruction",
    ],
    whatYouGet: [
      "Founder-led private training with David Furie",
      "Premium personalized instruction",
      "Discreet, focused sessions",
      "Practical readiness coaching",
      "A higher-standard training experience",
    ],
    trainingFocus: [
      "Preparedness and personal security awareness",
      "Discretion and situational control",
      "Awareness in professional environments",
      "Self-command and composure under pressure",
      "Movement and positioning",
      "Decision-making under pressure",
    ],
    likelyOutcomes: [
      "Greater confidence and composure in high-stakes situations",
      "Improved awareness in public and professional environments",
      "Stronger self-command under pressure",
      "A more personalized readiness skill set",
      "A training experience aligned with a demanding lifestyle",
    ],
    whyChoose: "This is designed for people who do not want a public class environment and who value serious, tailored, private instruction delivered at a higher standard.",
    faqs: [
      { q: "Is this only for executives?", a: "No. Executive Readiness is for any serious professional or individual who values privacy, quality, and a premium training experience." },
      { q: "How private is the training?", a: "Completely private. Sessions are one-on-one with David in a private setting." },
      { q: "Can it be customized to my work and lifestyle?", a: "Yes. Sessions are built around your specific schedule, concerns, and goals." },
      { q: "Is it beginner-friendly?", a: "Yes. David tailors every session to the client's current level and adjusts accordingly." },
      { q: "How is this different from Private Instruction?", a: "Executive Readiness is positioned at a higher standard with a focus on composure, discretion, and readiness for professionals in demanding roles." },
    ],
    relatedSlugs: ["/advanced-tactical-instruction", "/private-instruction", "/private-workshops"],
    heroImage: "furycombat-website-photos-005.jpg",
  },
  {
    title: "Family Protection Session",
    route: "/family-protection-session",
    price: "$350 / session",
    category: 'elite',
    metaTitle: "Family Protection Session | Fury Combat Systems",
    metaDescription: "Family Protection Sessions with David Furie focused on awareness, protective habits, emergency thinking, and everyday readiness for individuals and families.",
    subheadline: "A private session for individuals or families focused on practical awareness, protective habits, emergency thinking, and everyday readiness.",
    overview: "Family Protection Sessions are designed for individuals or families who want practical guidance around awareness, household and daily-life readiness, emergency thinking, and protective habits that make real-world situations more manageable.",
    whoFor: [
      "Parents seeking practical readiness skills",
      "Families who want shared awareness training",
      "Couples preparing for greater household readiness",
      "Individuals responsible for the safety of others",
      "Households preparing for greater everyday readiness",
    ],
    whatYouGet: [
      "Private family-focused instruction",
      "Practical readiness guidance for everyday life",
      "Awareness and emergency-thinking coaching",
      "Customized discussion and training themes",
      "An accessible format for multiple family members",
    ],
    trainingFocus: [
      "Practical awareness in daily life",
      "Protective habits and routines",
      "Emergency thinking and response",
      "Everyday readiness at home and in public",
      "Home-to-street awareness transitions",
      "Family communication under stress",
    ],
    likelyOutcomes: [
      "Better shared awareness as a household",
      "Stronger everyday protective habits",
      "More confidence as a family unit",
      "Clearer emergency thinking and response planning",
      "A practical framework families can use in real life",
    ],
    whyChoose: "This creates a more useful and relevant experience for people who are not just thinking about themselves, but about the people they are responsible for protecting.",
    faqs: [
      { q: "Can multiple family members attend?", a: "Yes. Sessions can include multiple family members when appropriate." },
      { q: "Is this appropriate for parents and teens?", a: "Yes. The content is adjusted based on the age and experience of participants." },
      { q: "Is this more discussion-based or physical?", a: "It is a blend. Sessions include practical coaching, discussion, and hands-on awareness exercises." },
      { q: "Can it be customized to our concerns?", a: "Absolutely. Every session is built around the family's specific needs and priorities." },
      { q: "Is it beginner-friendly?", a: "Yes. No prior experience is required for any participant." },
    ],
    relatedSlugs: ["/young-adult-readiness-training", "/womens-private-safety-training", "/private-instruction"],
    heroImage: "furycombat-website-photos-003.jpg",
  },
  {
    title: "Private Workshops",
    route: "/private-workshops",
    price: "Starting at $1,500",
    category: 'elite',
    metaTitle: "Private Workshops | Fury Combat Systems",
    metaDescription: "Private workshops with David Furie for companies, leadership teams, women's groups, and select audiences seeking practical awareness, de-escalation, readiness, and protection principles.",
    subheadline: "Private workshops for companies, organizations, leadership teams, women's groups, and select audiences seeking a refined, practical training experience.",
    overview: "Private Workshops are designed for organizations and select groups that want a more elevated and relevant training experience around awareness, de-escalation, readiness, and personal protection principles.",
    whoFor: [
      "Companies and corporate teams",
      "Leadership teams and executive groups",
      "Organizations seeking practical training",
      "Women's groups and professional networks",
      "Schools or select institutions",
      "Curated private groups",
    ],
    whatYouGet: [
      "A private workshop format led by David Furie",
      "Tailored topic selection for your group",
      "Practical instruction for group environments",
      "Premium presentation and founder-led teaching",
      "A more refined alternative to generic safety seminars",
    ],
    trainingFocus: [
      "Awareness and environmental reading",
      "De-escalation techniques",
      "Readiness and preparedness",
      "Personal protection principles",
      "Group safety culture",
      "Practical response thinking",
    ],
    likelyOutcomes: [
      "More aware teams and group members",
      "Stronger shared language around readiness",
      "More confidence in public or workplace environments",
      "A memorable and practical private training experience",
    ],
    whyChoose: "These workshops are designed for groups that want something more serious, more customized, and more practical than a standard generic safety talk.",
    faqs: [
      { q: "Who are these workshops best for?", a: "Private Workshops are ideal for companies, leadership teams, women's groups, and organizations that value serious, practical training." },
      { q: "Can the content be customized?", a: "Yes. Every workshop is tailored to the group's needs, industry, and specific concerns." },
      { q: "Are these held onsite or privately arranged?", a: "Workshops can be arranged at a private location, your office, or another suitable venue." },
      { q: "What size groups work best?", a: "Workshops typically work well with groups of 5 to 30 participants, though larger groups can be accommodated." },
      { q: "Can this be tailored for women's groups or leadership teams?", a: "Absolutely. Many workshops are specifically designed for women's groups, executive teams, or professional organizations." },
    ],
    relatedSlugs: ["/executive-readiness", "/womens-private-safety-training", "/advanced-tactical-instruction"],
    heroImage: "furycombat-website-photos-036.png",
  },
  {
    title: "Self Defense",
    route: "/self-defense-in-brooklyn",
    price: "",
    category: 'sport',
    metaTitle: "Self Defense in Brooklyn | Fury Combat Systems",
    metaDescription: "Private self defense training in Brooklyn with Grandmaster Dr. David Furie. Learn awareness, prevention, hand-to-hand defense, confidence, and real-world response.",
    subheadline: "Private self defense training in Brooklyn built around awareness, prevention, and decisive real-world response.",
    overview: "Self Defense training at Fury Combat Systems is built for real-world readiness. Clients learn practical awareness, prevention, hand-to-hand defense, decisive response, and the mental control needed to act under pressure. The goal is not fear-based training. The goal is confidence, preparation, and the ability to protect yourself and the people who matter to you.",
    whoFor: [
      "Adults seeking practical self defense in Brooklyn",
      "Commuters and city residents focused on safety",
      "Beginners with no prior training",
      "Women, parents, and professionals",
      "Anyone wanting confidence and personal readiness",
    ],
    whatYouGet: [
      "Private one-on-one instruction with David Furie",
      "Awareness, prevention, and response coaching",
      "Hands-on defensive skill development",
      "Training scaled to your fitness and experience level",
      "Practical tools you can use in real situations",
    ],
    trainingFocus: [
      "Situational awareness",
      "Threat recognition",
      "Defensive movement",
      "Hand-to-hand protection",
      "Using natural body weapons",
      "Everyday-object awareness",
      "Fear control",
      "Confidence under pressure",
    ],
    likelyOutcomes: [
      "Stronger awareness in everyday environments",
      "More confidence moving through Brooklyn and the city",
      "Practical defensive skill you can actually use",
      "Better composure under pressure",
      "A clearer mental framework for personal safety",
    ],
    whyChoose: "This is real self defense built around awareness, prevention, and practical response, taught privately by Grandmaster Dr. David Furie. It is not a generic gym class and it is not fear-based training.",
    faqs: [
      { q: "Is this beginner-friendly?", a: "Yes. Every session is shaped around the client's level, with no prior experience required." },
      { q: "Is self defense useful if I am not athletic?", a: "Yes. Self defense at Fury Combat is built around awareness, technique, and decision-making, not raw athleticism." },
      { q: "Can this focus on street safety in Brooklyn?", a: "Absolutely. Sessions can be tailored to commuting, neighborhood awareness, and real-world city situations." },
      { q: "Do you teach awareness and prevention?", a: "Yes. Awareness and prevention are core to every self defense session." },
      { q: "Is this private instruction only?", a: "Yes. All self defense training at Fury Combat is private and tailored to the individual." },
    ],
    relatedSlugs: ["/womens-private-safety-training", "/private-instruction", "/family-protection-session"],
    heroImage: "furycombat-website-photos-028.png",
  },
  {
    title: "Jujitsu",
    route: "/jujitsu-in-brooklyn",
    price: "",
    category: 'sport',
    metaTitle: "Jujitsu in Brooklyn | Private Jujitsu Training",
    metaDescription: "Private Jujitsu training in Brooklyn with Grandmaster Dr. David Furie. Learn leverage, control, close-combat skill, grappling concepts, and practical self-defense.",
    subheadline: "Private Jujitsu training in Brooklyn focused on leverage, control, and practical close-combat skill.",
    overview: "Jujitsu training at Fury Combat Systems focuses on leverage, positioning, control, and practical close-combat skill. It is designed for clients who want to understand how technique can overcome size, strength, and pressure. Training may include stand-up control, takedown awareness, grappling concepts, balance disruption, and self-defense application.",
    whoFor: [
      "Adults learning Jujitsu for self-defense",
      "Martial artists adding grappling skill",
      "Clients who want technique over brute strength",
      "Beginners seeking private instruction",
      "Experienced practitioners refining their game",
    ],
    whatYouGet: [
      "Private Jujitsu instruction with David Furie",
      "Step-by-step technical development",
      "Drilling and live application work",
      "Grappling concepts adapted for real-world defense",
      "Sessions tailored to your level and goals",
    ],
    trainingFocus: [
      "Leverage and control",
      "Close-combat positioning",
      "Balance disruption",
      "Defensive grappling",
      "Escapes and counters",
      "Ground awareness",
      "Practical self-defense application",
      "Mental discipline",
    ],
    likelyOutcomes: [
      "Stronger control in close-range situations",
      "Better understanding of leverage and positioning",
      "Improved composure under physical pressure",
      "Practical grappling skill that applies outside the gym",
      "Greater confidence in your defensive ability",
    ],
    whyChoose: "Private Jujitsu instruction with Grandmaster Dr. David Furie focuses on real, practical skill, not sport-only mechanics. You learn at your own pace with direct feedback every session.",
    faqs: [
      { q: "Do I need prior grappling experience?", a: "No. Sessions are tailored to your level, from complete beginner through advanced." },
      { q: "Is this sport Jujitsu or self-defense Jujitsu?", a: "The focus is practical close-combat skill and self-defense application, not sport competition." },
      { q: "Can technique really overcome a larger attacker?", a: "Yes. Jujitsu is built on leverage, positioning, and timing, which is exactly why it works against stronger opponents." },
      { q: "Is this private instruction only?", a: "Yes. All Jujitsu training at Fury Combat is private and one-on-one." },
      { q: "Can this be combined with striking training?", a: "Absolutely. Many clients combine Jujitsu sessions with kickboxing or MMA training." },
    ],
    relatedSlugs: ["/mixed-martial-arts-in-brooklyn", "/self-defense-in-brooklyn", "/private-instruction"],
    heroImage: "furycombat-website-photos-030.png",
  },
  {
    title: "Ninjutsu",
    route: "/ninjutsu-in-brooklyn",
    price: "",
    category: 'sport',
    metaTitle: "Ninjutsu in Brooklyn | Private Ninjutsu Training",
    metaDescription: "Private Ninjutsu training in Brooklyn with Grandmaster Dr. David Furie. Learn adaptability, movement, awareness, weapons concepts, and real-world combat strategy.",
    subheadline: "Private Ninjutsu training in Brooklyn built around adaptability, awareness, and practical combat strategy.",
    overview: "Ninjutsu training at Fury Combat Systems is built around adaptability, awareness, movement, and practical combat strategy. The training connects hand-to-hand skill, defensive movement, weapons concepts, and mental discipline into a private instruction format shaped around the client's level and goals.",
    whoFor: [
      "Adults drawn to traditional combat arts",
      "Martial artists seeking adaptability and movement",
      "Clients interested in weapons concepts",
      "Beginners curious about Ninjutsu",
      "Practitioners looking for serious private instruction",
    ],
    whatYouGet: [
      "Private Ninjutsu instruction with David Furie",
      "Founder-led teaching across multiple ranges of combat",
      "Movement, awareness, and timing development",
      "Introduction to weapons concepts where appropriate",
      "A serious training experience shaped around your goals",
    ],
    trainingFocus: [
      "Adaptability",
      "Stealth and awareness concepts",
      "Hand-to-hand movement",
      "Defensive tactics",
      "Weapons familiarity",
      "Mind-body discipline",
      "Precision and timing",
      "Real-world application",
    ],
    likelyOutcomes: [
      "Greater body awareness and control",
      "Improved adaptability under pressure",
      "Sharper timing and movement",
      "Stronger mind-body discipline",
      "A deeper understanding of combat strategy",
    ],
    whyChoose: "Ninjutsu at Fury Combat is taught privately by Grandmaster Dr. David Furie with a focus on practical adaptability, not theatrical movement. Every session is built around real skill and real readiness.",
    faqs: [
      { q: "Is Ninjutsu practical for modern self-defense?", a: "Yes. The training emphasizes adaptability, awareness, and real-world application." },
      { q: "Do I need prior martial arts experience?", a: "No. Sessions are tailored to your level, whether beginner or experienced." },
      { q: "Are weapons part of the training?", a: "Weapons familiarity can be introduced where appropriate, based on the client's goals." },
      { q: "Is this private instruction only?", a: "Yes. All Ninjutsu training at Fury Combat is private and one-on-one." },
      { q: "How is this different from other martial arts?", a: "Ninjutsu emphasizes adaptability, movement, awareness, and the integration of multiple combat ranges." },
    ],
    relatedSlugs: ["/weapons-and-tactics-in-brooklyn", "/advanced-tactical-instruction", "/private-instruction"],
    heroImage: "furycombat-website-photos-032.png",
  },
  {
    title: "Kickboxing",
    route: "/kickboxing-in-brooklyn",
    price: "",
    category: 'sport',
    metaTitle: "Kickboxing in Brooklyn | Private Kickboxing Training",
    metaDescription: "Private kickboxing training in Brooklyn with Grandmaster Dr. David Furie. Build striking skill, footwork, conditioning, balance, reflexes, and self-defense readiness.",
    subheadline: "Private kickboxing training in Brooklyn for striking skill, conditioning, and defensive readiness.",
    overview: "Kickboxing training at Fury Combat Systems develops powerful striking, movement, conditioning, and practical defensive skill. Clients work on punches, kicks, footwork, guard, balance, timing, and reaction in a private training format that can support fitness, self-defense, or mixed martial arts development.",
    whoFor: [
      "Adults learning kickboxing for fitness or self-defense",
      "Beginners wanting private striking instruction",
      "Experienced fighters refining technique",
      "MMA-focused clients building striking skill",
      "Anyone seeking serious, structured striking training",
    ],
    whatYouGet: [
      "Private kickboxing instruction with David Furie",
      "Technical breakdown of punches and kicks",
      "Pad work, footwork, and reaction drills",
      "Conditioning built into the session",
      "Defensive striking and guard development",
    ],
    trainingFocus: [
      "Punching and kicking mechanics",
      "Footwork",
      "Guard and defensive awareness",
      "Balance and coordination",
      "Pad work",
      "Reaction drills",
      "Conditioning",
      "Self-defense striking",
    ],
    likelyOutcomes: [
      "Sharper, more powerful striking",
      "Improved footwork and movement",
      "Better conditioning and stamina",
      "Stronger defensive habits",
      "Practical striking skill that translates to self-defense",
    ],
    whyChoose: "Private kickboxing instruction with Grandmaster Dr. David Furie means direct feedback every round, technique built correctly from the start, and a session shaped around your goals.",
    faqs: [
      { q: "Is this beginner-friendly?", a: "Yes. Every session is scaled to your fitness level and experience." },
      { q: "Will I do pad work and live drilling?", a: "Yes. Pad work, drilling, and reaction work are core parts of the training." },
      { q: "Is this for fitness or fighting?", a: "It can be either. Sessions can focus on fitness, self-defense, or MMA development based on your goals." },
      { q: "Do I need my own gear?", a: "Some basic gear is helpful, but David will guide you on what you actually need." },
      { q: "Is this private instruction only?", a: "Yes. All kickboxing training at Fury Combat is private and one-on-one." },
    ],
    relatedSlugs: ["/mixed-martial-arts-in-brooklyn", "/tactical-conditioning", "/private-instruction"],
    heroImage: "furycombat-website-photos-025.png",
  },
  {
    title: "Mixed Martial Arts",
    route: "/mixed-martial-arts-in-brooklyn",
    price: "",
    category: 'sport',
    metaTitle: "Mixed Martial Arts in Brooklyn | Private MMA Training",
    metaDescription: "Private mixed martial arts training in Brooklyn with Grandmaster Dr. David Furie. Learn striking, grappling, clinch work, ground awareness, and complete fighting skill.",
    subheadline: "Private MMA training in Brooklyn combining striking, grappling, and full-spectrum combat skill.",
    overview: "Mixed Martial Arts training at Fury Combat Systems combines striking, grappling, clinch awareness, ground control, and practical fighting strategy. Clients learn how different ranges of combat connect, including stand-up fighting, defensive movement, close-range control, and ground awareness.",
    whoFor: [
      "Adults learning MMA in Brooklyn",
      "Fighters building a complete skill set",
      "Beginners wanting structured private MMA instruction",
      "Martial artists cross-training across disciplines",
      "Clients seeking full-range combat readiness",
    ],
    whatYouGet: [
      "Private MMA instruction with David Furie",
      "Training across striking, clinch, and grappling",
      "Drilling and applied scenario work",
      "Conditioning and movement built into each session",
      "Sessions tailored to your goals and experience",
    ],
    trainingFocus: [
      "Striking",
      "Grappling fundamentals",
      "Clinch fighting",
      "Ground awareness",
      "Submission concepts",
      "Sprawl-and-brawl strategy",
      "Defensive positioning",
      "Full-spectrum combat readiness",
    ],
    likelyOutcomes: [
      "A more complete fighting skill set",
      "Comfort across striking, clinch, and ground ranges",
      "Improved conditioning and movement",
      "Stronger defensive instincts in every range",
      "Greater confidence in your overall combat ability",
    ],
    whyChoose: "Private MMA training with Grandmaster Dr. David Furie connects every range of combat into one coherent system, taught directly with no distractions and no wasted time.",
    faqs: [
      { q: "Do I need prior martial arts experience?", a: "No. Sessions are tailored to your level, from complete beginner through advanced." },
      { q: "Is this for competition or self-defense?", a: "Either. Sessions can focus on competition preparation, self-defense, or general MMA skill." },
      { q: "Will I train both striking and grappling?", a: "Yes. MMA at Fury Combat covers striking, clinch, and ground in an integrated way." },
      { q: "Is this private instruction only?", a: "Yes. All MMA training at Fury Combat is private and one-on-one." },
      { q: "Can I focus on just one area?", a: "Yes. Sessions can specialize in striking, grappling, or any specific area you want to develop." },
    ],
    relatedSlugs: ["/kickboxing-in-brooklyn", "/jujitsu-in-brooklyn", "/tactical-conditioning"],
    heroImage: "furycombat-website-photos-027.png",
  },
  {
    title: "Weapons and Tactics",
    route: "/weapons-and-tactics-in-brooklyn",
    price: "",
    category: 'sport',
    metaTitle: "Weapons and Tactics in Brooklyn | Fury Combat Systems",
    metaDescription: "Private weapons and tactics training in Brooklyn with Grandmaster Dr. David Furie. Learn awareness, tactical movement, weapons familiarity, discipline, and practical readiness.",
    subheadline: "Private weapons and tactics training in Brooklyn focused on awareness, control, and disciplined response.",
    overview: "Weapons and Tactics training at Fury Combat Systems introduces clients to practical awareness, tactical movement, weapons familiarity, and disciplined response. The focus is controlled, responsible instruction designed to build readiness, coordination, confidence, and a deeper understanding of real-world defensive situations.",
    whoFor: [
      "Adults seeking weapons familiarity and tactical awareness",
      "Martial artists expanding their training",
      "Clients focused on serious personal readiness",
      "Beginners wanting responsible, disciplined instruction",
      "Experienced practitioners refining tactical skill",
    ],
    whatYouGet: [
      "Private weapons and tactics instruction with David Furie",
      "Responsible, controlled introduction to weapons concepts",
      "Tactical movement and awareness drills",
      "Coordination and timing development",
      "A serious training experience shaped around your goals",
    ],
    trainingFocus: [
      "Weapons familiarity",
      "Tactical movement",
      "Awareness and distance",
      "Responsible control",
      "Defensive positioning",
      "Improvised-object awareness",
      "Coordination and timing",
      "Practical readiness",
    ],
    likelyOutcomes: [
      "Greater tactical awareness in real environments",
      "Stronger discipline and control",
      "Improved coordination and timing",
      "Better understanding of defensive movement",
      "A more complete personal readiness skill set",
    ],
    whyChoose: "Weapons and Tactics training at Fury Combat is serious, controlled, and taught privately by Grandmaster Dr. David Furie. The focus is responsibility, awareness, and real skill, not flash.",
    faqs: [
      { q: "Is this safe for beginners?", a: "Yes. Training is responsible, controlled, and scaled to the client's level." },
      { q: "What kinds of weapons concepts are covered?", a: "Coverage depends on the client's goals and experience, with an emphasis on awareness, movement, and responsible handling." },
      { q: "Is this only for advanced practitioners?", a: "No. Sessions are tailored to beginners through advanced clients." },
      { q: "Is this private instruction only?", a: "Yes. All Weapons and Tactics training is private and one-on-one." },
      { q: "Can this be combined with other training?", a: "Yes. Many clients combine Weapons and Tactics with Ninjutsu, MMA, or private instruction sessions." },
    ],
    relatedSlugs: ["/ninjutsu-in-brooklyn", "/advanced-tactical-instruction", "/private-instruction"],
    heroImage: "furycombat-website-photos-034.png",
  },
];

export function getServiceByRoute(route: string): ServiceData | undefined {
  return allServices.find(s => s.route === route);
}

export function getRelatedServices(slugs: string[]): ServiceData[] {
  return slugs.map(s => allServices.find(svc => svc.route === s)).filter((v): v is ServiceData => !!v);
}

export function getServicesByCategory(category: ServiceCategory): ServiceData[] {
  return allServices.filter(s => s.category === category);
}

```

## `artifacts/fury-combat/src/pages/Home.tsx`

```tsx
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Phone, Mail, MapPin, ChevronLeft, Star, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { serviceRoutes, categories, categoryOrder, type ServiceCategory } from '@/data/services';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const assetModules = import.meta.glob<string>('@assets/furycombat-website-photos-*', { eager: true, query: '?url', import: 'default' });

function asset(filename: string): string | undefined {
  const baseName = filename.replace(/\.[^.]+$/, '');
  const ext = filename.match(/\.[^.]+$/)?.[0] || '';
  const key = Object.keys(assetModules).find(k => {
    const kName = k.split('/').pop() || '';
    return kName.startsWith(baseName) && kName.endsWith(ext);
  });
  if (key) return assetModules[key];
  const keyAnyExt = Object.keys(assetModules).find(k => {
    const kName = k.split('/').pop() || '';
    return kName.startsWith(baseName);
  });
  return keyAnyExt ? assetModules[keyAnyExt] : undefined;
}

function Img({ src, alt, className }: { src: string | undefined; alt: string; className?: string }) {
  if (!src) return <div className={`bg-gradient-to-br from-zinc-800 via-zinc-900 to-black ${className || ''}`} />;
  return <img src={src} alt={alt} loading="lazy" className={className} />;
}

const imgHero = asset('furycombat-website-photos-005.jpg');
const imgSystem1 = asset('furycombat-website-photos-031.png');
const imgSystem2 = asset('furycombat-website-photos-021.jpg');
const imgSystem3 = asset('furycombat-website-photos-013.jpg');
const imgLegend1 = asset('furycombat-website-photos-001.jpg');
const imgLegend2 = asset('furycombat-website-photos-007.jpg');
const imgLegend3 = asset('furycombat-website-photos-010.jpg');
const imgLegend4 = asset('furycombat-website-photos-024.png');
const imgLegend5 = asset('furycombat-website-photos-034.png');
const imgPrivate1 = asset('furycombat-website-photos-017.jpg');
const imgPrivate2 = asset('furycombat-website-photos-019.jpg');
const imgPrivate3 = asset('furycombat-website-photos-036.png');

const galleryImageFiles = [
  'furycombat-website-photos-021.jpg',
  'furycombat-website-photos-016.jpg',
  'furycombat-website-photos-003.jpg',
  'furycombat-website-photos-008.jpg',
  'furycombat-website-photos-009.jpg',
  'furycombat-website-photos-011.jpg',
  'furycombat-website-photos-013.jpg',
  'furycombat-website-photos-020.jpg',
  'furycombat-website-photos-023.png',
  'furycombat-website-photos-025.png',
  'furycombat-website-photos-027.png',
  'furycombat-website-photos-028.png',
  'furycombat-website-photos-030.png',
  'furycombat-website-photos-031.png',
  'furycombat-website-photos-033.png',
  'furycombat-website-photos-035.png',
  'furycombat-website-photos-037.png',
  'furycombat-website-photos-038.png',
  'furycombat-website-photos-039.png',
];
const galleryImages = galleryImageFiles.map(f => asset(f)).filter((v): v is string => !!v);
const imgDeco1 = asset('furycombat-website-photos-002.jpg');


type HomeService = {
  title: string;
  price: string;
  desc: string;
  isWorkshop: boolean;
  category: ServiceCategory;
};

const services: HomeService[] = [
  {
    title: "Private Instruction",
    price: "$250/session",
    desc: "One-on-one training tailored to your goals, experience, and preferred areas of focus. Sessions may include movement, striking, grappling, defensive positioning, situational awareness, tactical response, pressure-point application, and controlled performance under stress.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Advanced Tactical Instruction",
    price: "$500/session",
    desc: "A more elevated private offering for serious individuals seeking instruction in readiness, tactical thinking, awareness under pressure, protective movement, weapons familiarity, reconnaissance concepts, and strategic response.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Women's Private Safety Training",
    price: "$300/session",
    desc: "Private instruction designed to help women strengthen awareness, confidence, prevention skills, de-escalation ability, escape options, and decisive real-world response.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Tactical Conditioning",
    price: "$150/session",
    desc: "A private training experience that combines conditioning, coordination, movement, reaction, and practical defensive drills.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Young Adult Readiness Training",
    price: "$225/session",
    desc: "Private instruction for young adults preparing for college, commuting, travel, city life, or greater independence.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Executive Readiness",
    price: "$400/session",
    desc: "A premium private training offering for executives, entrepreneurs, professionals, and public-facing individuals who value preparedness, discretion, awareness, and self-command.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Family Protection Session",
    price: "$350/session",
    desc: "A private session for individuals or families focused on practical awareness, protective habits, emergency thinking, and everyday readiness.",
    isWorkshop: false,
    category: 'elite',
  },
  {
    title: "Private Workshops",
    price: "Starting at $1,500",
    desc: "Private workshops for companies, organizations, leadership teams, women's groups, and select audiences seeking a refined, practical training experience in awareness, de-escalation, readiness, and personal protection principles.",
    isWorkshop: true,
    category: 'elite',
  },
  {
    title: "Self Defense",
    price: "",
    desc: "Private self defense training in Brooklyn built around awareness, prevention, hand-to-hand defense, confidence, and decisive real-world response.",
    isWorkshop: false,
    category: 'sport',
  },
  {
    title: "Jujitsu",
    price: "",
    desc: "Private Jujitsu training in Brooklyn focused on leverage, control, balance disruption, grappling concepts, and practical close-combat skill.",
    isWorkshop: false,
    category: 'sport',
  },
  {
    title: "Ninjutsu",
    price: "",
    desc: "Private Ninjutsu training in Brooklyn built around adaptability, awareness, movement, weapons concepts, and real-world combat strategy.",
    isWorkshop: false,
    category: 'sport',
  },
  {
    title: "Kickboxing",
    price: "",
    desc: "Private kickboxing training in Brooklyn for striking skill, footwork, conditioning, balance, reflexes, and self-defense readiness.",
    isWorkshop: false,
    category: 'sport',
  },
  {
    title: "Mixed Martial Arts",
    price: "",
    desc: "Private MMA training in Brooklyn combining striking, grappling, clinch fighting, ground awareness, and full-spectrum combat readiness.",
    isWorkshop: false,
    category: 'sport',
  },
  {
    title: "Weapons and Tactics",
    price: "",
    desc: "Private weapons and tactics training in Brooklyn focused on awareness, tactical movement, weapons familiarity, discipline, and practical readiness.",
    isWorkshop: false,
    category: 'sport',
  }
];

const faqs = [
  {
    q: "What is Fury Combat Systems?",
    a: "Fury Combat Systems is a Brooklyn-based private martial arts and tactical training brand built around the Fury System developed by Grandmaster Dr. David Furie."
  },
  {
    q: "Who is David Furie?",
    a: "David Furie is a 10th degree black belt / dan, retired Secret Service Operative, former Special Forces member, world champion fighter, and International Combat Martial Arts Master."
  },
  {
    q: "What kind of training does Fury Combat offer?",
    a: "Fury Combat focuses on private instruction in practical self-protection, hand-to-hand skill, tactical awareness, conditioning, and readiness for real-world situations."
  },
  {
    q: "Are classes group classes or private lessons?",
    a: "At this time, Fury Combat offers private lessons and private workshops only."
  },
  {
    q: "Where is Fury Combat Systems located?",
    a: "Fury Combat Systems is based in Brooklyn, New York, at 24 Cobek Ct, Brooklyn, NY 11223."
  },
  {
    q: "How do I contact David Furie?",
    a: "You can contact David directly by phone at (917) 340-2911 or by email at david.furie@gmail.com."
  },
  {
    q: "Who is private instruction for?",
    a: "Private instruction is for serious clients seeking personalized, founder-led training in awareness, readiness, protective skill, and real-world application."
  },
  {
    q: "Is the Fury System only for sport fighting?",
    a: "No. The Fury System is positioned around practical self-protection and readiness for real-life situations, with self-protection first and combat second."
  }
];

export default function Home() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);
  
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (lightboxIndex === null) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') setLightboxIndex((prev) => (prev !== null && prev < galleryImages.length - 1 ? prev + 1 : prev));
    if (e.key === 'ArrowLeft') setLightboxIndex((prev) => (prev !== null && prev > 0 ? prev - 1 : prev));
  }, [lightboxIndex]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="fixed inset-0 z-[-1] bg-noise"></div>

      <SiteHeader />

      {/* HERO SECTION */}
      <section id="home" className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {imgHero ? (
            <img src={imgHero} alt="Grandmaster Dr. David Furie" className="w-full h-full object-cover object-center opacity-40" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-background/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="mb-4 inline-block px-3 py-1 border border-primary/30 bg-primary/10 text-primary text-xs font-semibold tracking-[0.2em] uppercase">
              Elite Private Training in Brooklyn
            </motion.div>
            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl lg:text-8xl font-black font-serif uppercase leading-[0.9] mb-6 tracking-tighter">
              Fury Combat <br/><span className="text-transparent border-text" style={{ WebkitTextStroke: '2px hsl(var(--primary))'}}>Systems</span>
            </motion.h1>
            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl font-light">
              Train privately with Grandmaster Dr. David Furie in personal readiness, tactical awareness, practical self-protection, and high-level instruction designed for real-world application.
            </motion.p>
            <motion.p variants={fadeInUp} className="text-base text-white/60 mb-10 max-w-2xl">
              Fury Combat offers private instruction for individuals seeking more than a standard martial arts class. Each session is designed around the client's goals, lifestyle, and level of experience, with a focus on practical skill, confidence, awareness, conditioning, and readiness under pressure.
            </motion.p>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="tel:9173402911">Inquire by Phone</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="mailto:david.furie@gmail.com">Inquire by Email</a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:text-primary hover:bg-transparent rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer">Get Directions</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* AUTHORITY STRIP */}
      <div className="border-y border-white/5 bg-black/50 py-8 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x divide-white/5">
            <div className="px-4">
              <div className="text-primary font-serif font-bold text-xl md:text-2xl mb-1">10th Dan</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Grandmaster</div>
            </div>
            <div className="px-4">
              <div className="text-primary font-serif font-bold text-xl md:text-2xl mb-1">Operative</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Former Special Forces</div>
            </div>
            <div className="px-4">
              <div className="text-primary font-serif font-bold text-xl md:text-2xl mb-1">Champion</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">World Fighter</div>
            </div>
            <div className="px-4">
              <div className="text-primary font-serif font-bold text-xl md:text-2xl mb-1">Brooklyn</div>
              <div className="text-xs text-white/50 uppercase tracking-widest">Private Instruction</div>
            </div>
          </div>
        </div>
      </div>

      {/* INTRO */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <p className="text-xl md:text-3xl font-serif leading-tight text-white/90">
              Fury Combat Systems is a Brooklyn-based private training brand led by Grandmaster Dr. David Furie. The Fury System blends practical hand-to-hand instruction, tactical awareness, strategic thinking, and personal readiness for clients who want real-world capability, not generic training.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRIVATE INSTRUCTION */}
      <section id="instruction" className="py-32 bg-background relative">
        <div className="absolute left-0 top-1/4 w-64 h-64 bg-primary/5 blur-[150px] pointer-events-none rounded-full"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase mb-4 text-white">Private Martial Arts, MMA, Self Defense &amp; Tactical Training in Brooklyn</h2>
              <div className="text-primary font-bold tracking-widest uppercase text-sm mb-8">Two Sides of the Fury System</div>
              <p className="text-lg text-white/70 font-light leading-relaxed">
                Fury Combat offers two distinct paths of private instruction. Elite Private Training is built for executives, professionals, families, and serious individuals who want discreet, high-level personal protection and tactical readiness. Martial Arts &amp; Combat Sports is built for adults and young athletes who want the competitive, sport side of the system. Every session is private, founder-led, and tailored to the individual.
              </p>
            </motion.div>
          </div>

          {categoryOrder.map((catId, catIdx) => {
            const cat = categories[catId];
            const items = services.filter(s => s.category === catId);
            return (
              <div key={catId} className={catIdx > 0 ? 'mt-24' : ''}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="max-w-3xl mb-12"
                >
                  <div className="text-primary font-bold tracking-widest uppercase text-xs mb-3">Category {String(catIdx + 1).padStart(2, '0')}</div>
                  <h3 className="text-3xl md:text-5xl font-serif font-bold uppercase mb-4 text-white">{cat.label}</h3>
                  <div className="text-white/50 font-medium tracking-wide uppercase text-sm mb-5">{cat.tagline}</div>
                  <p className="text-base text-white/60 font-light leading-relaxed">{cat.description}</p>
                  <div className="mt-6 h-px w-24 bg-primary" />
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((service, idx) => (
                    <motion.div
                      key={service.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: idx * 0.08 }}
                      className="group relative bg-zinc-900/50 border border-white/10 p-8 hover:border-primary/50 transition-colors flex flex-col h-full"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                      <h4 className="text-xl font-serif font-bold text-white mb-6 pr-12">{service.title}</h4>
                      <p className="text-white/60 text-sm leading-relaxed mb-8 flex-grow">
                        {service.desc}
                      </p>

                      <div className="flex flex-col gap-3 mt-auto">
                        {serviceRoutes[service.title] && (
                          <Button asChild className="w-full justify-center bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase">
                            <Link href={serviceRoutes[service.title]}>Learn More</Link>
                          </Button>
                        )}
                        <Button asChild variant="outline" className="w-full justify-center border-white/20 hover:border-primary hover:bg-primary/10 rounded-none tracking-widest text-xs uppercase">
                          <a href="tel:9173402911">{service.isWorkshop ? 'Request a Private Workshop' : 'Inquire by Phone'}</a>
                        </Button>
                        <Button asChild variant="ghost" className="w-full justify-center text-white/50 hover:text-white rounded-none tracking-widest text-xs uppercase">
                          <a href="mailto:david.furie@gmail.com">{service.isWorkshop ? 'Contact David' : 'Inquire by Email'}</a>
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
          
          <div className="mt-16 grid md:grid-cols-3 gap-4">
            <Img src={imgPrivate1} alt="Training" className="w-full h-64 object-cover grayscale opacity-50 border border-white/10" />
            <Img src={imgPrivate2} alt="Training" className="w-full h-64 object-cover grayscale opacity-50 border border-white/10" />
            <Img src={imgPrivate3} alt="Training" className="w-full h-64 object-cover grayscale opacity-50 border border-white/10" />
          </div>
        </div>
      </section>

      {/* THE SYSTEM */}
      <section id="system" className="py-24 bg-zinc-950 relative border-t border-white/5">
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-10 pointer-events-none">
          <Img src={imgDeco1} alt="Texture" className="w-full h-full object-cover mix-blend-overlay" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-4xl md:text-6xl font-serif font-bold uppercase mb-8 text-white">The System</motion.h2>
              <motion.p variants={fadeInUp} className="text-lg text-white/70 mb-6 font-light leading-relaxed">
                The Fury System is an innovative combat martial arts system that blends techniques, tactics, and strategic thinking from multiple disciplines into one practical method. It is built for modern self-protection, close-quarter readiness, tactical awareness, and real-world application.
              </motion.p>
              <motion.p variants={fadeInUp} className="text-lg text-white/70 mb-10 font-light leading-relaxed">
                In the original system language, FURY breaks into two symbolic elements: Wind and Spirit. Wind represents motivation, hard work, and discipline. Spirit represents heart, ambition, and devotion to the path. Together, they define the physical and mental foundation of the system.
              </motion.p>
              
              <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
                {[
                  "Self-protection first. Combat second.",
                  "Real-world readiness",
                  "Hand-to-hand skill",
                  "Tactical awareness",
                  "Mental discipline",
                  "Emotional control under pressure",
                  "Improvised environmental awareness"
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <ChevronRight className="text-primary mt-1 flex-shrink-0" size={16} />
                    <span className="text-white/80 text-sm font-medium tracking-wide">{item}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative grid grid-cols-2 gap-4"
            >
              <div className="col-span-2 relative aspect-video overflow-hidden">
                <Img src={imgSystem1} alt="The Fury System" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 border border-white/10" />
              </div>
              <div className="relative aspect-square overflow-hidden mt-4">
                <Img src={imgSystem2} alt="Training Detail" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 border border-white/10" />
              </div>
              <div className="relative aspect-square overflow-hidden mt-4">
                <Img src={imgSystem3} alt="System Detail" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
                <div className="absolute inset-0 border border-white/10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* THE LEGEND: DAVID FURIE */}
      <section id="legend" className="py-32 relative bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24">
            <motion.div 
              className="lg:col-span-5 relative"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="sticky top-32">
                <div className="relative overflow-hidden mb-6 aspect-[3/4]">
                  <Img src={imgLegend1} alt="Grandmaster Dr. David Furie" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)] pointer-events-none" />
                </div>
                <div className="flex gap-4">
                  <Img src={imgLegend2} alt="David Furie Action" className="w-1/2 aspect-square object-cover grayscale opacity-70 hover:opacity-100 transition-opacity" />
                  <Img src={imgLegend4} alt="David Furie Seminar" className="w-1/2 aspect-square object-cover grayscale opacity-70 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="lg:col-span-7 flex flex-col justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={fadeInUp} className="mb-4 inline-block text-primary text-sm font-bold tracking-[0.3em] uppercase">
                The Legend
              </motion.div>
              <motion.h2 variants={fadeInUp} className="text-5xl md:text-7xl font-serif font-black uppercase mb-10 text-white leading-none">
                David Furie
              </motion.h2>
              
              <div className="space-y-8 text-lg md:text-xl text-white/70 font-light leading-relaxed">
                <motion.p variants={fadeInUp} className="text-white/90 font-medium">
                  Grandmaster Dr. David Furie is a 10th degree black belt / dan, a retired Secret Service Operative, a former member of the military's elite Special Forces unit, a world champion fighter, and an International Combat Martial Arts Master.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  He developed the Fury System to reflect the evolution of combat for the modern world, training that sharpens not only physical capability, but also mental toughness, emotional control, and readiness under pressure.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  For those seeking direct access to high-level instruction shaped by decades of experience, Fury Combat offers a rare private training environment grounded in real-world application.
                </motion.p>
                <motion.p variants={fadeInUp}>
                  Across seminars, public appearances, martial arts events, and private instruction, David has built a presence that reflects discipline, recognition, and lifelong commitment to the path of combat arts and personal readiness.
                </motion.p>
              </div>

              <motion.div variants={fadeInUp} className="mt-12 pt-12 border-t border-white/10 flex items-center gap-6">
                 {imgLegend5 && <img src={imgLegend5} alt="Certificate/Award" className="h-24 w-auto object-contain opacity-50 grayscale" />}
                 {imgLegend3 && <img src={imgLegend3} alt="Action Shot" className="h-24 w-auto object-contain opacity-50 grayscale" />}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section id="gallery" className="py-24 bg-zinc-950 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold uppercase mb-6 text-white">Gallery</h2>
            <p className="text-xl text-white/60 font-light">
              A closer look at Fury Combat Systems, Grandmaster David Furie, public appearances, training moments, events, and the visual identity behind the Fury System.
            </p>
          </div>

          {galleryImages.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryImages.map((src, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={`relative overflow-hidden cursor-pointer group ${idx === 0 || idx === 7 ? 'md:col-span-2 md:row-span-2' : 'aspect-square'}`}
                  onClick={() => openLightbox(idx)}
                >
                  <img 
                    src={src} 
                    alt={`Fury Combat Gallery ${idx + 1}`} 
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 group-hover:opacity-80" 
                  />
                  <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors duration-300" />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, idx) => (
                <div key={idx} className={`relative overflow-hidden ${idx === 0 || idx === 7 ? 'md:col-span-2 md:row-span-2' : 'aspect-square'}`}>
                  <div className="w-full h-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-white/5 flex items-center justify-center">
                    <span className="text-white/20 text-xs uppercase tracking-widest">Photo</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={closeLightbox}
          >
            <button className="absolute top-6 right-6 text-white/50 hover:text-white p-2" onClick={closeLightbox}>
              <X size={32} />
            </button>
            
            <button 
              className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 hidden md:block" 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => prev !== null && prev > 0 ? prev - 1 : prev);
              }}
            >
              <ChevronLeft size={48} />
            </button>

            <motion.img 
              key={lightboxIndex}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              src={galleryImages[lightboxIndex]} 
              alt="Gallery Enlarged" 
              className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <button 
              className="absolute right-6 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-4 hidden md:block" 
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(prev => prev !== null && prev < galleryImages.length - 1 ? prev + 1 : prev);
              }}
            >
              <ChevronRight size={48} />
            </button>
            
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 tracking-widest text-sm font-mono">
              {lightboxIndex + 1} / {galleryImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONTACT */}
      <section id="contact" className="py-32 bg-zinc-950 border-t border-white/5 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl md:text-6xl font-serif font-bold uppercase mb-4 text-white">Contact</h2>
              <div className="text-primary font-bold tracking-widest uppercase text-sm mb-8">Inquire About Private Training</div>
              <p className="text-lg text-white/70 font-light mb-12">
                All Fury Combat instruction is currently offered by private lesson or private workshop only.
              </p>

              <div className="space-y-8 mb-12">
                <a href="tel:9173402911" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <Phone className="text-white group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50 uppercase tracking-widest mb-1">Call Directly</div>
                    <div className="text-xl font-serif text-white">(917) 340-2911</div>
                  </div>
                </a>
                <a href="mailto:david.furie@gmail.com" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <Mail className="text-white group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50 uppercase tracking-widest mb-1">Email David</div>
                    <div className="text-xl font-serif text-white">david.furie@gmail.com</div>
                  </div>
                </a>
                <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer" className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/10 transition-colors">
                    <MapPin className="text-white group-hover:text-primary transition-colors" />
                  </div>
                  <div>
                    <div className="text-sm text-white/50 uppercase tracking-widest mb-1">Location</div>
                    <div className="text-xl font-serif text-white">24 Cobek Ct<br/>Brooklyn, NY 11223</div>
                  </div>
                </a>
              </div>

              <div className="flex gap-4">
                <Button asChild variant="outline" className="border-white/20 hover:border-primary rounded-none tracking-widest text-xs uppercase h-12 px-6">
                  <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer">Get Directions</a>
                </Button>
                <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest text-xs uppercase h-12 px-6">
                  <a href="https://search.google.com/local/writereview?placeid=ChIJK3bJOxJGwokRWkZSVj7DV5s" target="_blank" rel="noreferrer">Leave a Google Review</a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-black border border-white/10 p-8 md:p-10"
            >
              <h3 className="text-2xl font-serif font-bold text-white mb-8">Send an Inquiry</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Name</label>
                    <Input className="bg-zinc-900 border-white/10 rounded-none focus-visible:ring-primary h-12" placeholder="Your Name" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-widest text-white/50">Phone</label>
                    <Input type="tel" className="bg-zinc-900 border-white/10 rounded-none focus-visible:ring-primary h-12" placeholder="Your Phone Number" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50">Email</label>
                  <Input type="email" className="bg-zinc-900 border-white/10 rounded-none focus-visible:ring-primary h-12" placeholder="Your Email Address" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50">Interested In</label>
                  <Select>
                    <SelectTrigger className="bg-zinc-900 border-white/10 rounded-none focus-visible:ring-primary h-12">
                      <SelectValue placeholder="Select a program" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-white/10 rounded-none text-white">
                      {services.map((s, i) => (
                        <SelectItem key={i} value={s.title} className="hover:bg-primary/20 cursor-pointer">{s.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/50">Message</label>
                  <Textarea className="bg-zinc-900 border-white/10 rounded-none focus-visible:ring-primary min-h-[120px] resize-none" placeholder="Tell us about your background and goals..." />
                </div>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white rounded-none h-14 tracking-widest font-bold uppercase mt-4">
                  Submit Inquiry
                </Button>
              </form>
              
              <div className="mt-8 pt-8 border-t border-white/10 text-center flex flex-col items-center gap-3">
                <div className="flex gap-1 text-yellow-500">
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                  <Star size={16} fill="currentColor" />
                </div>
                <p className="text-sm text-white/50 italic">
                  Trained with David? Please leave Fury Combat Systems a Google review.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 bg-background border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-serif font-bold uppercase text-white mb-4">FAQ</h2>
            <div className="text-primary font-bold tracking-widest uppercase text-sm">Frequently Asked Questions</div>
          </motion.div>

          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border border-white/10 bg-zinc-900/30 px-6 data-[state=open]:border-primary/50 transition-colors">
                <AccordionTrigger className="text-left font-serif text-lg text-white hover:text-primary hover:no-underline py-6">
                  {faq.q}
                </AccordionTrigger>
                <AccordionContent className="text-white/60 leading-relaxed pb-6">
                  {faq.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
```

## `artifacts/fury-combat/src/pages/ServiceDetail.tsx`

```tsx
import { useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, ChevronRight, ArrowLeft, Check, Shield, Target, Users, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { getServiceByRoute, getRelatedServices } from '@/data/services';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

const assetModules = import.meta.glob<string>('@assets/furycombat-website-photos-*', { eager: true, query: '?url', import: 'default' });

function asset(filename: string): string | undefined {
  const baseName = filename.replace(/\.[^.]+$/, '');
  const ext = filename.match(/\.[^.]+$/)?.[0] || '';
  const key = Object.keys(assetModules).find(k => {
    const kName = k.split('/').pop() || '';
    return kName.startsWith(baseName) && kName.endsWith(ext);
  });
  if (key) return assetModules[key];
  const keyAnyExt = Object.keys(assetModules).find(k => {
    const kName = k.split('/').pop() || '';
    return kName.startsWith(baseName);
  });
  return keyAnyExt ? assetModules[keyAnyExt] : undefined;
}

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export default function ServiceDetail({ params }: { params: { slug: string } }) {
  const slug = params?.slug;
  const service = slug ? getServiceByRoute(`/${slug}`) : undefined;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (service) {
      document.title = service.metaTitle;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', service.metaDescription);

      const existingSchema = document.getElementById('service-faq-schema');
      if (existingSchema) existingSchema.remove();

      const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": service.faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.a
          }
        }))
      };
      const script = document.createElement('script');
      script.id = 'service-faq-schema';
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(faqSchema);
      document.head.appendChild(script);

      return () => {
        const el = document.getElementById('service-faq-schema');
        if (el) el.remove();
      };
    }
  }, [service]);

  if (!service) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-white mb-4">Service Not Found</h1>
          <p className="text-white/60 mb-8">The service page you are looking for does not exist.</p>
          <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-none tracking-widest uppercase">
            <Link href="/">Return Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const heroImg = service.heroImage ? asset(service.heroImage) : undefined;
  const related = getRelatedServices(service.relatedSlugs);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="fixed inset-0 z-[-1] bg-noise"></div>

      <SiteHeader />

      <section className="relative min-h-[70vh] flex items-end pt-20 pb-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroImg ? (
            <img src={heroImg} alt={service.title} className="w-full h-full object-cover object-center opacity-30" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-background/30" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
        </div>

        <div className="container relative z-10 px-6 mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="mb-6">
              <Link href="/#instruction" className="inline-flex items-center gap-2 text-white/50 hover:text-primary text-sm transition-colors uppercase tracking-widest">
                <ArrowLeft size={14} />
                All Services
              </Link>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-4xl md:text-6xl lg:text-7xl font-black font-serif uppercase leading-[0.9] mb-6 tracking-tighter text-white">
              {service.title}
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl font-light">
              {service.subheadline}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="tel:9173402911"><Phone size={16} className="mr-2" />Inquire by Phone</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="mailto:david.furie@gmail.com"><Mail size={16} className="mr-2" />Inquire by Email</a>
              </Button>
              <Button asChild size="lg" variant="ghost" className="text-white hover:text-primary hover:bg-transparent rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer"><MapPin size={16} className="mr-2" />Get Directions</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase mb-8 text-white">Overview</h2>
            <p className="text-lg text-white/70 leading-relaxed font-light">
              {service.overview}
            </p>
          </motion.div>
        </div>
      </section>

      {service.videos && service.videos.length > 0 && (
        <section className="py-20 bg-background border-t border-white/5">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif font-bold uppercase mb-8 text-white">Training Video</motion.h2>
              <div className="space-y-8">
                {service.videos.map((video, i) => (
                  <motion.div key={i} variants={fadeInUp} className="space-y-4">
                    <div className="relative w-full overflow-hidden border border-white/10 bg-black" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={video.embedUrl}
                        title={video.title}
                        loading="lazy"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full"
                      />
                    </div>
                    {video.description && (
                      <p className="text-white/60 text-sm leading-relaxed">{video.description}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-20 bg-background border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <Users size={24} className="text-primary" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase text-white">Who This Is For</h2>
            </motion.div>
            <div className="grid md:grid-cols-2 gap-4">
              {service.whoFor.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-3 p-4 bg-zinc-900/50 border border-white/5"
                >
                  <Check size={18} className="text-primary mt-0.5 shrink-0" />
                  <span className="text-white/70 text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <Shield size={24} className="text-primary" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase text-white">What You Get</h2>
            </motion.div>
            <div className="space-y-4">
              {service.whatYouGet.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-4 p-5 bg-black/30 border border-white/5"
                >
                  <div className="w-8 h-8 bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
                    <span className="text-primary font-mono text-sm font-bold">{String(i + 1).padStart(2, '0')}</span>
                  </div>
                  <span className="text-white/70 text-base leading-relaxed">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <Target size={24} className="text-primary" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase text-white">Training Focus</h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              {service.trainingFocus.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="px-4 py-3 bg-zinc-900/50 border border-white/5 text-white/70 text-sm flex items-center gap-2"
                >
                  <ChevronRight size={14} className="text-primary shrink-0" />
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-8">
              <Sparkles size={24} className="text-primary" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase text-white">Likely Outcomes</h2>
            </motion.div>
            <div className="space-y-3">
              {service.likelyOutcomes.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex items-start gap-3 p-4 border-l-2 border-primary/50 bg-primary/5"
                >
                  <span className="text-white/80 text-base">{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-background border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase mb-8 text-white">Why Choose This</h2>
            <div className="p-8 bg-zinc-900/50 border border-primary/20">
              <p className="text-lg text-white/80 leading-relaxed font-light italic">
                {service.whyChoose}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle size={24} className="text-primary" />
              <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase text-white">FAQ</h2>
            </div>
            <Accordion type="single" collapsible className="w-full space-y-3">
              {service.faqs.map((faq, idx) => (
                <AccordionItem key={idx} value={`faq-${idx}`} className="border border-white/10 bg-black/30 px-6 data-[state=open]:border-primary/50 transition-colors">
                  <AccordionTrigger className="text-left font-serif text-base text-white hover:text-primary hover:no-underline py-5">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="py-20 bg-background border-t border-white/5">
          <div className="container mx-auto px-6 max-w-4xl">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.h2 variants={fadeInUp} className="text-3xl md:text-4xl font-serif font-bold uppercase mb-8 text-white">Related Services</motion.h2>
              <div className="grid md:grid-cols-3 gap-4">
                {related.map((rel, i) => (
                  <motion.div key={i} variants={fadeInUp}>
                    <Link
                      href={rel.route}
                      className="block p-6 bg-zinc-900/50 border border-white/10 hover:border-primary/50 transition-colors group"
                    >
                      <h3 className="text-lg font-serif font-bold text-white group-hover:text-primary transition-colors mb-3">{rel.title}</h3>
                      <p className="text-white/50 text-sm line-clamp-2 mb-4">{rel.subheadline}</p>
                      <span className="text-primary text-xs uppercase tracking-widest font-semibold flex items-center gap-1">
                        Learn More <ChevronRight size={12} />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      <section className="py-20 bg-zinc-950 border-t border-white/5">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold uppercase mb-4 text-white">Ready to Begin?</h2>
            <p className="text-white/60 mb-8 text-lg font-light">
              Contact Grandmaster Dr. David Furie directly to inquire about {service.title}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="tel:9173402911"><Phone size={16} className="mr-2" />Inquire by Phone</a>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/5 rounded-none px-8 font-semibold tracking-widest uppercase">
                <a href="mailto:david.furie@gmail.com"><Mail size={16} className="mr-2" />Inquire by Email</a>
              </Button>
            </div>

            <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-white/40">
              <a href="tel:9173402911" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Phone size={14} /> (917) 340-2911
              </a>
              <a href="mailto:david.furie@gmail.com" className="flex items-center gap-2 hover:text-primary transition-colors">
                <Mail size={14} /> david.furie@gmail.com
              </a>
              <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-primary transition-colors">
                <MapPin size={14} /> Brooklyn, NY
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

```

## `artifacts/fury-combat/src/pages/not-found.tsx`

```tsx
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

```

## `artifacts/fury-combat/src/components/SiteHeader.tsx`

```tsx
import { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { categories, categoryOrder, getServicesByCategory } from '@/data/services';

const mainNavLinks = [
  { name: 'Home', href: '/', isHash: false },
  { name: 'The System', href: '/#system', isHash: true },
  { name: 'The Legend', href: '/#legend', isHash: true },
  { name: 'Gallery', href: '/#gallery', isHash: true },
];

const bottomNavLinks = [
  { name: 'Contact', href: '/#contact', isHash: true },
  { name: 'FAQ', href: '/#faq', isHash: true },
];

export default function SiteHeader() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (href: string, isHash: boolean) => {
    setMobileMenuOpen(false);
    setMobileServicesOpen(false);
    if (isHash) {
      const hashPart = href.includes('#') ? href.split('#')[1] : '';
      if (location === '/') {
        const el = document.getElementById(hashPart);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const base = import.meta.env.BASE_URL || '/';
        window.location.href = `${base}#${hashPart}`;
      }
    }
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/90 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-serif text-2xl font-bold tracking-widest text-white group-hover:text-primary transition-colors">FURY<span className="text-primary group-hover:text-white transition-colors">COMBAT</span></span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 ml-8">
            {mainNavLinks.map((link) =>
              link.isHash ? (
                <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href, true); }} className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
                  {link.name}
                </a>
              ) : (
                <Link key={link.name} href={link.href} className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest">
                  {link.name}
                </Link>
              )
            )}

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setServicesOpen(!servicesOpen)}
                aria-expanded={servicesOpen}
                aria-controls="desktop-services-menu"
                aria-haspopup="menu"
                className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest flex items-center gap-1"
              >
                Services <ChevronDown size={14} className={`transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    id="desktop-services-menu"
                    role="menu"
                    className="absolute top-full right-0 mt-4 w-80 bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl py-2 max-h-[80vh] overflow-y-auto"
                  >
                    {categoryOrder.map((catId, catIdx) => {
                      const cat = categories[catId];
                      const items = getServicesByCategory(catId);
                      return (
                        <div key={catId} className={catIdx > 0 ? 'mt-2 pt-2 border-t border-white/10' : ''}>
                          <div className="px-5 py-2 text-[10px] font-bold tracking-widest uppercase text-primary/80">
                            {cat.label}
                          </div>
                          {items.map((s) => (
                            <Link
                              key={s.route}
                              href={s.route}
                              onClick={() => setServicesOpen(false)}
                              className="flex items-center px-5 py-2.5 text-sm text-white/70 hover:text-white hover:bg-primary/10 transition-colors"
                            >
                              <span>{s.title}</span>
                            </Link>
                          ))}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {bottomNavLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={(e) => { e.preventDefault(); handleNavClick(link.href, true); }} className="text-sm font-medium text-white/70 hover:text-white transition-colors uppercase tracking-widest cursor-pointer">
                {link.name}
              </a>
            ))}

            <Button asChild variant="outline" className="border-primary/50 text-white hover:bg-primary hover:text-white rounded-none tracking-widest uppercase text-xs">
              <a href="/#contact" onClick={(e) => { e.preventDefault(); handleNavClick('/#contact', true); }}>Inquire Now</a>
            </Button>
          </nav>

          <button className="lg:hidden text-white p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-xl pt-24 pb-8 px-6 flex flex-col overflow-y-auto"
          >
            <nav className="flex flex-col gap-5 text-center mt-12">
              {mainNavLinks.map((link) =>
                link.isHash ? (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); handleNavClick(link.href, true); }}
                    className="text-xl font-serif text-white/80 hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    {link.name}
                  </a>
                ) : (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-xl font-serif text-white/80 hover:text-primary transition-colors uppercase tracking-widest"
                  >
                    {link.name}
                  </Link>
                )
              )}

              <div>
                <button
                  onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-services-menu"
                  className="text-xl font-serif text-white/80 hover:text-primary transition-colors uppercase tracking-widest flex items-center justify-center gap-2 mx-auto"
                >
                  Services <ChevronDown size={16} className={`transition-transform ${mobileServicesOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {mobileServicesOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      id="mobile-services-menu"
                      className="overflow-hidden mt-3"
                    >
                      <div className="py-3 border-t border-b border-white/10 space-y-5">
                        {categoryOrder.map((catId) => {
                          const cat = categories[catId];
                          const items = getServicesByCategory(catId);
                          return (
                            <div key={catId} className="flex flex-col gap-3">
                              <div className="text-[10px] font-bold tracking-widest uppercase text-primary text-center">
                                {cat.label}
                              </div>
                              {items.map((s) => (
                                <Link
                                  key={s.route}
                                  href={s.route}
                                  onClick={() => { setMobileMenuOpen(false); setMobileServicesOpen(false); }}
                                  className="text-base text-white/60 hover:text-primary transition-colors flex items-center justify-center gap-2"
                                >
                                  {s.title} <ChevronRight size={12} className="text-primary/40" />
                                </Link>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {bottomNavLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(link.href, true); }}
                  className="text-xl font-serif text-white/80 hover:text-primary transition-colors uppercase tracking-widest"
                >
                  {link.name}
                </a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

```

## `artifacts/fury-combat/src/components/SiteFooter.tsx`

```tsx
import { Link } from 'wouter';
import { ChevronRight, Instagram, Linkedin, Facebook, Youtube } from 'lucide-react';
import { categories, categoryOrder, getServicesByCategory } from '@/data/services';

const sectionLinks = [
  { name: 'Home', href: '/' },
  { name: 'The System', href: '/#system' },
  { name: 'The Legend', href: '/#legend' },
  { name: 'Gallery', href: '/#gallery' },
  { name: 'Contact', href: '/#contact' },
  { name: 'FAQ', href: '/#faq' },
];

export default function SiteFooter() {
  return (
    <footer className="bg-black py-20 border-t border-white/10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          <div className="md:col-span-1">
            <Link href="/" className="inline-block font-serif text-2xl font-bold tracking-widest text-white mb-6">
              FURY<span className="text-primary">COMBAT</span>
            </Link>
            <p className="text-white/50 text-sm max-w-sm leading-relaxed mb-8">
              Private lessons and private workshops by inquiry only. Elite private martial arts and tactical training based in Brooklyn, NY.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/furycombatbrooklyn/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors">
                <Facebook size={18} />
              </a>
              <a href="https://www.instagram.com/david.furie/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors">
                <Instagram size={18} />
              </a>
              <a href="https://www.linkedin.com/in/david-furie-17091548/" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors">
                <Linkedin size={18} />
              </a>
              <a href="https://www.youtube.com/channel/UC1bJFJVjk-0AqvfVAj18IOg" target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-6">Navigation</h4>
            <ul className="space-y-4">
              {sectionLinks.map(link => (
                <li key={link.name}>
                  {link.href.includes('#') ? (
                    <a href={link.href} className="text-white/50 hover:text-primary text-sm transition-colors">{link.name}</a>
                  ) : (
                    <Link href={link.href} className="text-white/50 hover:text-primary text-sm transition-colors">{link.name}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {categoryOrder.map(catId => {
            const cat = categories[catId];
            const items = getServicesByCategory(catId);
            return (
              <div key={catId}>
                <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-6">{cat.label}</h4>
                <ul className="space-y-4">
                  {items.map(s => (
                    <li key={s.route}>
                      <Link href={s.route} className="text-white/50 hover:text-primary text-sm transition-colors">{s.title}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <div>
            <h4 className="text-white font-bold tracking-widest uppercase text-sm mb-6">Contact Info</h4>
            <ul className="space-y-4">
              <li>
                <a href="tel:9173402911" className="text-white/50 hover:text-primary text-sm transition-colors block">(917) 340-2911</a>
              </li>
              <li>
                <a href="mailto:david.furie@gmail.com" className="text-white/50 hover:text-primary text-sm transition-colors block break-words">david.furie@gmail.com</a>
              </li>
              <li className="text-white/50 text-sm">
                24 Cobek Ct<br/>Brooklyn, NY 11223
              </li>
              <li className="pt-2">
                <a href="https://www.google.com/maps/search/?api=1&query=Fury+Combat+Systems+24+Cobeck+Ct+Brooklyn+NY+11223" target="_blank" rel="noreferrer" className="text-primary hover:text-white text-sm font-semibold transition-colors flex items-center gap-1">
                  Get Directions <ChevronRight size={14} />
                </a>
              </li>
              <li className="pt-2">
                <a href="https://search.google.com/local/writereview?placeid=ChIJK3bJOxJGwokRWkZSVj7DV5s" target="_blank" rel="noreferrer" className="text-primary hover:text-white text-sm font-semibold transition-colors flex items-center gap-1">
                  Leave a Google Review <ChevronRight size={14} />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            &copy; {new Date().getFullYear()} Fury Combat Systems. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            <a href="https://furycombat.com" className="hover:text-white transition-colors">furycombat.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}

```

## `artifacts/fury-combat/src/components/ScrollToTop.tsx`

```tsx
import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

const images = import.meta.glob<{ default: string }>("@assets/furycombat-website-photos-*", { eager: true });

function asset(name: string) {
  const match = Object.entries(images).find(([k]) => k.includes(name));
  return match ? match[1].default : "";
}

const logo = asset("furycombat-website-photos-015");

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-50 group cursor-pointer flex flex-col items-center gap-0.5 transition-opacity duration-300"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <ChevronUp className="w-4 h-4 text-white/70 group-hover:text-white transition-colors -mb-1" strokeWidth={3} />
      <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/60 group-hover:border-primary shadow-lg shadow-black/50 group-hover:shadow-primary/20 transition-all duration-300">
        <img
          src={logo}
          alt="Scroll to top"
          className="w-full h-full object-cover"
          draggable={false}
        />
      </div>
    </button>
  );
}

```

## `artifacts/fury-combat/src/lib/utils.ts`

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

```

## `artifacts/fury-combat/src/hooks/use-mobile.tsx`

```tsx
import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

```

## `artifacts/fury-combat/src/hooks/use-toast.ts`

```ts
import * as React from "react"

import type {
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type Toast = Omit<ToasterToast, "id">

function toast({ ...props }: Toast) {
  const id = genId()

  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss()
      },
    },
  })

  return {
    id: id,
    dismiss,
    update,
  }
}

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }

```

# agent.md generator

> Twelve questions. Four minutes. A production-grade AGENT.md your AI assistants will read before every keystroke.

A modern, high-performance Bun Workspaces Monorepo featuring both a beautiful, polished Next.js Web App and an interactive CLI Terminal Wizard to generate project-specific AGENT.md (or CLAUDE.md, .cursorrules, etc.) configurations.

**[Live Web App Demo](https://agent-md-generator.edwinfom.dev)** · **Built by [Edwin Fom](https://github.com/Edwinfom00)**

---

## Monorepo Architecture

This project is structured as a Bun workspaces monorepo:

```
agent-md-generator/
├── packages/
│   ├── shared/         ← @agent-md/shared (TypeScript types, prompts, questions, templates, utils)
│   ├── web/            ← @agent-md/web (Next.js 16 Web App powered by Turbopack)
│   └── cli/            ← @agent-md/cli (Interactive Clack-based terminal CLI wizard)
├── package.json        ← Workspace-wide package settings
├── bunfig.toml         ← Bun configuration (bypasses SSL restrictions)
└── tsconfig.json       ← Shared TypeScript configuration
```

---

## Getting Started

### Prerequisites

- Bun (v1.x)
- Node.js >= 20 (for executing the built CLI)
- An API Key for your favorite provider (DeepSeek, Gemini, xAI, or local Ollama)

### 1. Installation

Install all workspace dependencies and link the local packages instantly using Bun:

```bash
# Bypasses corporate proxies if necessary, installing everything in seconds
$env:NODE_TLS_REJECT_UNAUTHORIZED="0"; bun install
```

### 2. Configure Environment

Create a .env.local file at the root:

```bash
cp packages/web/.env.local.example .env.local
```

Add your API Keys:

```env
DEEPSEEK_API_KEY=sk-your-key-here
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key-here
XAI_API_KEY=your-grok-key-here
```

---

## Running the Web Application (@agent-md/web)

Launch the local Next.js development server running on http://localhost:3000:

```bash
bun run dev:web
```

To compile a highly optimized production build:

```bash
bun run build:web
```

---

## Running the CLI Wizard (@agent-md/cli)

Compile the interactive terminal wizard:

```bash
bun run build:cli
```

Execute the CLI:

```bash
node packages/cli/dist/cli.mjs
```

### CLI Arguments

| Argument | Description |
|----------|-------------|
| `--update` | Update an existing AGENT.md by describing what you want to change or add. |
| `--history` | View the logs of the last 5 generations. |
| `--template <id>` | Apply a default template (e.g. nextjs-saas, api-backend, fullstack-monorepo) directly without prompts. |

---

## Deploying to Vercel

This monorepo deploys seamlessly on Vercel with zero configuration overrides, using Bun's ultra-fast builds:

1. Import this repository in your Vercel Dashboard.
2. Under **Project Settings** -> **General**:
   - Set **Root Directory** to `packages/web`.
   - Set **Framework Preset** to `Next.js`.
3. Click **Save** and **Deploy**! Vercel will automatically resolve the monorepo structure, transpile `@agent-md/shared`, and deploy the web app.

---

## Changelog and Hotfixes

### Version 0.1.2 (Bug Fix)
A rapid hotfix patch released immediately after 0.1.1 to resolve a critical NPM monorepo packaging issue:
- **Workspace Dependency Resolution**: Moved `@agent-md/shared` from `dependencies` to `devDependencies` since it is fully static-bundled into the final `dist/cli.js` file at compile-time by `tsup`. This completely resolves the `EUNSUPPORTEDPROTOCOL: workspace:*` installation error when users run the CLI via `npx`.
- **NPM Package Verification Fix**: Cleaned up the `"bin"` path definition to eliminate NPM registry warnings during publishing.

---

## License

MIT © [Edwin Fom](https://github.com/Edwinfom00)

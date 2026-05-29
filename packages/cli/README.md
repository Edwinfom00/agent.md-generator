# agent-md-generator

An interactive command-line interface (CLI) terminal wizard designed to generate production-grade developer profile configurations, including AGENT.md (Kiro), CLAUDE.md (Claude Code), .cursorrules (Cursor), .windsurfrules (Windsurf), and copilot-instructions.md (GitHub Copilot).

It automatically scans your project, builds a recursive directory tree, auto-detects your primary technology stack, prompts you with tailored architectural questions, and streams highly optimized AI instructions in real-time.

---

## Why agent-md-generator?

Most developers use AI coding assistants without supplying them with the structural context of their project. Consequently, AI models frequently generate code that violates coding conventions, introduces unwanted dependencies, and ignores structural constraints.

The AGENT.md (or CLAUDE.md) file acts as a local specification profile placed at the root of your project. Modern AI coding assistants read this file before formulating any response, ensuring they adapt perfectly to your architecture. This CLI generates a complete, tailored spec file for you in under 3 minutes.

---

## Installation and Quick Start

You can run the generator instantly without global installation using npx, or install it globally on your system.

### Option 1: Run instantly with npx (Recommended)
```bash
npx agent-md-generator
```

### Option 2: Install globally via npm
```bash
npm install -g agent-md-generator
```
Once installed globally, you can invoke the wizard anywhere by running:
```bash
agent-md-generator
```

---

## Command Line Arguments and Options

Customize the terminal wizard execution using these arguments:

| Flag | Description |
|------|-------------|
| `--init` | Enters Automatic Initialization Mode. Runs the generator in a completely non-interactive flow. It automatically scans your directory, auto-detects parameters, selects a model based on your environment keys, generates the profile, and writes `AGENT.md` and `CLAUDE.md` directly. |
| `--template <id>` | Bypasses the interactive wizard questions entirely by applying a preset technology template and proceeds directly to model selection and generation. See the list of accurate template IDs below. |
| `--update` | Enters Update Mode. Scans the directory for an existing `AGENT.md`, loads its content, prompts you to describe a change (e.g. "Add Jest testing conventions"), selects a model, and streams the updated profile. |
| `--history` | Enters History Mode. Displays the list of the last 5 generated profiles with their timestamps and models, letting you inspect or view the last generated content. |
| `--yes` | Confirms default choices automatically where applicable. |

### Available Template Presets (`--template <id>`)
You can use the `--template` flag followed by one of the exact IDs listed below to apply pre-configured questions and tech stack presets:

- `nextjs_saas`: Pre-fills presets for a Next.js SaaS Web Application using TypeScript, React, Next.js, Tailwind, Prisma, and Supabase.
- `api_backend`: Pre-fills presets for a Node.js API Backend using TypeScript, Node.js, and Zod.
- `mobile_rn`: Pre-fills presets for a Mobile Application using TypeScript, React Native, and Expo.
- `fullstack_monorepo`: Pre-fills presets for a Full-Stack Monorepo using TypeScript, React, Next.js, Node.js, and Prisma.
- `cli_tool`: Pre-fills presets for an NPM CLI Tool using TypeScript, Node.js, and Zod.

#### Example: Running with a specific template preset
```bash
npx agent-md-generator --template nextjs_saas
```

---

## Detailed Feature Walkthrough

### 1. Automatic Project Context Discovery
When you launch the CLI, it immediately analyzes your current directory to understand the project structure:
- **Manifest File Scan**: Looks for package managers and project configurations (package.json, Cargo.toml, go.mod, pyproject.toml, requirements.txt) to identify the project name, description, and language.
- **Dependency Parser**: Auto-extracts dependencies to automatically pre-fill your primary tech stack.
- **Directory Tree Generation**: Recursively maps your project directory structure up to 6 levels deep, outputting a clean layout map for prompt injection.
- **Smart Directory Filtering**: The scanner strictly ignores binary extensions (.png, .zip, .pdf, .wasm, etc.), lockfiles (package-lock.json, bun.lockb, Cargo.lock, etc.), and build outputs (node_modules, .git, .next, dist, target, vendor) to prevent bloating the prompt context.
- **Empty Folder Fallback**: If run in an empty directory, the CLI will alert you and prompt you to input the relative or absolute path to your active project.

### 2. Multi-Model AI Providers
Connects natively to top-tier commercial and open-source models:
- **DeepSeek**: deepseek-chat, deepseek-reasoner (R1)
- **Google Gemini**: gemini-2.0-flash, gemini-1.5-pro
- **xAI**: grok-beta, grok-3-mini
- **Ollama**: Run completely offline and free using locally served models like llama3.2 and mistral.
- **Credential Storage**: Reads API keys from your environment or .env.local file. If a required key is missing, the CLI prompts you to enter it securely and offers to save it to your local .env.local file for future runs.

### 3. Real-Time Streaming and Output Validation
- **Chunk-by-Chunk Output**: Watch the AGENT.md content compile and stream directly onto your terminal stdout.
- **Automated Score Verification**: Grades the generated content against structural standards. It alerts you if mandatory sections (e.g., Overview, Tech Stack, Coding Conventions, Hard Constraints) are missing, supplying an audit check before saving.

### 4. Multi-File Exporters
Select which developer profiles you want to generate in a single run:
- **AGENT.md**: Standard conventions profile for Kiro, Cursor, and general assistants.
- **CLAUDE.md**: Developer instruction profile optimized for Claude Code.
- **.cursorrules**: Direct configuration settings for Cursor IDE.
- **.windsurfrules**: Configuration settings for Windsurf IDE.
- **copilot-instructions.md**: Custom instructions for GitHub Copilot.
- **Roadmaps and Prompts**: Option to split output to generate ROADMAP.md (a technical execution plan) and PROMPTS.md (optimized LLM blueprints).

---

## Changelog: What is new in V2?

The V2 release marks a major evolution, transitioning the project from a single web utility to a comprehensive, multi-platform monorepo architecture.

### What was in V1:
- A standalone Next.js web application.
- Basic form questions requiring manual input.
- Limited generation formats (only AGENT.md / CLAUDE.md).
- Strict dependency on DeepSeek APIs on the web server.
- No terminal execution, no offline capabilities, and no project scanning.

### What is new in V2 (This Release):
- **Bun Workspaces Monorepo**: Re-engineered from scratch into a highly optimized, three-tier monorepo structure (@agent-md/shared, @agent-md/web, and @agent-md/cli) powered by Bun.
- **Global Terminal CLI**: Published globally to npm, enabling developers to run the tool instantly anywhere via npx or global npm install.
- **New --init Command**: A fully automated, non-interactive initialization flag that sets up your project files in a single run.
- **Automatic Project Scanning**: Real-time filesystem analyzer that detects directories, parses manifests, and reads dependencies to eliminate manual data entry.
- **Expanded AI Provider Support**: Native integration with Google Gemini, xAI (Grok), and local Ollama models (enabling 100% free and offline local generation).
- **New Target Formats**: Ability to generate .cursorrules, .windsurfrules, copilot-instructions.md, ROADMAP.md, and PROMPTS.md files simultaneously.
- **Interactive Update Mode**: A dedicated command-line flag (`--update`) to modify existing AGENT.md profiles via simple text instructions.
- **Local Generation History**: Home directory logging that tracks the last 5 successful runs, complete with local preview capabilities.

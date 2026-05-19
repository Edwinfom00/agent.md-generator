#!/usr/bin/env node

// cli/index.ts
import * as p2 from "@clack/prompts";
import { existsSync, readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// src/lib/questions.ts
var QUESTIONS = [
  {
    id: "project_name",
    step: 1,
    category: "Identity",
    question: "What is the name of your project?",
    hint: "This will be the main title of your AGENT.md",
    type: "text",
    placeholder: "e.g. MyApp, Preflight, DeutschFlow...",
    required: true
  },
  {
    id: "project_type",
    step: 1,
    category: "Identity",
    question: "What type of project is this?",
    hint: "This defines the overall architecture and conventions",
    type: "select",
    required: true,
    options: [
      { value: "web_app", label: "Web Application", description: "Next.js, React, Vue, SvelteKit..." },
      { value: "mobile_app", label: "Mobile Application", description: "React Native, Expo, Flutter..." },
      { value: "vscode_extension", label: "VS Code Extension", description: "TypeScript, VS Code API..." },
      { value: "npm_package", label: "npm Package / Library", description: "TypeScript library, SDK, CLI..." },
      { value: "api_backend", label: "API / Backend", description: "Express, Fastify, NestJS, Hono..." },
      { value: "fullstack", label: "Full-Stack Application", description: "Frontend + Backend in one repo" },
      { value: "cli_tool", label: "CLI Tool", description: "Command-line application" },
      { value: "other", label: "Other", description: "Something else entirely" }
    ]
  },
  {
    id: "mobile_platforms",
    step: 1,
    category: "Identity",
    question: "What mobile platforms will you target?",
    hint: "Affects build config, testing setup, and platform-specific code conventions",
    type: "select",
    required: false,
    dependsOn: { questionId: "project_type", value: "mobile_app" },
    options: [
      { value: "ios_only", label: "iOS only", description: "Target Apple devices only" },
      { value: "android_only", label: "Android only", description: "Target Android devices only" },
      { value: "both", label: "iOS + Android", description: "Cross-platform for both" }
    ]
  },
  {
    id: "npm_distribution",
    step: 1,
    category: "Identity",
    question: "How will your package be distributed?",
    hint: "Affects build output, bundler config, and import conventions",
    type: "select",
    required: false,
    dependsOn: { questionId: "project_type", value: "npm_package" },
    options: [
      { value: "esm_only", label: "ESM only", description: "Modern ESM-only package" },
      { value: "cjs_esm", label: "CommonJS + ESM", description: "Dual-format for broad compatibility" },
      { value: "browser_node", label: "Browser + Node.js", description: "Universal package for both environments" }
    ]
  },
  {
    id: "project_description",
    step: 1,
    category: "Identity",
    question: "Describe your project in 2-3 sentences.",
    hint: "What does it do? Who is it for? What problem does it solve?",
    type: "textarea",
    placeholder: "e.g. Preflight is a VS Code extension that helps developers ship cleaner code by detecting debug statements, tracking TODOs with deadlines, and generating AI-powered commit messages...",
    required: true
  },
  {
    id: "tech_stack",
    step: 2,
    category: "Tech Stack",
    question: "What is your primary tech stack?",
    hint: "Select all that apply to your project",
    type: "multiselect",
    required: true,
    options: [
      { value: "typescript", label: "TypeScript" },
      { value: "javascript", label: "JavaScript" },
      { value: "react", label: "React" },
      { value: "nextjs", label: "Next.js" },
      { value: "react_native", label: "React Native" },
      { value: "expo", label: "Expo" },
      { value: "tailwind", label: "Tailwind CSS" },
      { value: "nodejs", label: "Node.js" },
      { value: "python", label: "Python" },
      { value: "go", label: "Go" },
      { value: "rust", label: "Rust" },
      { value: "prisma", label: "Prisma" },
      { value: "supabase", label: "Supabase" },
      { value: "vercel_ai", label: "Vercel AI SDK" },
      { value: "zustand", label: "Zustand" },
      { value: "zod", label: "Zod" }
    ]
  },
  {
    id: "ai_features",
    step: 2,
    category: "Tech Stack",
    question: "Does your project use AI / LLM features?",
    type: "select",
    required: true,
    options: [
      { value: "yes_core", label: "Yes \u2014 AI is a core feature", description: "The app is built around AI capabilities" },
      { value: "yes_secondary", label: "Yes \u2014 AI is a secondary feature", description: "AI enhances some features but is not the core" },
      { value: "no", label: "No AI features", description: "Pure logic, no LLM integration" }
    ]
  },
  {
    id: "ai_providers",
    step: 2,
    category: "Tech Stack",
    question: "Which AI providers will you use?",
    hint: "Select all that apply",
    type: "multiselect",
    required: false,
    dependsOn: { questionId: "ai_features", value: ["yes_core", "yes_secondary"] },
    options: [
      { value: "openai", label: "OpenAI" },
      { value: "anthropic", label: "Anthropic (Claude)" },
      { value: "deepseek", label: "DeepSeek" },
      { value: "google", label: "Google Gemini" },
      { value: "ollama", label: "Ollama (local)" },
      { value: "model_agnostic", label: "Model-agnostic (any provider)" }
    ]
  },
  {
    id: "python_framework",
    step: 2,
    category: "Tech Stack",
    question: "Which Python framework are you using?",
    hint: "Determines routing, ORM, and project structure conventions",
    type: "select",
    required: false,
    dependsOn: { questionId: "tech_stack", value: "python" },
    options: [
      { value: "django", label: "Django", description: "Full-stack web framework with ORM" },
      { value: "fastapi", label: "FastAPI", description: "Modern async API framework" },
      { value: "flask", label: "Flask", description: "Lightweight WSGI microframework" },
      { value: "none", label: "No framework", description: "Pure Python / scripts" }
    ]
  },
  {
    id: "folder_structure",
    step: 3,
    category: "Architecture",
    question: "Describe your folder structure.",
    hint: "List the main folders and what they contain. The AI will use this to enforce conventions.",
    type: "textarea",
    placeholder: `src/
  app/        <- Next.js App Router pages
  components/ <- reusable UI components
  lib/        <- utilities and helpers
  types/      <- TypeScript types
  hooks/      <- custom React hooks`,
    required: true
  },
  {
    id: "coding_conventions",
    step: 3,
    category: "Architecture",
    question: "What are your most important coding conventions?",
    hint: "Rules the AI must always follow when writing code for this project",
    type: "multiselect",
    required: true,
    options: [
      { value: "no_any", label: "No TypeScript any", description: "Strict typing, use unknown instead" },
      { value: "no_comments", label: "No code comments", description: "Code must be self-documenting" },
      { value: "functional", label: "Functional components only", description: "No class components" },
      { value: "server_components", label: "Prefer Server Components", description: "Use client components only when needed" },
      { value: "named_exports", label: "Named exports only", description: "No default exports" },
      { value: "small_files", label: "Small focused files", description: "One responsibility per file" },
      { value: "no_overengineering", label: "No overengineering", description: "Build the simplest thing that works" },
      { value: "modular", label: "Modular architecture", description: "Clear separation of concerns" },
      { value: "error_handling", label: "Explicit error handling", description: "Always handle errors gracefully" },
      { value: "env_secrets", label: "No secrets in frontend", description: "API keys only in server/env" }
    ]
  },
  {
    id: "ui_style",
    step: 3,
    category: "Architecture",
    question: "What is the UI style and tone?",
    hint: "How should the interface feel?",
    type: "multiselect",
    required: false,
    dependsOn: { questionId: "project_type", value: ["web_app", "mobile_app", "fullstack"] },
    options: [
      { value: "modern", label: "Modern & minimal" },
      { value: "playful", label: "Playful & friendly" },
      { value: "premium", label: "Premium & polished" },
      { value: "dark", label: "Dark theme first" },
      { value: "accessible", label: "Accessibility first" },
      { value: "mobile_first", label: "Mobile first" },
      { value: "pixel_perfect", label: "Pixel-perfect from designs" }
    ]
  },
  {
    id: "constraints",
    step: 4,
    category: "Constraints",
    question: "What are the hard constraints for this project?",
    hint: "Things the AI must NEVER do in this project",
    type: "multiselect",
    required: true,
    options: [
      { value: "no_db", label: "No database", description: "Use local state or files only" },
      { value: "no_auth", label: "No authentication", description: "No login or user accounts" },
      { value: "no_new_deps", label: "No new dependencies without approval", description: "Ask before adding packages" },
      { value: "no_telemetry", label: "No telemetry or tracking", description: "No analytics or user tracking" },
      { value: "no_breaking_changes", label: "No breaking API changes", description: "Maintain backward compatibility" },
      { value: "offline_first", label: "Offline first", description: "Must work without internet" },
      { value: "lightweight", label: "Keep it lightweight", description: "Minimize bundle size" },
      { value: "no_class_components", label: "No class components" }
    ]
  },
  {
    id: "dev_philosophy",
    step: 4,
    category: "Constraints",
    question: "What is your development philosophy?",
    hint: "How should the AI approach building features?",
    type: "select",
    required: true,
    options: [
      { value: "mvp_first", label: "MVP first, iterate later", description: "Build the smallest useful version, then improve" },
      { value: "production_grade", label: "Production-grade from day one", description: "Build it right the first time" },
      { value: "teachable", label: "Teachable & approachable", description: "Code should be easy to understand and explain" },
      { value: "performance", label: "Performance first", description: "Optimize for speed and efficiency" }
    ]
  },
  {
    id: "extra_context",
    step: 4,
    category: "Constraints",
    question: "Any additional context or special instructions?",
    hint: "Anything else the AI should know \u2014 edge cases, specific patterns, important decisions already made...",
    type: "textarea",
    placeholder: "e.g. This project uses the Vercel AI SDK for all LLM calls. The API keys are stored in .env.local and never exposed to the client. The app is deployed on Vercel...",
    required: false
  }
];
function isQuestionVisible(question, answers) {
  if (!question.dependsOn) return true;
  const { questionId, value } = question.dependsOn;
  const answer = answers[questionId];
  if (!answer) return false;
  if (Array.isArray(value)) {
    if (Array.isArray(answer)) return value.some((v) => answer.includes(v));
    return value.includes(answer);
  }
  if (Array.isArray(answer)) return answer.includes(value);
  return answer === value;
}

// src/lib/buildPrompt.ts
function getLabel(questionId, value) {
  const question = QUESTIONS.find((q) => q.id === questionId);
  if (!question?.options) return Array.isArray(value) ? value.join(", ") : value;
  if (Array.isArray(value)) {
    return value.map((v) => question.options?.find((o) => o.value === v)?.label ?? v).join(", ");
  }
  return question.options.find((o) => o.value === value)?.label ?? value;
}
function buildPrompt(answers) {
  const projectName = answers["project_name"] ?? "My Project";
  const projectType = getLabel("project_type", answers["project_type"] ?? "");
  const description = answers["project_description"] ?? "";
  const mobilePlatforms = answers["mobile_platforms"] ? getLabel("mobile_platforms", answers["mobile_platforms"]) : null;
  const npmDistribution = answers["npm_distribution"] ? getLabel("npm_distribution", answers["npm_distribution"]) : null;
  const techStack = getLabel("tech_stack", answers["tech_stack"] ?? []);
  const pythonFramework = answers["python_framework"] ? getLabel("python_framework", answers["python_framework"]) : null;
  const aiFeatures = getLabel("ai_features", answers["ai_features"] ?? "no");
  const aiProviders = answers["ai_providers"] ? getLabel("ai_providers", answers["ai_providers"]) : "None";
  const folderStructure = answers["folder_structure"] ?? "";
  const conventions = getLabel("coding_conventions", answers["coding_conventions"] ?? []);
  const uiStyle = answers["ui_style"] ? getLabel("ui_style", answers["ui_style"]) : "Not specified";
  const constraints = getLabel("constraints", answers["constraints"] ?? []);
  const devPhilosophy = getLabel("dev_philosophy", answers["dev_philosophy"] ?? "");
  const extraContext = answers["extra_context"] ?? "";
  return `You are an expert software architect. Generate a complete, detailed, and production-quality AGENT.md file for the following project.

The AGENT.md is a comprehensive engineering README that will be used by AI coding assistants (like Claude, GPT-4, Kiro, Cursor) to understand the project deeply and write code that perfectly matches the project's conventions, architecture, and constraints.

The output must be a single Markdown document. It must be thorough, specific, and actionable \u2014 not generic. Every section should contain real, project-specific content.

Use the DeutschFlow AGENT.md and Preflight AGENT.md as structural references for quality and depth. Match that level of detail.

---

PROJECT INFORMATION:

Project Name: ${projectName}
Project Type: ${projectType}${mobilePlatforms ? `
Mobile Platforms: ${mobilePlatforms}` : ""}${npmDistribution ? `
Package Distribution: ${npmDistribution}` : ""}
Description: ${description}

Tech Stack: ${techStack}${pythonFramework ? `
Python Framework: ${pythonFramework}` : ""}
AI Features: ${aiFeatures}
AI Providers: ${aiProviders}

Folder Structure:
${folderStructure}

Coding Conventions: ${conventions}
UI Style: ${uiStyle}
Hard Constraints: ${constraints}
Development Philosophy: ${devPhilosophy}
${extraContext ? `
Additional Context:
${extraContext}` : ""}

---

Generate the AGENT.md with these sections (adapt section names to fit the project):

1. A header introducing the AI assistant's role for this specific project
2. Project Identity (name, vision, what makes it unique)
3. Core Product Principles (what it does and does NOT do)
4. Important Constraints (VERY IMPORTANT section \u2014 hard rules)
5. Tech Stack (with specific versions/choices and why)
6. Folder Structure (with role of each folder/file)
7. Architecture Guidelines (patterns, naming conventions, component rules)
8. Coding Conventions (with \u2705 CORRECT and \u274C INCORRECT examples where useful)
9. TypeScript Rules (if applicable)
10. Feature Implementation Rules (step-by-step process)
11. Development Philosophy
12. Decision Making & Clarifications
13. Communication Style
14. Final Reminder

Rules for the output:
- Be specific to THIS project, not generic
- Use real code examples that match the tech stack
- Include \u2705 CORRECT / \u274C INCORRECT examples for important rules
- Use tables where they add clarity
- Keep the tone direct and professional
- No filler content \u2014 every sentence must be actionable
- The document should be long enough to be genuinely useful (aim for 600-1000 lines)
- Output ONLY the Markdown content, no preamble, no explanation`;
}

// cli/generate.ts
import { createDeepSeek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
async function callDeepSeek(apiKey, prompt) {
  const deepseek = createDeepSeek({ apiKey });
  const { text: text2 } = await generateText({
    model: deepseek("deepseek-chat"),
    prompt,
    temperature: 0.3,
    maxOutputTokens: 8e3
  });
  return text2;
}

// cli/prompts.ts
import * as p from "@clack/prompts";
async function promptQuestion(question) {
  const message = question.hint ? `${question.question}
  ${question.hint}` : question.question;
  switch (question.type) {
    case "text":
    case "textarea":
      return p.text({
        message,
        placeholder: question.placeholder,
        validate: question.required ? (v) => v.trim() === "" ? "This field is required." : void 0 : void 0
      });
    case "select":
      return p.select({
        message,
        options: (question.options ?? []).map((o) => ({
          value: o.value,
          label: o.label,
          hint: o.description
        }))
      });
    case "multiselect":
      return p.multiselect({
        message,
        options: (question.options ?? []).map((o) => ({
          value: o.value,
          label: o.label,
          hint: o.description
        })),
        required: question.required
      });
  }
}

// cli/index.ts
function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return;
  const lines = readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const val = trimmed.slice(eqIndex + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}
async function main() {
  loadEnvLocal();
  console.clear();
  p2.intro("  agent-md-generator  ");
  const apiKey = process.env["DEEPSEEK_API_KEY"];
  if (!apiKey) {
    p2.cancel(
      "DEEPSEEK_API_KEY is not set. Add it to .env.local or export it in your shell."
    );
    process.exit(1);
  }
  const answers = {};
  for (const question of QUESTIONS) {
    if (!isQuestionVisible(question, answers)) continue;
    const value = await promptQuestion(question);
    if (p2.isCancel(value)) {
      p2.cancel("Cancelled.");
      process.exit(0);
    }
    if (value !== void 0 && (typeof value !== "string" || value !== "")) {
      answers[question.id] = value;
    }
  }
  const s = p2.spinner();
  s.start("Generating your AGENT.md with DeepSeek...");
  try {
    const content = await callDeepSeek(apiKey, buildPrompt(answers));
    const outputPath = resolve(process.cwd(), "AGENT.md");
    writeFileSync(outputPath, content, "utf-8");
    s.stop("Done!");
    p2.outro(`AGENT.md written to ${outputPath}`);
  } catch (err) {
    s.stop("Generation failed.");
    p2.cancel(err instanceof Error ? err.message : "Unknown error");
    process.exit(1);
  }
}
main();

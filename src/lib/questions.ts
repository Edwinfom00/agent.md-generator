import type { Question } from '@/types'

export const QUESTIONS: Question[] = [
  {
    id: 'project_name',
    step: 1,
    category: 'Identity',
    question: 'What is the name of your project?',
    hint: 'This will be the main title of your AGENT.md',
    type: 'text',
    placeholder: 'e.g. MyApp, Preflight, DeutschFlow...',
    required: true,
  },
  {
    id: 'project_type',
    step: 1,
    category: 'Identity',
    question: 'What type of project is this?',
    hint: 'This defines the overall architecture and conventions',
    type: 'select',
    required: true,
    options: [
      { value: 'web_app', label: 'Web Application', description: 'Next.js, React, Vue, SvelteKit...' },
      { value: 'mobile_app', label: 'Mobile Application', description: 'React Native, Expo, Flutter...' },
      { value: 'vscode_extension', label: 'VS Code Extension', description: 'TypeScript, VS Code API...' },
      { value: 'npm_package', label: 'npm Package / Library', description: 'TypeScript library, SDK, CLI...' },
      { value: 'api_backend', label: 'API / Backend', description: 'Express, Fastify, NestJS, Hono...' },
      { value: 'fullstack', label: 'Full-Stack Application', description: 'Frontend + Backend in one repo' },
      { value: 'cli_tool', label: 'CLI Tool', description: 'Command-line application' },
      { value: 'other', label: 'Other', description: 'Something else entirely' },
    ],
  },
  {
    id: 'project_description',
    step: 1,
    category: 'Identity',
    question: 'Describe your project in 2-3 sentences.',
    hint: 'What does it do? Who is it for? What problem does it solve?',
    type: 'textarea',
    placeholder:
      'e.g. Preflight is a VS Code extension that helps developers ship cleaner code by detecting debug statements, tracking TODOs with deadlines, and generating AI-powered commit messages...',
    required: true,
  },
  {
    id: 'tech_stack',
    step: 2,
    category: 'Tech Stack',
    question: 'What is your primary tech stack?',
    hint: 'Select all that apply to your project',
    type: 'multiselect',
    required: true,
    options: [
      { value: 'typescript', label: 'TypeScript' },
      { value: 'javascript', label: 'JavaScript' },
      { value: 'react', label: 'React' },
      { value: 'nextjs', label: 'Next.js' },
      { value: 'react_native', label: 'React Native' },
      { value: 'expo', label: 'Expo' },
      { value: 'tailwind', label: 'Tailwind CSS' },
      { value: 'nodejs', label: 'Node.js' },
      { value: 'python', label: 'Python' },
      { value: 'go', label: 'Go' },
      { value: 'rust', label: 'Rust' },
      { value: 'prisma', label: 'Prisma' },
      { value: 'supabase', label: 'Supabase' },
      { value: 'vercel_ai', label: 'Vercel AI SDK' },
      { value: 'zustand', label: 'Zustand' },
      { value: 'zod', label: 'Zod' },
    ],
  },
  {
    id: 'ai_features',
    step: 2,
    category: 'Tech Stack',
    question: 'Does your project use AI / LLM features?',
    type: 'select',
    required: true,
    options: [
      { value: 'yes_core', label: 'Yes — AI is a core feature', description: 'The app is built around AI capabilities' },
      { value: 'yes_secondary', label: 'Yes — AI is a secondary feature', description: 'AI enhances some features but is not the core' },
      { value: 'no', label: 'No AI features', description: 'Pure logic, no LLM integration' },
    ],
  },
  {
    id: 'ai_providers',
    step: 2,
    category: 'Tech Stack',
    question: 'Which AI providers will you use?',
    hint: 'Select all that apply',
    type: 'multiselect',
    required: false,
    dependsOn: { questionId: 'ai_features', value: ['yes_core', 'yes_secondary'] },
    options: [
      { value: 'openai', label: 'OpenAI' },
      { value: 'anthropic', label: 'Anthropic (Claude)' },
      { value: 'deepseek', label: 'DeepSeek' },
      { value: 'google', label: 'Google Gemini' },
      { value: 'ollama', label: 'Ollama (local)' },
      { value: 'model_agnostic', label: 'Model-agnostic (any provider)' },
    ],
  },
  {
    id: 'folder_structure',
    step: 3,
    category: 'Architecture',
    question: 'Describe your folder structure.',
    hint: 'List the main folders and what they contain. The AI will use this to enforce conventions.',
    type: 'textarea',
    placeholder: `src/
  app/        <- Next.js App Router pages
  components/ <- reusable UI components
  lib/        <- utilities and helpers
  types/      <- TypeScript types
  hooks/      <- custom React hooks`,
    required: true,
  },
  {
    id: 'coding_conventions',
    step: 3,
    category: 'Architecture',
    question: 'What are your most important coding conventions?',
    hint: 'Rules the AI must always follow when writing code for this project',
    type: 'multiselect',
    required: true,
    options: [
      { value: 'no_any', label: 'No TypeScript any', description: 'Strict typing, use unknown instead' },
      { value: 'no_comments', label: 'No code comments', description: 'Code must be self-documenting' },
      { value: 'functional', label: 'Functional components only', description: 'No class components' },
      { value: 'server_components', label: 'Prefer Server Components', description: 'Use client components only when needed' },
      { value: 'named_exports', label: 'Named exports only', description: 'No default exports' },
      { value: 'small_files', label: 'Small focused files', description: 'One responsibility per file' },
      { value: 'no_overengineering', label: 'No overengineering', description: 'Build the simplest thing that works' },
      { value: 'modular', label: 'Modular architecture', description: 'Clear separation of concerns' },
      { value: 'error_handling', label: 'Explicit error handling', description: 'Always handle errors gracefully' },
      { value: 'env_secrets', label: 'No secrets in frontend', description: 'API keys only in server/env' },
    ],
  },
  {
    id: 'ui_style',
    step: 3,
    category: 'Architecture',
    question: 'What is the UI style and tone?',
    hint: 'How should the interface feel?',
    type: 'multiselect',
    required: false,
    dependsOn: { questionId: 'project_type', value: ['web_app', 'mobile_app', 'fullstack'] },
    options: [
      { value: 'modern', label: 'Modern & minimal' },
      { value: 'playful', label: 'Playful & friendly' },
      { value: 'premium', label: 'Premium & polished' },
      { value: 'dark', label: 'Dark theme first' },
      { value: 'accessible', label: 'Accessibility first' },
      { value: 'mobile_first', label: 'Mobile first' },
      { value: 'pixel_perfect', label: 'Pixel-perfect from designs' },
    ],
  },
  {
    id: 'constraints',
    step: 4,
    category: 'Constraints',
    question: 'What are the hard constraints for this project?',
    hint: 'Things the AI must NEVER do in this project',
    type: 'multiselect',
    required: true,
    options: [
      { value: 'no_db', label: 'No database', description: 'Use local state or files only' },
      { value: 'no_auth', label: 'No authentication', description: 'No login or user accounts' },
      { value: 'no_new_deps', label: 'No new dependencies without approval', description: 'Ask before adding packages' },
      { value: 'no_telemetry', label: 'No telemetry or tracking', description: 'No analytics or user tracking' },
      { value: 'no_breaking_changes', label: 'No breaking API changes', description: 'Maintain backward compatibility' },
      { value: 'offline_first', label: 'Offline first', description: 'Must work without internet' },
      { value: 'lightweight', label: 'Keep it lightweight', description: 'Minimize bundle size' },
      { value: 'no_class_components', label: 'No class components' },
    ],
  },
  {
    id: 'dev_philosophy',
    step: 4,
    category: 'Constraints',
    question: 'What is your development philosophy?',
    hint: 'How should the AI approach building features?',
    type: 'select',
    required: true,
    options: [
      { value: 'mvp_first', label: 'MVP first, iterate later', description: 'Build the smallest useful version, then improve' },
      { value: 'production_grade', label: 'Production-grade from day one', description: 'Build it right the first time' },
      { value: 'teachable', label: 'Teachable & approachable', description: 'Code should be easy to understand and explain' },
      { value: 'performance', label: 'Performance first', description: 'Optimize for speed and efficiency' },
    ],
  },
  {
    id: 'extra_context',
    step: 4,
    category: 'Constraints',
    question: 'Any additional context or special instructions?',
    hint: 'Anything else the AI should know — edge cases, specific patterns, important decisions already made...',
    type: 'textarea',
    placeholder:
      'e.g. This project uses the Vercel AI SDK for all LLM calls. The API keys are stored in .env.local and never exposed to the client. The app is deployed on Vercel...',
    required: false,
  },
]

export const TOTAL_STEPS = 4

export const STEP_LABELS: Record<number, string> = {
  1: 'Identity',
  2: 'Tech Stack',
  3: 'Architecture',
  4: 'Constraints',
}

export function getQuestionsForStep(step: number): Question[] {
  return QUESTIONS.filter(q => q.step === step)
}

export function isQuestionVisible(
  question: Question,
  answers: Record<string, string | string[]>,
): boolean {
  if (!question.dependsOn) return true
  const { questionId, value } = question.dependsOn
  const answer = answers[questionId]
  if (!answer) return false
  if (Array.isArray(value)) {
    if (Array.isArray(answer)) return value.some(v => answer.includes(v))
    return value.includes(answer as string)
  }
  if (Array.isArray(answer)) return answer.includes(value as string)
  return answer === value
}

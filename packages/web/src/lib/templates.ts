import type { WizardAnswers } from '@/types'

export interface Template {
  id: string
  name: string
  description: string
  stack: string
  answers: Partial<WizardAnswers>
}

export const TEMPLATES: Template[] = [
  {
    id: 'nextjs_saas',
    name: 'Next.js SaaS',
    description: 'Full-stack web app with authentication, database, and modern UI',
    stack: 'TypeScript · React · Next.js · Tailwind · Prisma · Supabase',
    answers: {
      project_type: 'web_app',
      tech_stack: ['typescript', 'react', 'nextjs', 'tailwind', 'prisma', 'supabase'],
      ai_features: 'no',
      coding_conventions: ['no_any', 'functional', 'server_components', 'named_exports', 'env_secrets'],
      dev_philosophy: 'production_grade',
      constraints: ['no_telemetry'],
      ui_style: ['modern', 'accessible'],
    },
  },
  {
    id: 'api_backend',
    name: 'API Backend Node.js',
    description: 'Lightweight REST or RPC backend with schema validation',
    stack: 'TypeScript · Node.js · Fastify / Hono · Zod',
    answers: {
      project_type: 'api_backend',
      tech_stack: ['typescript', 'nodejs', 'zod'],
      ai_features: 'no',
      coding_conventions: ['no_any', 'named_exports', 'small_files', 'error_handling', 'env_secrets'],
      dev_philosophy: 'production_grade',
      constraints: ['no_new_deps'],
    },
  },
  {
    id: 'mobile_rn',
    name: 'Mobile React Native',
    description: 'Cross-platform mobile app for iOS and Android',
    stack: 'TypeScript · React Native · Expo',
    answers: {
      project_type: 'mobile_app',
      tech_stack: ['typescript', 'react', 'react_native', 'expo'],
      ai_features: 'no',
      coding_conventions: ['no_any', 'functional', 'named_exports'],
      dev_philosophy: 'mvp_first',
      constraints: ['lightweight'],
      ui_style: ['mobile_first', 'accessible'],
    },
  },
  {
    id: 'fullstack_monorepo',
    name: 'Full-Stack Monorepo',
    description: 'Frontend and backend in one repo, sharing types and tooling',
    stack: 'TypeScript · React · Next.js · Node.js · Prisma',
    answers: {
      project_type: 'fullstack',
      tech_stack: ['typescript', 'react', 'nextjs', 'nodejs', 'prisma'],
      ai_features: 'no',
      coding_conventions: ['no_any', 'functional', 'named_exports', 'modular', 'env_secrets'],
      dev_philosophy: 'production_grade',
      constraints: ['no_new_deps', 'no_telemetry'],
      ui_style: ['modern'],
    },
  },
  {
    id: 'cli_tool',
    name: 'CLI Tool',
    description: 'Command-line application distributed via npm',
    stack: 'TypeScript · Node.js',
    answers: {
      project_type: 'cli_tool',
      tech_stack: ['typescript', 'nodejs', 'zod'],
      ai_features: 'no',
      coding_conventions: ['no_any', 'named_exports', 'small_files', 'error_handling'],
      dev_philosophy: 'mvp_first',
      constraints: ['lightweight', 'offline_first'],
    },
  },
]

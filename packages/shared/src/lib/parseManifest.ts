const PACKAGE_TO_STACK: Record<string, string> = {
  next: 'nextjs',
  react: 'react',
  'react-dom': 'react',
  'react-native': 'react_native',
  expo: 'expo',
  tailwindcss: 'tailwind',
  '@prisma/client': 'prisma',
  prisma: 'prisma',
  '@supabase/supabase-js': 'supabase',
  zustand: 'zustand',
  zod: 'zod',
  ai: 'vercel_ai',
  '@ai-sdk/openai': 'vercel_ai',
  '@ai-sdk/anthropic': 'vercel_ai',
  '@ai-sdk/deepseek': 'vercel_ai',
  '@ai-sdk/google': 'vercel_ai',
  '@ai-sdk/xai': 'vercel_ai',
  typescript: 'typescript',
}

const REQUIREMENTS_TO_STACK: Record<string, string> = {
  django: 'python',
  flask: 'python',
  fastapi: 'python',
  uvicorn: 'python',
  sqlalchemy: 'python',
  pytest: 'python',
  pydantic: 'python',
  numpy: 'python',
  pandas: 'python',
}

function parsePackageJson(text: string): string[] {
  try {
    const pkg = JSON.parse(text) as {
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }
    const deps = pkg.dependencies && typeof pkg.dependencies === 'object' ? pkg.dependencies : {}
    const devDeps = pkg.devDependencies && typeof pkg.devDependencies === 'object' ? pkg.devDependencies : {}
    const allDeps = { ...deps, ...devDeps }
    const found = new Set<string>(['nodejs'])

    for (const dep of Object.keys(allDeps)) {
      const mapped = PACKAGE_TO_STACK[dep]
      if (mapped) found.add(mapped)
    }

    return Array.from(found)
  } catch {
    return []
  }
}

function parseRequirementsTxt(text: string): string[] {
  const found = new Set<string>()

  for (const line of text.split('\n')) {
    const pkg = line.split(/[>=<!]/)[0].trim().toLowerCase()
    if (!pkg || pkg.startsWith('#')) continue
    const mapped = REQUIREMENTS_TO_STACK[pkg]
    if (mapped) found.add(mapped)
  }

  if (found.size > 0) found.add('python')

  return Array.from(found)
}

export function parseManifest(filename: string, text: string): string[] {
  if (filename === 'package.json' || filename.endsWith('/package.json')) return parsePackageJson(text)
  if (filename === 'requirements.txt' || filename.endsWith('/requirements.txt')) return parseRequirementsTxt(text)
  return []
}

export function parsePackageJsonMeta(text: string): { name?: string; description?: string } {
  try {
    const pkg = JSON.parse(text) as { name?: string; description?: string }
    return { name: pkg.name, description: pkg.description }
  } catch {
    return {}
  }
}

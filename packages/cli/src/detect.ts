import * as p from '@clack/prompts'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { basename, extname, join, relative } from 'node:path'
import { parseManifest, parsePackageJsonMeta } from '@agent-md/shared'

const IGNORE_DIRS = new Set([
  'node_modules',
  '.git',
  '.next',
  'dist',
  'build',
  'out',
  '.turbo',
  '.cache',
  '__pycache__',
  '.venv',
  'venv',
  '.env',
  'env',
  'target',
  'vendor',
  '.cargo',
  'coverage',
  '.nyc_output',
  'storybook-static',
  '.vercel',
  '.swc',
  'tmp',
  '.tmp',
])

const IGNORE_EXTS = new Set([
  '.png', '.jpg', '.jpeg', '.gif', '.ico', '.webp', '.avif', '.svg',
  '.ttf', '.woff', '.woff2', '.eot', '.otf',
  '.exe', '.dll', '.so', '.dylib', '.wasm',
  '.zip', '.tar', '.gz', '.rar', '.7z', '.bz2',
  '.pdf', '.mp4', '.mp3', '.mov', '.avi', '.wav',
  '.tsbuildinfo', '.DS_Store', '.pyc',
  '.db', '.sqlite', '.sqlite3',
  '.bin', '.dat', '.lock',
])

const IGNORE_FILES = new Set([
  'package-lock.json',
  'yarn.lock',
  'pnpm-lock.yaml',
  'poetry.lock',
  'bun.lockb',
  'Cargo.lock',
  '.DS_Store',
  'Thumbs.db',
  '.gitkeep',
  'next-env.d.ts',
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
])

const PROJECT_MARKERS: Record<string, 'npm' | 'python' | 'go' | 'rust'> = {
  'package.json': 'npm',
  'pyproject.toml': 'python',
  'requirements.txt': 'python',
  'go.mod': 'go',
  'Cargo.toml': 'rust',
}

const MAX_DEPTH = 6
const MAX_FILES_PER_DIR = 40

export interface DetectResult {
  rootPath: string
  tree: string
  techStack: string[]
  projectName: string
  description: string
  manifestType: 'npm' | 'python' | 'go' | 'rust' | 'unknown'
}

function buildTree(dirPath: string, prefix = '', depth = 0): string {
  if (depth > MAX_DEPTH) return ''

  let entries: string[]
  try {
    entries = readdirSync(dirPath)
  } catch {
    return ''
  }

  const dirs: string[] = []
  const files: string[] = []

  for (const entry of entries) {
    if (entry.startsWith('.') && entry !== '.env.example' && entry !== '.gitignore') {
      if (IGNORE_DIRS.has(entry)) continue
    }
    if (IGNORE_DIRS.has(entry)) continue
    if (IGNORE_FILES.has(entry)) continue

    const ext = extname(entry).toLowerCase()
    if (IGNORE_EXTS.has(ext)) continue

    const fullPath = join(dirPath, entry)
    let stat
    try {
      stat = statSync(fullPath)
    } catch {
      continue
    }

    if (stat.isDirectory()) {
      dirs.push(entry)
    } else {
      files.push(entry)
    }
  }

  const lines: string[] = []

  const allEntries = [...dirs.sort(), ...files.sort()].slice(0, MAX_FILES_PER_DIR)

  for (let i = 0; i < allEntries.length; i++) {
    const entry = allEntries[i]
    const isLast = i === allEntries.length - 1
    const isDir = dirs.includes(entry)
    const connector = isLast ? '└── ' : '├── '
    const childPrefix = prefix + (isLast ? '    ' : '│   ')

    if (isDir) {
      lines.push(`${prefix}${connector}${entry}/`)
      const sub = buildTree(join(dirPath, entry), childPrefix, depth + 1)
      if (sub) lines.push(sub)
    } else {
      lines.push(`${prefix}${connector}${entry}`)
    }
  }

  return lines.join('\n')
}

function detectMarker(rootPath: string): { type: 'npm' | 'python' | 'go' | 'rust' | 'unknown'; file?: string } {
  for (const [marker, type] of Object.entries(PROJECT_MARKERS)) {
    if (existsSync(join(rootPath, marker))) {
      return { type, file: marker }
    }
  }
  return { type: 'unknown' }
}

function isEmptyish(rootPath: string): boolean {
  try {
    const entries = readdirSync(rootPath).filter(e => !e.startsWith('.'))
    return entries.length === 0
  } catch {
    return false
  }
}

export async function detectProject(startPath: string): Promise<DetectResult> {
  let rootPath = startPath

  if (isEmptyish(rootPath)) {
    p.log.warn('The current directory seems empty or does not contain a project.')
    const entered = await p.text({
      message: 'Path to your project (absolute or relative):',
      placeholder: 'e.g. ../my-project or C:/Users/you/projects/my-app',
      validate: (v) => {
        if (!v.trim()) return 'Project path is required.'
        if (!existsSync(v.trim())) return `Directory not found: ${v.trim()}`
      },
    })
    if (p.isCancel(entered)) {
      p.cancel('Cancelled.')
      process.exit(0)
    }
    rootPath = entered.trim()
  }

  const { type: manifestType, file: manifestFile } = detectMarker(rootPath)

  let techStack: string[] = []
  let projectName = basename(rootPath)
  let description = ''

  if (manifestFile) {
    const manifestPath = join(rootPath, manifestFile)
    try {
      const content = readFileSync(manifestPath, 'utf-8')
      techStack = parseManifest(manifestFile, content)

      if (manifestFile === 'package.json') {
        const meta = parsePackageJsonMeta(content)
        if (meta.name) projectName = meta.name
        if (meta.description) description = meta.description
      } else if (manifestFile === 'go.mod') {
        const match = content.match(/^module\s+(\S+)/m)
        if (match) projectName = match[1].split('/').pop() ?? projectName
      } else if (manifestFile === 'Cargo.toml') {
        const nameMatch = content.match(/^\s*name\s*=\s*"([^"]+)"/m)
        if (nameMatch) projectName = nameMatch[1]
      }
    } catch {
      // silently ignore read errors
    }
  }

  const rootLine = `${basename(rootPath)}/`
  const childTree = buildTree(rootPath)
  const tree = childTree ? `${rootLine}\n${childTree}` : rootLine

  return { rootPath, tree, techStack, projectName, description, manifestType }
}

/**
 * Fuzzy section detection — matches headings that *contain* the keyword,
 * regardless of surrounding words or casing. This prevents false warnings
 * when DeepSeek uses enriched titles like "## Important Constraints" or
 * "## Architecture Guidelines" instead of the bare section name.
 */
const SECTION_GROUPS: { label: string; patterns: string[] }[] = [
  {
    label: 'Tech Stack',
    patterns: ['tech stack', 'technology', 'dependencies', 'stack'],
  },
  {
    label: 'Architecture / Structure',
    patterns: ['architecture', 'folder structure', 'project structure', 'structure', 'layout'],
  },
  {
    label: 'Constraints',
    patterns: ['constraint', 'hard rule', 'never do', 'restriction', 'must not', 'do not'],
  },
  {
    label: 'Coding Conventions',
    patterns: ['coding convention', 'code style', 'convention', 'style guide'],
  },
  {
    label: 'Commands / Workflow',
    patterns: ['command', 'script', 'workflow', 'build', 'run ', 'development setup', 'getting started'],
  },
  {
    label: 'Philosophy',
    patterns: ['philosophy', 'principle', 'approach', 'mindset', 'development philosophy'],
  },
  {
    label: 'Identity / Overview',
    patterns: ['identity', 'overview', 'project identity', 'vision', 'what it does', 'introduction'],
  },
]

const MIN_LENGTH = 2000
const MIN_SECTIONS = 5

export interface ValidationResult {
  warnings: string[]
}

function isSectionPresent(content: string, patterns: string[]): boolean {
  return patterns.some(pattern =>
    new RegExp(`#{1,3}\\s+[^\\n]*${pattern}`, 'i').test(content),
  )
}

export function validateOutput(content: string): ValidationResult {
  const warnings: string[] = []

  if (content.length < MIN_LENGTH) {
    warnings.push(
      `Generated file is too short (${content.length} chars — expected ≥ ${MIN_LENGTH}). The output may be incomplete.`,
    )
  }

  const results = SECTION_GROUPS.map(g => ({
    label: g.label,
    present: isSectionPresent(content, g.patterns),
  }))

  const presentCount = results.filter(r => r.present).length
  const missing = results.filter(r => !r.present).map(r => r.label)

  if (presentCount < MIN_SECTIONS) {
    warnings.push(
      `Only ${presentCount}/${SECTION_GROUPS.length} expected sections found. Missing: ${missing.join(', ')}.`,
    )
  }

  return { warnings }
}

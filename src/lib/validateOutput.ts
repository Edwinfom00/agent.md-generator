const EXPECTED_SECTIONS = [
  '## Tech Stack',
  '## Architecture',
  '## Constraints',
  '## Coding Conventions',
  '## Commands',
  '## Project Structure',
  '## Philosophy',
]

const MIN_LENGTH = 2000
const MIN_SECTIONS = 6

export interface ValidationResult {
  warnings: string[]
}

export function validateOutput(content: string): ValidationResult {
  const warnings: string[] = []

  if (content.length < MIN_LENGTH) {
    warnings.push(
      `Generated file is too short (${content.length} chars — expected ≥ ${MIN_LENGTH}). The output may be incomplete.`,
    )
  }

  const present = EXPECTED_SECTIONS.filter(s => content.includes(s))
  if (present.length < MIN_SECTIONS) {
    const missing = EXPECTED_SECTIONS.filter(s => !content.includes(s))
    warnings.push(
      `Only ${present.length}/${EXPECTED_SECTIONS.length} expected sections found. Missing: ${missing.join(', ')}.`,
    )
  }

  return { warnings }
}

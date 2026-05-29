import type { WizardAnswers } from '../types/index.js'

const BASE_LINES = 120
const PER_ANSWER_LINES: Record<string, number> = {
  project_name: 5,
  project_type: 15,
  project_description: 30,
  tech_stack: 40,
  ai_features: 10,
  ai_providers: 20,
  ui_style: 15,
  folder_structure: 60,
  coding_conventions: 50,
  constraints: 40,
  dev_philosophy: 20,
  team_size: 10,
}

export function estimateOutputLines(answers: WizardAnswers): number {
  let total = BASE_LINES
  for (const [key, value] of Object.entries(answers)) {
    const weight = PER_ANSWER_LINES[key] ?? 10
    if (Array.isArray(value) && value.length > 0) {
      total += weight + (value.length - 1) * 8
    } else if (typeof value === 'string' && value.trim()) {
      const bonus = Math.min(Math.floor(value.length / 20), 20)
      total += weight + bonus
    }
  }
  return Math.min(total, 1000)
}

export interface SectionResult {
  label: string
  present: boolean
}

export interface OutputScore {
  found: number
  total: number
  sections: SectionResult[]
}

const CANONICAL_SECTIONS = [
  'Tech Stack',
  'Architecture',
  'Constraints',
  'Coding Conventions',
  'Development Philosophy',
  'Folder Structure',
  'TypeScript',
  'Feature Implementation',
  'Decision Making',
  'Communication Style',
  'Testing',
  'Security',
]

export function scoreOutput(content: string): OutputScore {
  const sections = CANONICAL_SECTIONS.map(label => ({
    label,
    present: new RegExp(`#{1,3}\\s+[^\\n]*${label}`, 'i').test(content),
  }))
  return {
    found: sections.filter(s => s.present).length,
    total: sections.length,
    sections,
  }
}

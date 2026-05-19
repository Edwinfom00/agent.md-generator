export interface OutputFormat {
  label: string
  filename: string
  tool: string
}

export const OUTPUT_FORMATS: OutputFormat[] = [
  { label: 'AGENT.md', filename: 'AGENT.md', tool: 'Kiro' },
  { label: 'CLAUDE.md', filename: 'CLAUDE.md', tool: 'Claude Code' },
  { label: '.cursorrules', filename: '.cursorrules', tool: 'Cursor' },
  { label: '.windsurfrules', filename: '.windsurfrules', tool: 'Windsurf' },
  { label: 'copilot-instructions.md', filename: 'copilot-instructions.md', tool: 'GitHub Copilot' },
]

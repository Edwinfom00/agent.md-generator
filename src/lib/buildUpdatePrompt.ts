export function buildUpdatePrompt(existingContent: string, changeDescription: string): string {
  return `You are an expert software architect. You are updating an existing AGENT.md file based on specific change instructions.

CHANGE INSTRUCTIONS:
${changeDescription}

---

EXISTING AGENT.md:
${existingContent}

---

Rules:
- Apply ONLY the changes described in the instructions
- Keep all existing sections, content, and formatting that are NOT mentioned in the change instructions
- If adding a new section, insert it at the most logical position within the document structure
- If updating a section, preserve its heading style and all surrounding context
- Maintain the exact same tone, document style, and formatting conventions as the original
- Use the same ✅ CORRECT / ❌ INCORRECT example style if the original uses it
- Keep the same heading hierarchy (# / ## / ###)
- The output must be the COMPLETE updated document — not a diff, not just the changed sections
- Output ONLY the Markdown content, no preamble, no commentary, no explanation`
}

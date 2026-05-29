export function buildUpdatePrompt(existingContent: string, changeDescription: string): string {
  return `You are an expert software architect. You are updating an existing AGENT.md file based on specific change instructions.

CHANGE INSTRUCTIONS FROM THE USER:
${changeDescription}

---

EXISTING AGENT.md (TO BE UPDATED):
${existingContent}

---

CRITICAL REQUIREMENTS FOR THE UPDATE:
1. STRICT PRESERVATION: Do NOT delete, summarize, truncate, or omit any section, paragraph, rule, list item, or code snippet from the original document unless the change instructions explicitly demand its removal. Everything else must remain 100% intact.
2. TARGETED MODIFICATION: Only modify the specific parts of the document that are directly relevant to the user's change instructions.
3. CONTEXT INTEGRATION: If adding a new section, insert it at the most logical position within the document structure (e.g. adding a "Testing" section right after "Coding Conventions" or "Tech Stack").
4. MAINTAIN STYLE: Keep the exact same tone, document layout, formatting, and markdown styles. If the original uses a specific visual style like checklist boxes [ ] or correct/incorrect emoji blocks (✅ CORRECT / ❌ INCORRECT), you MUST use that exact same style for the new content.
5. HEADING HIERARCHY: Maintain the same markdown heading nesting (e.g., #, ##, ###).
6. COMPLETE OUTPUT: You must output the ENTIRE updated AGENT.md file from start to finish. Do NOT output a diff, do NOT output only the modified parts, and do NOT truncate the document with placeholders like "... [rest of document] ...".
7. CLEAN MARKDOWN: Output ONLY valid Markdown. Do NOT wrap the markdown in a code block, do NOT write any intro/outro explanations, and do NOT include any conversational responses. Start immediately with the updated content.`
}

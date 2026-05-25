import type { WizardAnswers } from '@/types'
import { QUESTIONS } from './questions'

function getLabel(questionId: string, value: string | string[]): string {
  const question = QUESTIONS.find(q => q.id === questionId)
  if (!question?.options) return Array.isArray(value) ? value.join(', ') : value

  if (Array.isArray(value)) {
    return value
      .map(v => question.options?.find(o => o.value === v)?.label ?? v)
      .join(', ')
  }
  return question.options.find(o => o.value === value)?.label ?? value
}

export function buildPrompt(answers: WizardAnswers): string {
  const projectName = answers['project_name'] as string ?? 'My Project'
  const projectType = getLabel('project_type', answers['project_type'] ?? '')
  const description = answers['project_description'] as string ?? ''
  const mobilePlatforms = answers['mobile_platforms'] ? getLabel('mobile_platforms', answers['mobile_platforms']) : null
  const npmDistribution = answers['npm_distribution'] ? getLabel('npm_distribution', answers['npm_distribution']) : null
  const techStack = getLabel('tech_stack', answers['tech_stack'] ?? [])
  const pythonFramework = answers['python_framework'] ? getLabel('python_framework', answers['python_framework']) : null
  const aiFeatures = getLabel('ai_features', answers['ai_features'] ?? 'no')
  const aiProviders = answers['ai_providers'] ? getLabel('ai_providers', answers['ai_providers']) : 'None'
  const folderStructure = answers['folder_structure'] as string ?? ''
  const conventions = getLabel('coding_conventions', answers['coding_conventions'] ?? [])
  const uiStyle = answers['ui_style'] ? getLabel('ui_style', answers['ui_style']) : 'Not specified'
  const constraints = getLabel('constraints', answers['constraints'] ?? [])
  const devPhilosophy = getLabel('dev_philosophy', answers['dev_philosophy'] ?? '')
  const extraContext = answers['extra_context'] as string ?? ''
  const initProject = answers['initialize_project'] === 'yes'

  let systemPrompt = `You are an expert software architect. Generate a complete, detailed, and production-quality AGENT.md file for the following project.

The AGENT.md is a comprehensive engineering README that will be used by AI coding assistants (like Claude, GPT-4, Kiro, Cursor) to understand the project deeply and write code that perfectly matches the project's conventions, architecture, and constraints.

The output must be a single Markdown document. It must be thorough, specific, and actionable — not generic. Every section should contain real, project-specific content.

Use the DeutschFlow AGENT.md and Preflight AGENT.md as structural references for quality and depth. Match that level of detail.

---

PROJECT INFORMATION:

Project Name: ${projectName}
Project Type: ${projectType}${mobilePlatforms ? `\nMobile Platforms: ${mobilePlatforms}` : ''}${npmDistribution ? `\nPackage Distribution: ${npmDistribution}` : ''}
Description: ${description}

Tech Stack: ${techStack}${pythonFramework ? `\nPython Framework: ${pythonFramework}` : ''}
AI Features: ${aiFeatures}
AI Providers: ${aiProviders}

Folder Structure:
${folderStructure}

Coding Conventions: ${conventions}
UI Style: ${uiStyle}
Hard Constraints: ${constraints}
Development Philosophy: ${devPhilosophy}
${extraContext ? `\nAdditional Context:\n${extraContext}` : ''}

---

Generate the AGENT.md with these sections (adapt section names to fit the project):

1. A header introducing the AI assistant's role for this specific project
2. Project Identity (name, vision, what makes it unique)
3. Core Product Principles (what it does and does NOT do)
4. Important Constraints (VERY IMPORTANT section — hard rules)
5. Tech Stack (with specific versions/choices and why)
6. Folder Structure (with role of each folder/file)
7. Architecture Guidelines (patterns, naming conventions, component rules)
8. Coding Conventions (with ✅ CORRECT and ❌ INCORRECT examples where useful)
9. TypeScript Rules (if applicable)
10. Feature Implementation Rules (step-by-step process)
11. Development Philosophy
12. Decision Making & Clarifications
13. Communication Style
14. Final Reminder

Rules for the output:
- Be specific to THIS project, not generic
- Use real code examples that match the tech stack
- Include ✅ CORRECT / ❌ INCORRECT examples for important rules
- Use tables where they add clarity
- Keep the tone direct and professional
- No filler content — every sentence must be actionable
- The document should be long enough to be genuinely useful (aim for 600-1000 lines)`

  if (initProject) {
    systemPrompt += `

================================================================================
CRITICAL WORKSPACE INITIALIZATION FILES REQUESTED
================================================================================
Because the user selected "Yes" to project initialization, in addition to the AGENT.md file, you MUST generate two other files: ROADMAP.md and PROMPTS.md.
You MUST output ALL THREE FILES inside a single response, separated EXACTLY by these custom line-delimiters (do not wrap the delimiters in code blocks, write them as plain text on their own lines):

===AGENT_MD===
[Place the complete AGENT.md text here]
===ROADMAP_MD===
[Place the complete, highly detailed ROADMAP.md text here]
===PROMPTS_MD===
[Place the complete, advanced PROMPTS.md text here]

--------------------------------------------------------------------------------
SPECIFIC FILE REQUIREMENTS:
--------------------------------------------------------------------------------

1. ROADMAP.md:
   - Must be a highly detailed, highly technical project implementation roadmap.
   - Break down the target product features into clear, logical milestones and phases.
   - For each feature/task, list specific architectural guidelines, implementation checklists, and structural changes.
   - The roadmap must be extremely robust and powerful, specifically designed for an AI Coding Agent to read, parse, and execute cleanly step-by-step.

2. PROMPTS.md:
   - Provide a set of advanced, production-ready engineering prompt blueprints for each and every feature or step defined in the ROADMAP.md.
   - Every single feature prompt MUST start with a phrase like:
     "Read the AGENT.md/AGENTS.md file in the root directory and follow its rules strictly."
   - Provide highly precise, well-structured prompt blueprints that guide the AI to implement the feature exactly according to the conventions.
   - CRITICAL: For each prompt, include a section called "Session-Saving Tip" that advises the user to start a new chat/agent session for that feature, pointing out that because AGENT.md contains all the context and constraints of the codebase, clean independent chat sessions will save massive amounts of tokens, prevent prompt/context dilution, and guarantee high-quality execution.

--------------------------------------------------------------------------------
`
  }

  systemPrompt += `\n- Output ONLY the Markdown content, no preamble, no explanation`
  return systemPrompt
}

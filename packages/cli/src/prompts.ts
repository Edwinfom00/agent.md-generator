import * as p from '@clack/prompts'
import { QUESTIONS, STEP_LABELS, isQuestionVisible } from '@agent-md/shared'
import type { Question, WizardAnswers } from '@agent-md/shared'

export async function promptQuestion(
  question: Question,
  prefill?: string | string[],
): Promise<string | string[] | symbol> {
  const message = question.hint
    ? `${question.question}\n  ${question.hint}`
    : question.question

  switch (question.type) {
    case 'text':
    case 'textarea':
      return p.text({
        message,
        placeholder: question.placeholder,
        initialValue: typeof prefill === 'string' ? prefill : undefined,
        validate: question.required
          ? (v) => (v.trim() === '' ? 'This field is required.' : undefined)
          : undefined,
      })

    case 'select':
      return p.select({
        message,
        options: (question.options ?? []).map((o) => ({
          value: o.value,
          label: o.label,
          hint: o.description,
        })),
        initialValue: typeof prefill === 'string' ? prefill : undefined,
      })

    case 'multiselect':
      return p.multiselect({
        message,
        options: (question.options ?? []).map((o) => ({
          value: o.value,
          label: o.label,
          hint: o.description,
        })),
        required: question.required,
        initialValues: Array.isArray(prefill) ? prefill : undefined,
      })
  }
}

export function reviewAnswers(answers: WizardAnswers): void {
  const steps = [1, 2, 3, 4]

  for (const step of steps) {
    const stepLabel = STEP_LABELS[step] ?? `Step ${step}`
    const stepQuestions = QUESTIONS.filter(
      (q) => q.step === step && isQuestionVisible(q, answers),
    )

    const lines: string[] = []
    for (const q of stepQuestions) {
      const val = answers[q.id]
      if (!val) continue
      const displayVal = Array.isArray(val) ? val.join(', ') : val
      lines.push(`  ${q.question.split('?')[0]}:\n    ${displayVal}`)
    }

    if (lines.length > 0) {
      p.log.step(`Step ${step} — ${stepLabel}`)
      p.log.message(lines.join('\n'))
    }
  }
}

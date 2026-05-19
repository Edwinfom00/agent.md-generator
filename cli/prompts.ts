import * as p from '@clack/prompts'
import type { Question } from '../src/types'

export async function promptQuestion(
  question: Question,
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
      })
  }
}

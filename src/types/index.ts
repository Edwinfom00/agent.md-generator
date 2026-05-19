export type QuestionType = 'text' | 'select' | 'multiselect' | 'textarea'

export interface QuestionOption {
  value: string
  label: string
  description?: string
  icon?: string
}

export interface Question {
  id: string
  step: number
  category: string
  question: string
  hint?: string
  type: QuestionType
  options?: QuestionOption[]
  placeholder?: string
  required: boolean
  dependsOn?: {
    questionId: string
    value: string | string[]
  }
}

export interface WizardAnswers {
  [questionId: string]: string | string[]
}

export type WizardStep = 'intro' | 'questions' | 'review' | 'generating' | 'output'

export interface GenerateRequest {
  answers: WizardAnswers
}

export interface GenerateResponse {
  content: string
  error?: string
}

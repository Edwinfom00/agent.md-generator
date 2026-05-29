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
  coaching?: string
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

export type WizardStep = 'intro' | 'template' | 'questions' | 'review' | 'generating' | 'output' | 'update'

export interface GenerateRequest {
  answers?: WizardAnswers
  mode?: 'update'
  existingContent?: string
  changeDescription?: string
  variant?: boolean
}

export interface GenerateResponse {
  content: string
  error?: string
  warnings?: string[]
}

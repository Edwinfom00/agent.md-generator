'use client'

import { useState, useCallback } from 'react'
import { AppHeader } from '@/components/ui/AppHeader'
import { StepRail } from '@/components/ui/StepRail'
import { AppFooter } from '@/components/ui/AppFooter'
import { PreviewPane } from '@/components/ui/PreviewPane'
import { QuestionField } from './QuestionField'
import { ReviewStep } from './ReviewStep'
import { GeneratingScreen } from './GeneratingScreen'
import { ResultScreen } from '@/components/output/ResultScreen'
import { getQuestionsForStep, isQuestionVisible, TOTAL_STEPS } from '@/lib/questions'
import type { WizardAnswers, WizardStep } from '@/types'

const STEP_TITLES: Record<number, { lead: string; em: string; meta: string }> = {
  1: { lead: 'Who is this ', em: 'project', meta: '≈ 60 seconds' },
  2: { lead: "What's ", em: 'under the hood', meta: '≈ 45 seconds' },
  3: { lead: 'How is it ', em: 'organized', meta: '≈ 90 seconds' },
  4: { lead: 'What must it ', em: 'never do', meta: '≈ 60 seconds' },
}

export function WizardShell() {
  const [wizardStep, setWizardStep] = useState<WizardStep>('questions')
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<WizardAnswers>({})
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const visibleQuestions = getQuestionsForStep(currentStep).filter(q =>
    isQuestionVisible(q, answers),
  )

  const handleChange = useCallback((id: string, value: string | string[]) => {
    setAnswers(prev => ({ ...prev, [id]: value }))
  }, [])

  function isStepValid() {
    return visibleQuestions
      .filter(q => q.required)
      .every(q => {
        const v = answers[q.id]
        if (!v) return false
        if (Array.isArray(v)) return v.length > 0
        return (v as string).trim() !== ''
      })
  }

  function handleNext() {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(s => s + 1)
    } else {
      setWizardStep('review')
    }
  }

  function handleBack() {
    if (wizardStep === 'review') {
      setWizardStep('questions')
      setCurrentStep(TOTAL_STEPS)
      return
    }
    if (currentStep > 1) setCurrentStep(s => s - 1)
  }

  async function handleGenerate() {
    setLoading(true)
    setError('')
    setWizardStep('generating')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })
      const data = await res.json()
      if (!res.ok || data.error) throw new Error(data.error ?? 'Generation failed')
      setOutput(data.content)
      setWizardStep('output')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setWizardStep('review')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setAnswers({})
    setOutput('')
    setError('')
    setCurrentStep(1)
    setWizardStep('questions')
  }

  if (wizardStep === 'output') {
    return (
      <div className="h-screen flex flex-col bg-paper overflow-hidden">
        <AppHeader />
        <ResultScreen content={output} answers={answers} onReset={handleReset} />
      </div>
    )
  }

  if (wizardStep === 'generating') {
    return (
      <div className="h-screen flex flex-col bg-paper overflow-hidden">
        <AppHeader />
        <GeneratingScreen />
      </div>
    )
  }

  const stepInfo = STEP_TITLES[currentStep]
  const isReview = wizardStep === 'review'

  return (
    <div className="h-screen flex flex-col bg-paper overflow-hidden">
      <AppHeader />
      <StepRail current={isReview ? TOTAL_STEPS : currentStep - 1} />

      <div className="flex-1 grid overflow-hidden min-h-0" style={{ gridTemplateColumns: '1fr 540px' }}>
        <div className="flex flex-col gap-9 px-14 py-10 overflow-y-auto">
          {isReview ? (
            <ReviewStep answers={answers} />
          ) : (
            <>
              <div className="flex items-end justify-between gap-6">
                <h2
                  className="text-[52px] leading-[1.02] tracking-[-0.015em] max-w-[640px]"
                  style={{ fontFamily: 'var(--font-instrument-serif)' }}
                >
                  {stepInfo.lead}
                  <em className="text-cobalt italic">{stepInfo.em}</em>?
                </h2>
                <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-ink-mute text-right min-w-[180px]">
                  step {String(currentStep).padStart(2, '0')} of {String(TOTAL_STEPS).padStart(2, '0')}<br />
                  <b className="text-ink font-medium">
                    {currentStep === 1 ? 'Identity' : currentStep === 2 ? 'Tech Stack' : currentStep === 3 ? 'Architecture' : 'Constraints'}
                  </b><br />
                  {stepInfo.meta}
                </div>
              </div>

              <div className="flex flex-col">
                {visibleQuestions.map((q, i) => (
                  <QuestionField
                    key={q.id}
                    question={q}
                    answers={answers}
                    onChange={handleChange}
                    index={i + 1}
                  />
                ))}
              </div>
            </>
          )}

          {error && (
            <div className="rounded-[4px] border border-signal/30 bg-signal/10 px-4 py-3">
              <p className="text-[14px] text-signal font-mono">{error}</p>
            </div>
          )}
        </div>

        <PreviewPane answers={answers} stage={isReview ? 4 : currentStep - 1} />
      </div>

      <AppFooter
        step={isReview ? TOTAL_STEPS - 1 : currentStep - 1}
        total={TOTAL_STEPS}
        primaryLabel={
          isReview
            ? 'Generate AGENT.md'
            : currentStep === TOTAL_STEPS
            ? 'Review'
            : `Continue to ${currentStep === 1 ? 'Tech Stack' : currentStep === 2 ? 'Architecture' : 'Constraints'}`
        }
        isGenerate={isReview}
        loading={loading}
        canContinue={isReview ? true : isStepValid()}
        onBack={handleBack}
        onContinue={isReview ? handleGenerate : handleNext}
      />
    </div>
  )
}

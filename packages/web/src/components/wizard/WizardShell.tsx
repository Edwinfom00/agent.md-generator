'use client'

import { useState, useCallback, useEffect } from 'react'
import { AppHeader } from '@/components/ui/AppHeader'
import { StepRail } from '@/components/ui/StepRail'
import { AppFooter } from '@/components/ui/AppFooter'
import { PreviewPane } from '@/components/ui/PreviewPane'
import { HistoryDrawer } from '@/components/ui/HistoryDrawer'
import { QuestionField } from './QuestionField'
import { ReviewStep } from './ReviewStep'
import { GeneratingScreen } from './GeneratingScreen'
import { SessionBanner } from './SessionBanner'
import { TemplatePickerScreen } from './TemplatePickerScreen'
import { LandingScreen } from './LandingScreen'
import { UpdateModeScreen } from './UpdateModeScreen'
import { ResultScreen } from '@/components/output/ResultScreen'
import { getQuestionsForStep, isQuestionVisible, TOTAL_STEPS } from '@/lib/questions'
import { saveToHistory, loadHistory } from '@/lib/history'
import { decodeConfig } from '@/lib/shareConfig'
import { readStream } from '@/lib/readStream'
import { validateOutput } from '@/lib/validateOutput'
import type { HistoryEntry } from '@/lib/history'
import type { WizardAnswers, WizardStep } from '@/types'

const SESSION_KEY = 'agent-md-generator:session'

interface SavedSession {
  answers: WizardAnswers
  currentStep: number
  wizardStep: WizardStep
}

function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    return JSON.parse(raw) as SavedSession
  } catch {
    return null
  }
}

function saveSession(session: SavedSession) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  } catch {
    // localStorage unavailable (private browsing quota exceeded, etc.)
  }
}

function clearSession() {
  try {
    localStorage.removeItem(SESSION_KEY)
  } catch {
    // ignore
  }
}

const STEP_TITLES: Record<number, { lead: string; em: string; meta: string }> = {
  1: { lead: 'Who is this ', em: 'project', meta: '≈ 60 seconds' },
  2: { lead: "What's ", em: 'under the hood', meta: '≈ 45 seconds' },
  3: { lead: 'How is it ', em: 'organized', meta: '≈ 90 seconds' },
  4: { lead: 'What must it ', em: 'never do', meta: '≈ 60 seconds' },
}

export function WizardShell() {
  const [wizardStep, setWizardStep] = useState<WizardStep>('intro')
  const [currentStep, setCurrentStep] = useState(1)
  const [answers, setAnswers] = useState<WizardAnswers>({})
  const [output, setOutput] = useState('')
  const [warnings, setWarnings] = useState<string[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showBanner, setShowBanner] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [historyEntries, setHistoryEntries] = useState<HistoryEntry[]>([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const config = params.get('config')
    if (!config) return
    const decoded = decodeConfig(config)
    if (!decoded) return
    setAnswers(decoded)
    setCurrentStep(1)
    setWizardStep('questions')
    history.replaceState(null, '', window.location.pathname)
  }, [])

  useEffect(() => {
    const saved = loadSession()
    if (saved && Object.keys(saved.answers).length > 0) {
      setShowBanner(true)
    }
  }, [])

  useEffect(() => {
    if (wizardStep === 'questions' || wizardStep === 'review') {
      saveSession({ answers, currentStep, wizardStep })
    }
  }, [answers, currentStep, wizardStep])

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey
      if (!isMod) return

      if (e.key === 'ArrowRight' && wizardStep === 'questions') {
        e.preventDefault()
        if (isStepValid()) handleNext()
      }
      if (e.key === 'ArrowLeft' && (wizardStep === 'questions' || wizardStep === 'review')) {
        e.preventDefault()
        handleBack()
      }
      if (e.key === 'Enter' && wizardStep === 'review') {
        e.preventDefault()
        handleGenerate()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [wizardStep, currentStep, answers])

  function handleGoToTemplates() {
    setWizardStep('template')
  }

  function handleSelectTemplate(templateAnswers: Partial<WizardAnswers>) {
    setAnswers(templateAnswers as WizardAnswers)
    setCurrentStep(1)
    setWizardStep('questions')
  }

  function handleStartFresh() {
    setCurrentStep(1)
    setWizardStep('questions')
  }

  function handleStartUpdate() {
    setError('')
    setWizardStep('update')
  }

  async function handleUpdateGenerate(existingContent: string, changeDescription: string) {
    setLoading(true)
    setError('')
    setWizardStep('generating')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'update', existingContent, changeDescription }),
      })

      if (!res.ok) {
        let errorMsg = `Generation failed (Status ${res.status})`
        try {
          const errData = await res.clone().json()
          if (errData.error) errorMsg = errData.error
        } catch {
          try {
            const text = await res.text()
            if (text) errorMsg = `${errorMsg}: ${text.slice(0, 100)}`
          } catch {}
        }
        throw new Error(errorMsg)
      }

      const content = await readStream(res)
      const { warnings } = validateOutput(content)

      setOutput(content)
      setWarnings(warnings ?? [])
      saveToHistory({ _change: changeDescription }, content)
      setWizardStep('output')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setWizardStep('update')
    } finally {
      setLoading(false)
    }
  }

  function handleResume() {
    const saved = loadSession()
    if (!saved) return
    setAnswers(saved.answers)
    setCurrentStep(saved.currentStep)
    setWizardStep(saved.wizardStep === 'template' ? 'questions' : saved.wizardStep)
    setShowBanner(false)
  }

  function handleDiscard() {
    clearSession()
    setShowBanner(false)
  }

  function handleOpenHistory() {
    setHistoryEntries(loadHistory())
    setShowHistory(true)
  }

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

      if (!res.ok) {
        let errorMsg = `Generation failed (Status ${res.status})`
        try {
          const errData = await res.clone().json()
          if (errData.error) errorMsg = errData.error
        } catch {
          try {
            const text = await res.text()
            if (text) errorMsg = `${errorMsg}: ${text.slice(0, 100)}`
          } catch {}
        }
        throw new Error(errorMsg)
      }

      const content = await readStream(res)
      const { warnings } = validateOutput(content)

      setOutput(content)
      setWarnings(warnings ?? [])
      saveToHistory(answers, content)
      setWizardStep('output')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setWizardStep('review')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    clearSession()
    setAnswers({})
    setOutput('')
    setWarnings([])
    setError('')
    setCurrentStep(1)
    setWizardStep('intro')
  }

  if (wizardStep === 'intro') {
    return (
      <div className="h-screen flex flex-col bg-paper overflow-hidden">
        <AppHeader onHistoryOpen={handleOpenHistory} />
        {showBanner && (
          <SessionBanner onResume={handleResume} onDiscard={handleDiscard} />
        )}
        <LandingScreen onStart={handleGoToTemplates} />
        {showHistory && <HistoryDrawer entries={historyEntries} onClose={() => setShowHistory(false)} />}
      </div>
    )
  }

  if (wizardStep === 'update') {
    return (
      <div className="h-screen flex flex-col bg-paper overflow-hidden">
        <AppHeader onHistoryOpen={handleOpenHistory} />
        <UpdateModeScreen
          onGenerate={handleUpdateGenerate}
          onBack={() => setWizardStep('template')}
          loading={loading}
          error={error}
        />
        {showHistory && <HistoryDrawer entries={historyEntries} onClose={() => setShowHistory(false)} />}
      </div>
    )
  }

  if (wizardStep === 'template') {
    return (
      <div className="h-screen flex flex-col bg-paper overflow-hidden">
        <AppHeader onHistoryOpen={handleOpenHistory} />
        {showBanner && (
          <SessionBanner onResume={handleResume} onDiscard={handleDiscard} />
        )}
        <TemplatePickerScreen
          onSelect={handleSelectTemplate}
          onStartFresh={handleStartFresh}
          onUpdate={handleStartUpdate}
        />
        {showHistory && <HistoryDrawer entries={historyEntries} onClose={() => setShowHistory(false)} />}
      </div>
    )
  }

  if (wizardStep === 'output') {
    return (
      <div className="h-screen flex flex-col bg-paper overflow-hidden">
        <AppHeader onHistoryOpen={handleOpenHistory} />
        <ResultScreen
          content={output}
          answers={answers}
          warnings={warnings}
          onReset={handleReset}
          onRegenerate={handleGenerate}
        />
        {showHistory && <HistoryDrawer entries={historyEntries} onClose={() => setShowHistory(false)} />}
      </div>
    )
  }

  if (wizardStep === 'generating') {
    return (
      <div className="h-screen flex flex-col bg-paper overflow-hidden">
        <AppHeader onHistoryOpen={handleOpenHistory} />
        <GeneratingScreen />
        {showHistory && <HistoryDrawer entries={historyEntries} onClose={() => setShowHistory(false)} />}
      </div>
    )
  }

  const stepInfo = STEP_TITLES[currentStep]
  const isReview = wizardStep === 'review'

  return (
    <div className="h-screen flex flex-col bg-paper overflow-hidden">
      <AppHeader onHistoryOpen={handleOpenHistory} />
      {showBanner && (
        <SessionBanner onResume={handleResume} onDiscard={handleDiscard} />
      )}
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
        answers={answers}
      />
      {showHistory && <HistoryDrawer entries={historyEntries} onClose={() => setShowHistory(false)} />}
    </div>
  )
}

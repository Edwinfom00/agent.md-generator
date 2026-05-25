'use client'

import { LandingHero } from './landing/LandingHero'
import { LandingSandbox } from './landing/LandingSandbox'
import { LandingBeforeAfter } from './landing/LandingBeforeAfter'
import { LandingCapabilities } from './landing/LandingCapabilities'
import { LandingBlueprints } from './landing/LandingBlueprints'
import { LandingWorkflow } from './landing/LandingWorkflow'
import { LandingFAQs } from './landing/LandingFAQs'
import { LandingFooterCTA } from './landing/LandingFooterCTA'

interface LandingScreenProps {
  onStart: () => void
}

export function LandingScreen({ onStart }: LandingScreenProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Eyebrow target tools rotated loop and header headline */}
      <LandingHero onStart={onStart} />

      {/* Live prompt simulator coding sandbox */}
      <LandingSandbox />

      {/* Visual before/after code generation comparison */}
      <LandingBeforeAfter />

      {/* Expanded core capabilities grid highlighting Technical Roadmaps, Prompts and Visual Tree */}
      <LandingCapabilities />

      {/* Blueprint sliders inspect presets */}
      <LandingBlueprints />

      {/* Progressive four-step how-it-works workflow map */}
      <LandingWorkflow />

      {/* Accordion list details common questions */}
      <LandingFAQs />

      {/* Final bottom briefing conversion block */}
      <LandingFooterCTA onStart={onStart} />
    </div>
  )
}

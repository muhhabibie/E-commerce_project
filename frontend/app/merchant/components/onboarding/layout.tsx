"use client"

import type React from "react"

import { OnboardingStepHeader } from "./step-header"
import { ProgressStepper } from "./progress-stepper"

const stepTitles = {
  1: { title: "Info Utama", subtitle: "Lengkapi identitas merchant kamu" },
  2: { title: "Profil & Branding", subtitle: "Bantu pelanggan mengenal toko mu" },
  3: { title: "Cerita & Galeri", subtitle: "Tunjukkan keunikan produk mu" },
  4: { title: "Lokasi di Peta", subtitle: "Biar mudah ditemukan pelanggan" },
}

interface OnboardingLayoutProps {
  children: React.ReactNode
  currentStep: number
  totalSteps: number
}

export function OnboardingLayout({ children, currentStep, totalSteps }: OnboardingLayoutProps) {
  const stepInfo = stepTitles[currentStep as keyof typeof stepTitles]

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <ProgressStepper currentStep={currentStep} totalSteps={totalSteps} />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <OnboardingStepHeader title={stepInfo.title} subtitle={stepInfo.subtitle} />
          <div className="mt-8">{children}</div>
        </div>
      </main>
    </div>
  )
}

// Next.js App Router expects a default-exported layout for this route segment.
// Provide a minimal layout wrapper that simply renders children, while keeping
// the named OnboardingLayout available for composition inside pages.
export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

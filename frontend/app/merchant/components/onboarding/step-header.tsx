import type React from "react"
interface OnboardingStepHeaderProps {
  title: string
  subtitle: string
  icon?: React.ReactNode
}

export function OnboardingStepHeader({ title, subtitle, icon }: OnboardingStepHeaderProps) {
  return (
    <div className="text-center mb-8">
      {icon && <div className="mb-4 flex justify-center">{icon}</div>}
      <h1 className="text-3xl font-bold text-foreground mb-2">{title}</h1>
      <p className="text-text-secondary text-base">{subtitle}</p>
    </div>
  )
}

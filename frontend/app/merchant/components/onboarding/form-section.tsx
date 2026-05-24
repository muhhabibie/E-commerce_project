import type React from "react"
interface MerchantFormSectionProps {
  title: string
  description: string
  children: React.ReactNode
}

export function MerchantFormSection({ title, description, children }: MerchantFormSectionProps) {
  return (
    <div className="space-y-4 mb-8">
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-1">{title}</h2>
        <p className="text-sm text-text-secondary">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  )
}

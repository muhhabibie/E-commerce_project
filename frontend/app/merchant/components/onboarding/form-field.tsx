import type React from "react"
interface FormFieldProps {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  children: React.ReactNode
}

export function FormField({ label, error, helperText, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-accent ml-1">*</span>}
      </label>
      {children}
      {helperText && !error && <p className="text-xs text-text-secondary">{helperText}</p>}
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  )
}

interface ProgressStepperProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressStepper({
  currentStep,
  totalSteps,
}: ProgressStepperProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Progress bar */}
      <div className="flex gap-2">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`flex-1 h-2 rounded-full transition-colors ${
              index < currentStep
                ? "bg-accent"
                : index === currentStep - 1
                ? "bg-accent"
                : "bg-border"
            }`}
          />
        ))}
      </div>

      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium text-text-secondary">
          Langkah {currentStep} dari {totalSteps}
        </div>
        <div className="text-sm text-muted-foreground">
          {Math.round((currentStep / totalSteps) * 100)}% selesai
        </div>
      </div>
    </div>
  );
}

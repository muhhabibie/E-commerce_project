"use client";

import { Button } from "@/components/ui/button";

interface OnboardingFooterActionsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
  isFirstStep: boolean;
  isLastStep: boolean;
  isPending?: boolean;
}

export function OnboardingFooterActions({
  onBack,
  onNext,
  onSubmit,
  isFirstStep,
  isLastStep,
  isPending,
}: OnboardingFooterActionsProps) {
  return (
    <div className="sticky bottom-0 bg-white border-t border-border px-4 py-4 mt-8">
      <div className="max-w-2xl mx-auto flex gap-3 justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isFirstStep || isPending}
          className="flex-1 bg-transparent"
        >
          ← Kembali
        </Button>
        <Button
          type="button"
          className="flex-1 bg-primary text-white hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50"
          onClick={isLastStep ? onSubmit : onNext}
          disabled={isPending}
        >
          {isPending 
            ? "Memproses..." 
            : (isLastStep ? "Selesai & Simpan" : "Lanjut →")}
        </Button>
      </div>
    </div>
  );
}

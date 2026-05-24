"use client";

import { useState } from "react";
import { OnboardingLayout } from "./layout";
import { Step1BasicInfo } from "./step-1-basic-info";
import { Step2Branding } from "./step-2-branding";
import { Step3Story } from "./step-3-story";
import { Step4Location } from "./step-4-location";
import { OnboardingFooterActions } from "./footer-actions";
import useRegisterMerchant from "@/hooks/merchant/use-register-merchant";

export function MerchantOnboardingWizard() {
  const { formik, fetchCurrentCoordinates, locating, locationError } =
    useRegisterMerchant();
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    formik.submitForm();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1BasicInfo formik={formik} />;
      case 2:
        return <Step2Branding formik={formik} />;
      case 3:
        return <Step3Story formik={formik} />;
      case 4:
        return (
          <Step4Location
            formik={formik}
            fetchCurrentCoordinates={fetchCurrentCoordinates}
            locating={locating}
            locationError={locationError}
          />
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout currentStep={currentStep} totalSteps={4}>
      {renderStep()}
      <OnboardingFooterActions
        currentStep={currentStep}
        totalSteps={4}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isFirstStep={currentStep === 1}
        isLastStep={currentStep === 4}
      />
    </OnboardingLayout>
  );
}

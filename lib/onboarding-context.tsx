'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface OnboardingData {
  // Step 1: Qualification
  currentReality?: string;
  ninetyDayGoal?: string;
  commitmentLevel?: string;
  
  // Step 2: Identity
  name?: string;
  currentRole?: string;
  futureIdentity?: string;
  moneyGoal?: string;
  identityGoal?: string;
  impactGoal?: string;
  freedomGoal?: string;
  burningDesire?: string;
  nonNegotiables?: string[];
  
  // Step 3: Manifesto (AI Generated)
  manifesto?: string;
  affirmations?: string[];
  
  // Step 4: Vision Board
  visionImages?: string[];
  visionTemplate?: string;
  
  // Step 5: Voice
  voiceRecording?: string;
  powerStatement?: string;
}

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
  currentStep: number;
  setCurrentStep: (step: number) => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<OnboardingData>({});
  const [currentStep, setCurrentStep] = useState(1);

  const updateData = (newData: Partial<OnboardingData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData, currentStep, setCurrentStep }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within OnboardingProvider');
  }
  return context;
}
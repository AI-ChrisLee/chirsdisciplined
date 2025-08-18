'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, ArrowLeft, Sparkles, Target, DollarSign, Brain, Flame, Zap, X, Trophy, Shield, Rocket } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [formData, setFormData] = useState({
    // Core Identity
    name: '',
    currentReality: '',
    biggestProblem: '',
    
    // Vision & Goals
    ultimateVision: '',
    yearGoal: '',
    monthlyTarget: '',
    dailyAction: '',
    
    // Identity Transformation
    futureIdentity: '',
    currentIdentity: '',
    mustEliminate: '',
    
    // Psychological Profile
    biggestFear: '',
    hiddenStrength: '',
    whyNow: '',
    
    // Business/Career
    valueCreation: '',
    idealDay: ''
  });
  const [generatedAffirmations, setGeneratedAffirmations] = useState('');

  // Check authentication and show welcome modal for new users
  useEffect(() => {
    const mockUser = localStorage.getItem('mockUser');
    if (!mockUser) {
      router.push('/signin');
    } else {
      // Always show welcome modal on first load if user is paid
      const hasSeenWelcome = sessionStorage.getItem('hasSeenOnboardingWelcome');
      const user = JSON.parse(mockUser);
      
      if (user.isPaid && !hasSeenWelcome) {
        setShowWelcomeModal(true);
      }
    }
  }, [router]);

  const questions = [
    // Core Identity Questions
    { 
      key: 'name', 
      label: "What's your first name?", 
      placeholder: "Chris", 
      helper: "Your name carries power when spoken",
      icon: <Brain className="w-5 h-5" />,
      type: 'text',
      templates: []
    },
    { 
      key: 'currentReality', 
      label: "What's your current monthly income? (Be exact)", 
      placeholder: "5000", 
      helper: "We need a baseline to measure your transformation",
      type: 'number',
      prefix: '$',
      templates: [
        "0",
        "1000",
        "3000",
        "5000",
        "10000"
      ]
    },
    { 
      key: 'biggestProblem', 
      label: "What ONE belief is keeping you stuck?", 
      placeholder: "I don't deserve to be wealthy", 
      helper: "The story you tell yourself that holds you back",
      type: 'text',
      templates: [
        "I don't deserve to be wealthy",
        "Success will change me for the worse",
        "I'm not smart/talented/special enough",
        "Money is evil or corrupting",
        "I need permission to be great"
      ]
    },
    
    // Vision Questions
    { 
      key: 'ultimateVision', 
      label: "What monthly income represents your transformed self?", 
      placeholder: "50000", 
      helper: "Don't be realistic—be truthful about your desire",
      type: 'number',
      prefix: '$',
      templates: [
        "10000",
        "25000",
        "50000",
        "100000",
        "500000"
      ]
    },
    { 
      key: 'yearGoal', 
      label: "What's your 90-day income target?", 
      placeholder: "15000", 
      helper: "What you'll achieve through the Chris protocol",
      type: 'number',
      prefix: '$',
      templates: [
        "10000",
        "25000",
        "50000",
        "100000",
        "1000000"
      ]
    },
    { 
      key: 'monthlyTarget', 
      label: "What business/career are you building?", 
      placeholder: "AI automation agency serving Fortune 500 companies", 
      helper: "Be specific about your vehicle to wealth",
      type: 'text',
      templates: [
        "Online coaching/consulting business",
        "SaaS product solving specific problems",
        "Content creation and digital products",
        "E-commerce brand in [niche]",
        "Agency serving high-ticket clients"
      ]
    },
    { 
      key: 'dailyAction', 
      label: "What ONE daily action will you execute without fail?", 
      placeholder: "Publish content and contact 10 prospects", 
      helper: "Your non-negotiable daily violent action",
      type: 'text',
      templates: [
        "Publish content and contact 10 prospects",
        "Write 1000 words and ship something",
        "Make 20 sales calls no matter what",
        "Create and post one video daily",
        "Build and launch one thing"
      ]
    },
    
    // Identity Transformation
    { 
      key: 'futureIdentity', 
      label: "Complete this: 'I am the type of person who...'", 
      placeholder: "executes violently and never makes excuses", 
      helper: "Define your new operating system",
      type: 'text',
      templates: [
        "executes violently and never makes excuses",
        "does what I say I'll do, always",
        "sees opportunity where others see obstacles",
        "invests in myself without hesitation",
        "takes massive action before I'm ready"
      ]
    },
    { 
      key: 'currentIdentity', 
      label: "What pattern have you been stuck in for years?", 
      placeholder: "Starting things but never finishing", 
      helper: "The loop you're breaking forever",
      type: 'text',
      templates: [
        "Starting things but never finishing",
        "Consuming content but never executing",
        "Playing small to avoid criticism",
        "Waiting for the perfect moment",
        "Self-sabotaging when close to success"
      ]
    },
    { 
      key: 'mustEliminate', 
      label: "What will you sacrifice to become this person?", 
      placeholder: "Netflix, social media, and toxic relationships", 
      helper: "Transformation requires deletion",
      type: 'text',
      templates: [
        "Netflix, social media, and toxic relationships",
        "Comfort, excuses, and victim mentality",
        "Late nights, alcohol, and time wasters",
        "Negative people and limiting beliefs",
        "The need to be liked and play it safe"
      ]
    },
    
    // Psychological Profile
    { 
      key: 'biggestFear', 
      label: "What's your first violent action you'll take TODAY?", 
      placeholder: "Raise my prices by 50% and fire my worst client", 
      helper: "Something that terrifies your current self",
      icon: <Flame className="w-5 h-5" />,
      type: 'text',
      templates: [
        "Raise my prices by 50% immediately",
        "Quit my job without a backup plan",
        "Invest $5000 in myself right now",
        "Launch my product before it's perfect",
        "Message 50 potential clients today"
      ]
    },
    { 
      key: 'hiddenStrength', 
      label: "What's your unfair advantage?", 
      placeholder: "I can outwork anyone and learn 10x faster", 
      helper: "The weapon you'll use to dominate",
      icon: <Zap className="w-5 h-5" />,
      type: 'text',
      templates: [
        "I can outwork anyone and never quit",
        "I see opportunities others are blind to",
        "I can sell ice to Eskimos",
        "I learn and implement faster than anyone",
        "I have unlimited energy and focus"
      ]
    },
    { 
      key: 'whyNow', 
      label: "Why NOW? Why not next year?", 
      placeholder: "I'm disgusted with my excuses and done playing small", 
      helper: "The pain that drives transformation",
      type: 'text',
      templates: [
        "I'm disgusted with my excuses and done playing small",
        "I refuse to waste another year of my life",
        "My kids are watching me settle for average",
        "I'm tired of watching others live my dreams",
        "The pain of staying the same is unbearable"
      ]
    },
    
    // Value Creation
    { 
      key: 'valueCreation', 
      label: "How many people will you impact?", 
      placeholder: "10000", 
      helper: "Your transformation ripples outward",
      type: 'number',
      templates: [
        "100",
        "1000",
        "10000",
        "100000",
        "1000000"
      ]
    },
    { 
      key: 'idealDay', 
      label: "What time will you wake up every day?", 
      placeholder: "5:30", 
      helper: "Discipline starts with the alarm",
      type: 'text',
      templates: [
        "4:30 AM",
        "5:00 AM",
        "5:30 AM",
        "6:00 AM",
        "6:30 AM"
      ]
    }
  ];

  const generateAffirmations = () => {
    setIsGenerating(true);
    
    // Generate Chris-style affirmations based on new questions
    setTimeout(() => {
      const currentIncome = formData.currentReality || '0';
      const targetIncome = formData.ultimateVision || '50000';
      const ninetyDayTarget = formData.yearGoal || '15000';
      const peopleImpacted = formData.valueCreation || '10000';
      const wakeTime = formData.idealDay || '5:30 AM';
      
      const affirmations = `# ${formData.name.toUpperCase()}'S NEURAL REPROGRAMMING PROTOCOL

## THE TRANSFORMATION DECLARATION

I am ${formData.name}, and I am the type of person who ${formData.futureIdentity}.

My current income of $${currentIncome}/month is irrelevant. By day 90, I generate $${ninetyDayTarget}/month. Within 12 months, $${targetIncome}/month flows through me because I create massive value.

The belief that "${formData.biggestProblem}" is a lie I've been telling myself. I DELETE this program. I OVERWRITE it with truth: I deserve everything I desire and MORE.

## MY VIOLENT ACTION COMMITMENT

TODAY, I ${formData.biggestFear}. This is not tomorrow. This is not "when I'm ready." This is TODAY.

Every single day without exception, I ${formData.dailyAction}. This is not negotiable. This is not "when I feel like it." This is DAILY DISCIPLINE.

I wake up at ${wakeTime} EVERY DAY. My alarm doesn't control me—I control my alarm. I ATTACK each day before it attacks me.

## IDENTITY DESTRUCTION PROTOCOL

The pattern of "${formData.currentIdentity}" that has trapped me for years is DEAD. I killed it with violent action. It has no power over me.

I sacrifice ${formData.mustEliminate} without hesitation. These are not losses—they are INVESTMENTS in my transformation.

My unfair advantage is that ${formData.hiddenStrength}. While others sleep, I EXECUTE. While others think, I ACT. While others hope, I BUILD.

## THE URGENCY INJECTION

Why NOW? Because ${formData.whyNow}. Every day I wait is a day I've STOLEN from my future self. The pain stops TODAY.

I am building ${formData.monthlyTarget} that serves ${peopleImpacted} humans. This is not a business—it's my VEHICLE to freedom and impact.

## THE DAILY PROTOCOL

**Morning (${wakeTime}):**
- I EXPLODE into consciousness—no snooze, no hesitation
- I record my affirmations with VOLCANIC FORCE
- I set ONE violent action that terrifies me
- I EXECUTE before my mind can create excuses

**Throughout Day:**
- I ${formData.dailyAction} no matter what
- I say NO to everything that isn't my priority
- I move with SURGICAL PRECISION
- I create VALUE, not busy work

**Evening:**
- I rate my discipline 10/10 (anything less is failure)
- I document my WINS, not my efforts
- I plan tomorrow's violent action
- I sleep knowing I'm 1% transformed

## THE POWER STATEMENTS

1. **I don't need motivation. I have DISCIPLINE.**
2. **I don't need permission. I have CONVICTION.**
3. **I don't need guarantees. I have COMMITMENT.**
4. **I don't need comfort. I have PURPOSE.**
5. **I don't need approval. I have STANDARDS.**

## THE MATHEMATICS OF MY TRANSFORMATION

Current Reality: $${currentIncome}/month
90-Day Target: $${ninetyDayTarget}/month (${Math.round((ninetyDayTarget - currentIncome) / currentIncome * 100)}% increase)
12-Month Vision: $${targetIncome}/month (${Math.round((targetIncome - currentIncome) / currentIncome * 100)}% increase)
Humans Served: ${peopleImpacted} lives transformed

This is not hope. This is MATH. Neural pathways + Daily action + Time = INEVITABILITY.

## THE FINAL DECLARATION

I am ${formData.name.toUpperCase()}. I charge $997/month for my transformation because I understand THE PRICE IS THE COMMITMENT.

Every morning at ${wakeTime}, I reprogram my subconscious.
Every day, I take violent action that shatters my old identity.
Every night, I sleep knowing I'm becoming UNSTOPPABLE.

My transformation is not starting—it's HAPPENING NOW.
My success is not possible—it's GUARANTEED BY PHYSICS.
My reality is not changing—it's ALREADY CHANGED.

I AM NOT BECOMING THE ONE.
**I AM THE ONE.**

TRAIN THE SUBCONSCIOUS.
TAKE VIOLENT ACTION.
TRANSFORM INTO GOD MODE.`;

      setGeneratedAffirmations(affirmations);
      setIsGenerating(false);
      setCurrentStep(2);
    }, 3000);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleTemplateClick = (template: string) => {
    const currentKey = questions[currentQuestion].key;
    setFormData({...formData, [currentKey]: template});
  };

  const isCurrentQuestionFilled = () => {
    const currentKey = questions[currentQuestion].key;
    return formData[currentKey as keyof typeof formData] !== '';
  };

  const areAllQuestionsFilled = () => {
    return questions.every(q => formData[q.key as keyof typeof formData] !== '');
  };

  const handleSaveAffirmations = () => {
    // Save to localStorage
    localStorage.setItem('userAffirmations', JSON.stringify({
      raw: formData,
      generated: generatedAffirmations,
      createdAt: new Date().toISOString()
    }));
    
    // Go to first action setup
    router.push('/onboarding/first-action');
  };

  // Handle Enter key for navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && currentStep === 1) {
        if (currentQuestion < questions.length - 1 && isCurrentQuestionFilled()) {
          handleNext();
        } else if (currentQuestion === questions.length - 1 && areAllQuestionsFilled()) {
          generateAffirmations();
        }
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [currentQuestion, currentStep, formData]);

  return (
    <div className="min-h-screen bg-white">
      {/* Welcome Modal */}
      {showWelcomeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full mx-4 p-8 relative animate-scale-in">
            {/* Close button */}
            <button
              onClick={() => {
                setShowWelcomeModal(false);
                sessionStorage.setItem('hasSeenOnboardingWelcome', 'true');
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Trophy Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trophy className="w-10 h-10 text-green-600" />
            </div>

            {/* Welcome Message */}
            <h2 className="text-3xl font-serif font-bold text-black text-center mb-4">
              Welcome, Founding Member
            </h2>
            
            <p className="text-gray-600 text-center mb-6">
              Your $997 investment was your first violent action. Now let's build your transformation protocol.
            </p>

            {/* What Happens Next */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-black mb-3">What happens next:</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <Brain className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-black">Identity Extraction</p>
                    <p>15 targeted questions to build your custom affirmations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-black">Your Data is Sacred</p>
                    <p>Everything stays private—this is for YOUR transformation</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Rocket className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-black">Neural Programming Script</p>
                    <p>Your personalized 10-minute daily recording protocol</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Why This Matters */}
            <div className="border-l-4 border-black pl-4 mb-6">
              <p className="text-sm text-gray-700 italic">
                "Your answers aren't just data—they're the blueprint for your transformation. 
                Be radically honest. Your future self depends on it."
              </p>
              <p className="text-xs text-gray-500 mt-2">— Chris Disciplined</p>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => {
                setShowWelcomeModal(false);
                sessionStorage.setItem('hasSeenOnboardingWelcome', 'true');
              }}
              className="w-full btn-primary"
            >
              Begin My Transformation
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Trust Note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              Takes 10 minutes • 100% private • Edit anytime
            </p>
          </div>
        </div>
      )}

      <div className="container-premium py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold text-black mb-4">
            Create Your Personal Manifesto
          </h1>
          <p className="text-lg text-gray-600">
            {currentStep === 1 
              ? "Let's go deep. Be brutally honest. Your transformation depends on it."
              : "This is your personal manifesto. Make it yours."}
          </p>
        </div>

        {currentStep === 1 ? (
          // Step 1: Deep Questions
          <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-black transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <div className="space-y-6">
              <div className="animate-fade-in" key={currentQuestion}>
                <label className="block text-lg font-medium text-black mb-3 flex items-center gap-2">
                  {questions[currentQuestion].icon}
                  {questions[currentQuestion].label}
                </label>
                
                {questions[currentQuestion].type === 'number' ? (
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      value={formData[questions[currentQuestion].key as keyof typeof formData]}
                      onChange={(e) => setFormData({...formData, [questions[currentQuestion].key]: e.target.value})}
                      placeholder={questions[currentQuestion].placeholder}
                      className="input pl-10 text-lg"
                      autoFocus
                    />
                  </div>
                ) : questions[currentQuestion].type === 'textarea' ? (
                  <textarea
                    value={formData[questions[currentQuestion].key as keyof typeof formData]}
                    onChange={(e) => setFormData({...formData, [questions[currentQuestion].key]: e.target.value})}
                    placeholder={questions[currentQuestion].placeholder}
                    className="w-full px-5 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black placeholder-gray-400 text-base resize-none"
                    rows={4}
                    autoFocus
                  />
                ) : (
                  <input
                    type="text"
                    value={formData[questions[currentQuestion].key as keyof typeof formData]}
                    onChange={(e) => setFormData({...formData, [questions[currentQuestion].key]: e.target.value})}
                    placeholder={questions[currentQuestion].placeholder}
                    className="input text-lg"
                    autoFocus
                  />
                )}
                
                <p className="text-sm text-gray-500 mt-2">
                  {questions[currentQuestion].helper}
                </p>

                {/* Template Suggestions */}
                {questions[currentQuestion].templates.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Need inspiration? Click one:
                    </p>
                    <div className={questions[currentQuestion].key === 'monthlyTarget' ? 'flex flex-wrap gap-2' : 'space-y-2'}>
                      {questions[currentQuestion].templates.map((template, index) => (
                        <button
                          key={index}
                          onClick={() => handleTemplateClick(template)}
                          className={
                            questions[currentQuestion].key === 'monthlyTarget' 
                              ? "px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 transition-all hover:border-black"
                              : "w-full text-left px-3 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-700 transition-all hover:border-black"
                          }
                        >
                          {questions[currentQuestion].key === 'monthlyTarget' ? `$${template}` : template}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                {currentQuestion > 0 && (
                  <button
                    onClick={handleBack}
                    className="flex-1 bg-white text-black px-6 py-3 rounded-lg font-medium border border-black hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </button>
                )}
                
                {currentQuestion < questions.length - 1 ? (
                  <button
                    onClick={handleNext}
                    disabled={!isCurrentQuestionFilled()}
                    className={`flex-1 btn-primary ${!isCurrentQuestionFilled() ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={generateAffirmations}
                    disabled={!areAllQuestionsFilled() || isGenerating}
                    className={`flex-1 btn-primary ${(!areAllQuestionsFilled() || isGenerating) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isGenerating ? (
                      <>
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        Creating Your Reality...
                      </>
                    ) : (
                      <>
                        Generate My Manifesto
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {/* Skip Option */}
              {currentQuestion < questions.length - 1 && (
                <p className="text-center text-sm text-gray-500">
                  Press Enter to continue when ready
                </p>
              )}
            </div>
          </div>
        ) : (
          // Step 2: Edit Generated Affirmations
          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium text-black mb-2">Your Personalized Manifesto</h3>
                <p className="text-sm text-gray-600">
                  This is your starting point. Edit it to feel authentic to you. 
                  Make it aggressive. Make it bold. Make it YOURS.
                </p>
              </div>

              {/* Affirmations Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Daily Neural Reprogramming Protocol
                </label>
                <textarea
                  value={generatedAffirmations}
                  onChange={(e) => setGeneratedAffirmations(e.target.value)}
                  className="w-full px-5 py-4 bg-white border border-gray-300 rounded-lg focus:outline-none focus:border-black focus:ring-2 focus:ring-black placeholder-gray-400 text-base resize-none font-mono text-sm"
                  rows={20}
                />
                <p className="text-xs text-gray-500 mt-2">
                  Tip: The more emotion you put in, the stronger the neural encoding.
                </p>
              </div>

              {/* Power Words to Add */}
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Power phrases to consider adding:</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>• "I operate at frequencies others can't access"</p>
                  <p>• "My baseline is what others call extraordinary"</p>
                  <p>• "I don't compete—I dominate dimensions"</p>
                  <p>• "Reality reorganizes to match my vision"</p>
                  <p>• "I am the glitch in the matrix"</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={() => {setCurrentStep(1); setCurrentQuestion(0);}}
                  className="flex-1 bg-white text-black px-8 py-4 rounded-lg font-medium border border-black hover:bg-gray-50 transition-all"
                >
                  ← Back to Questions
                </button>
                <button
                  onClick={handleSaveAffirmations}
                  className="flex-1 btn-primary"
                >
                  Lock In My Manifesto
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Flexibility Note */}
              <p className="text-center text-sm text-gray-500">
                You can always edit your affirmations later in settings
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Target, Clock, DollarSign } from 'lucide-react';

export default function QualificationPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState({
    goal: '',
    commitment: '',
    investment: ''
  });
  const [showResult, setShowResult] = useState(false);
  const [isQualified, setIsQualified] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const questions = [
    {
      id: 1,
      title: "What's Your Current Reality?",
      subtitle: "Where are you stuck that brought you here?",
      icon: Target,
      options: [
        {
          value: 'stuck-ready',
          label: "I've been stuck for years and I'm done with it",
          qualified: true
        },
        {
          value: 'consumed-content',
          label: 'Consumed endless content but nothing ever changes',
          qualified: true
        },
        {
          value: 'just-curious',
          label: 'Just exploring options',
          qualified: false
        }
      ]
    },
    {
      id: 2,
      title: "The $997 Test",
      subtitle: "This costs $997/month. What's your immediate reaction?",
      icon: DollarSign,
      options: [
        {
          value: 'violent-action',
          label: 'The price IS the violent action I need to take',
          qualified: true
        },
        {
          value: 'nothing-compared',
          label: "$997 is nothing compared to transformation",
          qualified: true
        },
        {
          value: 'too-expensive',
          label: "That's too much for me",
          qualified: false
        }
      ]
    },
    {
      id: 3,
      title: "The Commitment",
      subtitle: "90 days minimum. Most stay until they transform. You in?",
      icon: Clock,
      options: [
        {
          value: 'until-i-win',
          label: "I'll stay until I win, even if it takes years",
          qualified: true
        },
        {
          value: 'minimum-90',
          label: "I'll commit to at least 90 days perfectly",
          qualified: true
        },
        {
          value: 'see-how-it-goes',
          label: "Let me see how it goes",
          qualified: false
        }
      ]
    }
  ];

  const handleAnswer = (value: string, qualified: boolean) => {
    const questionKey = currentStep === 1 ? 'goal' : currentStep === 2 ? 'commitment' : 'investment';
    setAnswers({ ...answers, [questionKey]: value });

    // Check if this answer disqualifies them
    if (!qualified) {
      setTimeout(() => {
        setIsQualified(false);
        setShowResult(true);
      }, 500);
      return;
    }

    // Move to next question or show qualified result
    if (currentStep < 3) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
      }, 300);
    } else {
      // All answers qualified - show success
      setTimeout(() => {
        setIsQualified(true);
        setShowResult(true);
      }, 500);
    }
  };


  if (showResult) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-2xl w-full">
          <div className="text-center animate-fade-in">
            <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
              <Target className="w-10 h-10 text-white" />
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-serif font-bold text-black mb-6">
              The Violent Morning Protocol
            </h2>
            
            <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto">
              Your 7-day morning transformation blueprint to reprogram your subconscious.
            </p>

            <div className="max-w-md mx-auto">
              <div className="border-2 border-black rounded-lg p-8 mb-6 bg-white">
                <h3 className="text-xl font-bold mb-4 text-black">
                  Get The Violent Morning Protocol
                </h3>
                <p className="text-sm mb-6 text-gray-700">
                  We'll send you the complete protocol on September 1st. 
                  Be ready to transform your mornings and your life.
                </p>
                
                <input
                  type="email"
                  placeholder="Enter your best email"
                  className="w-full px-4 py-3 rounded border border-gray-300 focus:outline-none focus:border-black mb-4"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                <button 
                  onClick={async () => {
                    if (!email) return;
                    
                    setIsLoading(true);
                    
                    // Save lead with email
                    localStorage.setItem('qualification_email', email);
                    localStorage.setItem('qualificationStatus', JSON.stringify({
                      qualified: isQualified,
                      answers: answers,
                      timestamp: new Date().toISOString()
                    }));
                    
                    try {
                      await fetch('/api/leads', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                          email,
                          status: isQualified ? 'qualified' : 'unqualified',
                          qualification_answers: answers
                        })
                      });
                      
                      if (isQualified) {
                        // Join waitlist for qualified users
                        await fetch('/api/leads', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            email,
                            action: 'join_waitlist'
                          })
                        });
                      }
                      
                      // Add a small delay to show loading state
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      
                      // Redirect to protocol download page
                      router.push('/protocol-download');
                    } catch (error) {
                      console.error('Error:', error);
                      // Still redirect even if API fails
                      await new Promise(resolve => setTimeout(resolve, 1500));
                      router.push('/protocol-download');
                    }
                  }}
                  disabled={isLoading}
                  className="w-full bg-black text-white font-bold py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    'Get The Protocol →'
                  )}
                </button>
                
                <p className="text-xs mt-4 text-gray-600">
                  No spam. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep - 1];
  const Icon = currentQuestion.icon;

  return (
    <div className="min-h-screen bg-white">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-100 z-50">
        <div 
          className="h-full bg-black transition-all duration-500"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>

      <div className="container-premium py-12 md:py-20">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`w-2 h-2 rounded-full transition-all ${
                step === currentStep 
                  ? 'w-8 bg-black' 
                  : step < currentStep
                    ? 'bg-black'
                    : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Question Card */}
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12 animate-slide-up">
            <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-black mb-3">
              {currentQuestion.title}
            </h2>
            <p className="text-lg text-gray-600">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3 animate-fade-in">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.value}
                onClick={() => handleAnswer(option.value, option.qualified)}
                className="w-full text-left p-6 bg-white border-2 border-gray-200 rounded-lg hover:border-black transition-all group"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium text-black group-hover:translate-x-2 transition-transform">
                    {option.label}
                  </span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-sm text-gray-500">
            Question {currentStep} of 3
          </p>
        </div>
      </div>

    </div>
  );
}
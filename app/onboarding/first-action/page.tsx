'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Target, Flame, Clock, AlertCircle } from 'lucide-react';

export default function FirstActionPage() {
  const router = useRouter();
  const [violentAction, setViolentAction] = useState('');
  const [deadline, setDeadline] = useState('midnight');
  const [commitment, setCommitment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const violentActionExamples = [
    { 
      action: "Cold call 10 high-ticket prospects",
      fear: "Rejection",
      result: "One yes changes everything"
    },
    { 
      action: "Double my prices today",
      fear: "Losing clients",
      result: "Attract premium customers"
    },
    { 
      action: "Fire my biggest toxic client",
      fear: "Lost revenue",
      result: "Peace and better clients"
    },
    { 
      action: "Go live with no script",
      fear: "Looking stupid",
      result: "Authentic connection"
    },
    { 
      action: "Ask for the $10k sale",
      fear: "Too expensive",
      result: "Quantum income leap"
    },
    { 
      action: "Launch before it's perfect",
      fear: "Not ready",
      result: "Real feedback, real progress"
    }
  ];

  // Check authentication
  useEffect(() => {
    const mockUser = localStorage.getItem('mockUser');
    if (!mockUser) {
      router.push('/signin');
    }
  }, [router]);

  const handleSetAction = (action: string) => {
    setViolentAction(action);
  };

  const handleComplete = () => {
    if (!violentAction || !commitment) return;
    
    setIsLoading(true);
    
    // Save first action to localStorage
    localStorage.setItem('firstAction', JSON.stringify({
      action: violentAction,
      deadline,
      commitment,
      createdAt: new Date().toISOString(),
      dateToComplete: new Date().toDateString()
    }));

    // Mark onboarding as complete
    localStorage.setItem('onboardingComplete', 'true');
    
    // Navigate directly to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="container-premium py-12">
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-3 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm">
              ✓
            </div>
            <span className="text-sm text-gray-600">Personal Manifesto</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-bold">
              2
            </div>
            <span className="text-sm text-black font-medium">Violent Action</span>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-black mb-4">
            Set Your First Violent Action
          </h1>
          <p className="text-lg text-gray-600">
            Day 1 starts NOW. What will you do TODAY that scares you?
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Warning Box */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-black mb-1">This is Non-Negotiable</h3>
                <p className="text-sm text-gray-700">
                  You MUST complete this action before midnight tonight. 
                  No excuses. No tomorrow. Today.
                </p>
              </div>
            </div>
          </div>

          {/* Action Input */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Today's Violent Action
              </label>
              <input
                type="text"
                value={violentAction}
                onChange={(e) => setViolentAction(e.target.value)}
                placeholder="What terrifies you that you'll do anyway?"
                className="input"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Be specific. Make it measurable. Make it scary.
              </p>
            </div>

            {/* Example Actions */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">
                Need inspiration? Click one:
              </p>
              <div className="space-y-3">
                {violentActionExamples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => handleSetAction(example.action)}
                    className="w-full text-left p-4 bg-white hover:bg-gray-50 border border-gray-200 rounded-lg transition-all hover:border-black group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-black group-hover:text-black">
                          {example.action}
                        </p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-gray-500">
                            Fear: {example.fear}
                          </span>
                          <span className="text-xs text-green-600">
                            → {example.result}
                          </span>
                        </div>
                      </div>
                      <Target className="w-5 h-5 text-gray-400 group-hover:text-black" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete By
              </label>
              <div className="flex items-center gap-2 text-lg font-medium">
                <Clock className="w-5 h-5 text-gray-500" />
                <span className="text-black">Tonight before midnight</span>
                <span className="text-red-500">*</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                No extensions. No excuses.
              </p>
            </div>

            {/* Commitment Statement */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type Your Commitment <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={commitment}
                onChange={(e) => setCommitment(e.target.value)}
                placeholder="I commit to [your action] before midnight"
                className="input"
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                Type it out. Make it real. Own it.
              </p>
            </div>

            {/* The Contract */}
            <div className="bg-gray-50 border-2 border-black rounded-lg p-6">
              <h3 className="font-bold text-lg mb-3 text-black">Your Contract With Yourself</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> I will complete this action TODAY
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> I will not make excuses
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> I will not negotiate with my fear
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> I will report back tonight
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-green-600 font-bold">✓</span> I understand this is how transformation begins
                </p>
              </div>
            </div>
          </div>

          {/* Complete Button */}
          <div className="mt-8">
            <button
              onClick={handleComplete}
              disabled={!violentAction || !commitment || isLoading}
              className={`w-full btn-primary ${(!violentAction || !commitment || isLoading) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                'Locking in commitment...'
              ) : (
                <>
                  Lock In My Commitment
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              After this: Start your 90-day transformation protocol
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
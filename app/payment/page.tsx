'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Lock, CreditCard, Shield, ArrowRight, AlertCircle } from 'lucide-react';

export default function PaymentPage() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check qualification status first
    const qualificationStatus = localStorage.getItem('qualificationStatus');
    if (!qualificationStatus) {
      // Not qualified, redirect to qualification
      router.push('/qualification');
      return;
    } else {
      const status = JSON.parse(qualificationStatus);
      if (!status.qualified) {
        // Failed qualification, redirect to homepage
        router.push('/');
        return;
      }
    }

    // Check if user came from signup
    const mockUser = localStorage.getItem('mockUser');
    if (!mockUser) {
      // Redirect to signup if no user
      router.push('/signup');
    } else {
      setUser(JSON.parse(mockUser));
    }
  }, [router]);

  const handlePayment = () => {
    setIsProcessing(true);
    // Mock payment processing
    setTimeout(() => {
      // Mark user as paid
      const currentUser = JSON.parse(localStorage.getItem('mockUser') || '{}');
      localStorage.setItem('mockUser', JSON.stringify({
        ...currentUser,
        isPaid: true,
        plan: 'monthly'
      }));
      
      // Navigate directly to onboarding for affirmation setup
      router.push('/onboarding');
    }, 2000);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-serif font-bold text-gray-900">Chris Disciplined</h1>
            <div className="flex items-center gap-2 text-gray-600">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Secure Checkout</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-5xl">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Left Column - Plan Details */}
          <div>
            <h2 className="text-3xl font-serif font-bold mb-2">
              Your First Violent Action
            </h2>
            <p className="text-gray-600 mb-8">
              Investing $997/month is the pattern interrupt that begins your transformation
            </p>

            {/* Single Plan */}
            <div className="border-2 border-black rounded-lg p-6 bg-white">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold mb-2">The Chris Protocol</h3>
                  <p className="text-sm text-gray-600">Subconscious Training System</p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">$997</p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Voice Recording System (MIT Research)</p>
                    <p className="text-sm text-gray-600">10x more powerful than any external source</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Daily Violent Actions</p>
                    <p className="text-sm text-gray-600">Pattern interrupts that force neural reorganization</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Vision Board Creator</p>
                    <p className="text-sm text-gray-600">8 images programming your reality filter</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Evening Feedback Loop</p>
                    <p className="text-sm text-gray-600">Discipline rating & win documentation</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Neural Pathway Formation</p>
                    <p className="text-sm text-gray-600">Permanent transformation through daily training</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Direct Founder Access</p>
                    <p className="text-sm text-gray-600">Chris Disciplined's personal guidance</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm font-bold text-red-600">
                  NO REFUNDS. NO GUARANTEES. NO EXCUSES.
                </p>
                <p className="text-center text-xs text-gray-600 mt-2">
                  The system works if you work. Miss one day, start over.
                </p>
              </div>
            </div>

            {/* Transformation Promise */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h4 className="font-bold text-lg mb-3">What Happens When You Commit:</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>• Your subconscious will be systematically reprogrammed</li>
                <li>• Old patterns that held you back for years will be broken</li>
                <li>• You'll take actions that terrify your current self</li>
                <li>• Opportunities will appear that were always invisible</li>
                <li>• Your income will reflect your new mental programming</li>
              </ul>
              <p className="text-xs text-gray-600 mt-4 font-semibold">
                Based on MIT, Harvard, and Stanford neuroscience research.
              </p>
            </div>

          </div>

          {/* Right Column - Payment Form */}
          <div>
            <div className="bg-white rounded-lg p-8 border border-gray-200">
              <h3 className="text-xl font-bold mb-6">Payment Information</h3>
              
              {/* Investment Psychology Message */}
              <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
                <p className="text-sm font-bold mb-1 text-gray-900">This is your first violent action.</p>
                <p className="text-xs text-gray-700">
                  When you invest $997/month, your subconscious knows you're serious. 
                  The price is the commitment device that ensures execution.
                </p>
              </div>
              
              {/* Card Details */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      placeholder="123"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Billing ZIP Code
                  </label>
                  <input
                    type="text"
                    placeholder="12345"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founding Member Rate</span>
                    <span className="font-bold">$997.00</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Billed monthly</span>
                    <span>Locked forever</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="text-lg font-bold">Due Today</span>
                    <span className="text-2xl font-bold">$997</span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full mt-6 bg-black text-white font-bold py-4 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing Payment...</span>
                ) : (
                  <>
                    Complete Violent Action • Pay $997
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              {/* Security Badges */}
              <div className="mt-6 flex items-center justify-center gap-6 text-xs text-gray-500">
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>SSL Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <CreditCard className="w-4 h-4" />
                  <span>PCI Compliant</span>
                </div>
                <div className="flex items-center gap-1">
                  <Lock className="w-4 h-4" />
                  <span>256-bit Encryption</span>
                </div>
              </div>

              {/* No Guarantee */}
              <div className="mt-6 p-3 bg-red-50 border border-red-200 rounded">
                <p className="text-xs text-red-800 font-bold text-center">
                  FINAL WARNING: No refunds. No guarantees. No excuses.
                </p>
                <p className="text-xs text-red-700 text-center mt-1">
                  Your $997 is gone whether you execute or not. This forces commitment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
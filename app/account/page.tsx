'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, CreditCard, Shield, LogOut, AlertCircle, Check } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function AccountPage() {
  const router = useRouter();
  interface UserData {
    email: string;
    name: string;
    memberNumber: string;
    joinDate: string;
    subscriptionStatus: string;
    nextBilling: string;
    planName: string;
    planPrice: number;
    lockedPrice: boolean;
  }
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Temporarily disabled auth for development
    // const mockUser = localStorage.getItem('mockUser');
    // if (!mockUser) {
    //   router.push('/signin');
    //   return;
    // }

    // const user = JSON.parse(mockUser);
    
    // Set default user for development
    const user = { email: 'chris@disciplined.com', name: 'Chris' };
    
    // Mock additional user data
    const enrichedUser = {
      ...user,
      name: user.name || 'Founding Member',
      memberNumber: '047',
      joinDate: '2024-01-15',
      subscriptionStatus: 'Active',
      nextBilling: '2024-02-15',
      planName: 'Founding Member',
      planPrice: 997,
      lockedPrice: true
    };
    
    setUserData(enrichedUser);
  }, [router]);

  const handleLogout = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.removeItem('mockUser');
      localStorage.removeItem('userAffirmations');
      sessionStorage.clear();
      router.push('/');
    }, 500);
  };

  const handleCancelSubscription = () => {
    if (confirm('Are you sure? You\'ll lose your $997 founding member rate forever. This cannot be undone.')) {
      alert('Subscription cancelled. Your transformation journey ends at the next billing date.');
    }
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Account</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your membership and billing</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Founding Member Badge */}
        <div className="bg-white border-2 border-gray-900 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold mb-2 text-gray-900">Founding Member #{userData.memberNumber}</h2>
              <p className="text-sm text-gray-600">
                You&apos;re one of the first 50 members. Your $997/month rate is locked forever.
              </p>
            </div>
            <Shield className="w-12 h-12 text-gray-900" />
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Account Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium text-gray-900">{userData.name}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium text-gray-900">{userData.email}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="font-medium text-gray-900">{new Date(userData.joinDate).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Details */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Subscription</h3>
          
          <div className="space-y-4">
            {/* Plan Details */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-bold text-gray-900">{userData.planName}</p>
                  <p className="text-sm text-gray-600">Chris Protocol - Full Access</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">${userData.planPrice}</p>
                  <p className="text-sm text-gray-600">per month</p>
                </div>
              </div>
              
              {userData.lockedPrice && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  <span>Price locked forever as founding member</span>
                </div>
              )}
            </div>

            {/* Billing Info */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                  {userData.subscriptionStatus}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Next billing date</span>
                <span className="font-medium text-gray-900">
                  {new Date(userData.nextBilling).toLocaleDateString()}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Payment method</span>
                <div className="flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-gray-400" />
                  <span className="font-medium text-gray-900">•••• 4242</span>
                </div>
              </div>
            </div>

            {/* Update Payment Button */}
            <button className="w-full py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium">
              Update Payment Method
            </button>
          </div>
        </div>

        {/* What You Get */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">What You Get</h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Daily Voice Recording System</p>
                <p className="text-sm text-gray-600">10-minute neural reprogramming protocol</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Violent Action Framework</p>
                <p className="text-sm text-gray-600">Daily actions that force transformation</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Progress Tracking</p>
                <p className="text-sm text-gray-600">Neural pathway formation monitoring</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Direct Founder Access</p>
                <p className="text-sm text-gray-600">Chris Disciplined&apos;s personal guidance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white rounded-lg p-6 border border-red-200">
          <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
          
          <div className="space-y-4">
            {/* Cancel Subscription */}
            <div>
              <div className="flex items-start gap-3 mb-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Cancel Subscription</p>
                  <p className="text-sm text-gray-600 mb-3">
                    Once you cancel, you lose your $997 founding member rate forever. 
                    If you rejoin, you&apos;ll pay the current rate (currently $1,497/month).
                  </p>
                  <button 
                    onClick={handleCancelSubscription}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                  >
                    Cancel Subscription
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-4">
              {/* Logout */}
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="flex items-center gap-2 text-gray-700 hover:text-black transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                {isLoading ? 'Logging out...' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
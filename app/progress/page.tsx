'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Flame, Target, Calendar, DollarSign, Brain, Zap, Award, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function ProgressPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    longestStreak: 0,
    totalDays: 0,
    completionRate: 0
  });

  useEffect(() => {
    // Check authentication
    const mockUser = localStorage.getItem('mockUser');
    if (!mockUser) {
      router.push('/signin');
      return;
    }

    // Load user data and calculate progress
    const user = JSON.parse(mockUser);
    setUserData(user);

    // Load affirmations data for income tracking
    const affirmations = localStorage.getItem('userAffirmations');
    if (affirmations) {
      const data = JSON.parse(affirmations);
      setUserData({ ...user, affirmationData: data.raw });
    }

    // Mock streak data (in production, this would come from backend)
    const mockStreak = {
      currentStreak: 12,
      longestStreak: 21,
      totalDays: 42,
      completionRate: 93
    };
    setStreakData(mockStreak);
  }, [router]);

  // Calculate days into program
  const programStartDate = new Date('2024-01-01'); // Mock start date
  const today = new Date();
  const daysInProgram = Math.floor((today.getTime() - programStartDate.getTime()) / (1000 * 60 * 60 * 24));
  const daysUntil90 = Math.max(0, 90 - daysInProgram);

  // Mock daily discipline ratings
  const disciplineHistory = [
    { day: 1, rating: 8 },
    { day: 2, rating: 9 },
    { day: 3, rating: 7 },
    { day: 4, rating: 10 },
    { day: 5, rating: 9 },
    { day: 6, rating: 10 },
    { day: 7, rating: 8 }
  ];

  const avgDiscipline = Math.round(disciplineHistory.reduce((acc, d) => acc + d.rating, 0) / disciplineHistory.length * 10) / 10;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Transformation Progress</h1>
              <p className="text-sm text-gray-600 mt-1">Track your journey to becoming unstoppable</p>
            </div>
            <Link 
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-1"
            >
              Back to Dashboard
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* 90-Day Progress */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">90-Day Neural Pathway Formation</h2>
            <span className="text-sm text-gray-600">Day {Math.min(daysInProgram, 90)} of 90</span>
          </div>
          
          <div className="mb-4">
            <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-gray-800 to-black transition-all duration-500"
                style={{ width: `${Math.min((daysInProgram / 90) * 100, 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-600">
              <span>Formation (Days 1-21)</span>
              <span>Strengthening (Days 22-66)</span>
              <span>Permanence (Days 67-90)</span>
            </div>
          </div>

          {daysUntil90 > 0 ? (
            <p className="text-sm text-gray-700">
              <span className="font-bold">{daysUntil90} days</span> until permanent transformation
            </p>
          ) : (
            <p className="text-sm text-green-600 font-bold">
              Transformation Complete! Continue for compound results.
            </p>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid md:grid-cols-4 gap-4 mb-6">
          {/* Current Streak */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-8 h-8 text-orange-500" />
              <span className="text-3xl font-bold text-gray-900">{streakData.currentStreak}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Current Streak</p>
            <p className="text-xs text-gray-500 mt-1">Days in a row</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-green-500" />
              <span className="text-3xl font-bold text-gray-900">{streakData.completionRate}%</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Completion Rate</p>
            <p className="text-xs text-gray-500 mt-1">Daily protocol</p>
          </div>

          {/* Average Discipline */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Brain className="w-8 h-8 text-purple-500" />
              <span className="text-3xl font-bold text-gray-900">{avgDiscipline}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Avg Discipline</p>
            <p className="text-xs text-gray-500 mt-1">Last 7 days</p>
          </div>

          {/* Total Days */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-8 h-8 text-blue-500" />
              <span className="text-3xl font-bold text-gray-900">{streakData.totalDays}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Total Days</p>
            <p className="text-xs text-gray-500 mt-1">Since joining</p>
          </div>
        </div>

        {/* Income Progression */}
        {userData?.affirmationData && (
          <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Income Transformation Timeline</h2>
            
            <div className="space-y-4">
              {/* Current */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  <div>
                    <p className="font-medium text-gray-900">Starting Point</p>
                    <p className="text-sm text-gray-600">Where you began</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  ${userData.affirmationData.currentReality || '0'}/mo
                </span>
              </div>

              {/* 90-Day Target */}
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-center gap-3">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-gray-900">90-Day Target</p>
                    <p className="text-sm text-gray-600">{daysUntil90} days remaining</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  ${userData.affirmationData.yearGoal || '15000'}/mo
                </span>
              </div>

              {/* 12-Month Vision */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">12-Month Vision</p>
                    <p className="text-sm text-gray-600">Your transformed reality</p>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">
                  ${userData.affirmationData.ultimateVision || '50000'}/mo
                </span>
              </div>
            </div>

            {/* Growth Percentage */}
            <div className="mt-6 p-4 bg-black text-white rounded-lg">
              <p className="text-sm mb-1">Projected 90-Day Growth</p>
              <p className="text-2xl font-bold">
                {Math.round(((userData.affirmationData.yearGoal - userData.affirmationData.currentReality) / userData.affirmationData.currentReality) * 100)}% 
                <span className="text-sm font-normal ml-2">increase</span>
              </p>
            </div>
          </div>
        )}

        {/* Discipline History */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Last 7 Days Discipline</h2>
          
          <div className="flex items-end justify-between h-32 mb-4">
            {disciplineHistory.map((day) => (
              <div key={day.day} className="flex flex-col items-center flex-1">
                <div 
                  className={`w-full mx-1 rounded-t transition-all ${
                    day.rating === 10 ? 'bg-green-500' : 
                    day.rating >= 8 ? 'bg-gray-800' : 
                    day.rating >= 6 ? 'bg-gray-600' : 
                    'bg-red-500'
                  }`}
                  style={{ height: `${(day.rating / 10) * 100}%` }}
                />
                <span className="text-xs text-gray-600 mt-2">Day {day.day}</span>
                <span className="text-xs font-bold">{day.rating}</span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <p className="text-gray-600">Average: <span className="font-bold text-gray-900">{avgDiscipline}/10</span></p>
            <p className="text-gray-600">Perfect Days: <span className="font-bold text-gray-900">2</span></p>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Achievements Unlocked</h2>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <Award className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="font-medium text-gray-900">First Week Warrior</p>
                <p className="text-xs text-gray-600">Completed 7 days</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <Flame className="w-8 h-8 text-green-600" />
              <div>
                <p className="font-medium text-gray-900">Streak Master</p>
                <p className="text-xs text-gray-600">10-day streak</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <Brain className="w-8 h-8 text-purple-600" />
              <div>
                <p className="font-medium text-gray-900">Perfect Discipline</p>
                <p className="text-xs text-gray-600">Rated 10/10</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
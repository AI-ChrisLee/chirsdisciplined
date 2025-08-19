'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Flame, Target, Calendar, Brain, CheckCircle, X, Moon } from 'lucide-react';
import Navigation from '@/components/Navigation';

export default function ProgressPage() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');
  const [selectedDetail, setSelectedDetail] = useState<{ type: string; day: { weekday?: string; day: number; violentAction?: string; eveningFeedback?: { actionCompleted: boolean; disciplineRating: number; biggestWin: string; completedAt: string } }; data: unknown } | null>(null);
  const [streakData, setStreakData] = useState({
    currentStreak: 12,
    longestStreak: 21,
    totalDays: 42,
    completionRate: 93
  });

  useEffect(() => {
    // Check authentication
    if (typeof window === 'undefined') return;
    
    const mockUser = localStorage.getItem('mockUser');
    if (!mockUser) {
      router.push('/signin');
      return;
    }

    // Mock streak data (in production, this would come from backend)
    setStreakData({
      currentStreak: 12,
      longestStreak: 21,
      totalDays: 42,
      completionRate: 93
    });
  }, [router]);

  // Calculate average discipline
  const avgDiscipline = 8.7;

  // Generate calendar data
  const generateCalendarData = () => {
    const today = new Date();
    const data = [];
    
    if (viewMode === 'week') {
      // Generate 7 days (current week)
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateStr = date.toDateString();
        const hasRecording = typeof window !== 'undefined' ? localStorage.getItem(`recording_${dateStr}`) : null;
        const violentAction = typeof window !== 'undefined' ? localStorage.getItem(`violentAction_${dateStr}`) : null;
        const eveningData = typeof window !== 'undefined' ? localStorage.getItem(`eveningSession_${dateStr}`) : null;
        
        data.push({
          date: date,
          day: date.getDate(),
          weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
          morningRitual: !!hasRecording,
          violentAction: violentAction || null,
          eveningFeedback: eveningData ? JSON.parse(eveningData) : null,
          disciplineRating: eveningData ? JSON.parse(eveningData).disciplineRating : null,
          isToday: i === 0,
          isFuture: false
        });
      }
    } else {
      // Generate 30 days (current month view)
      const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
      const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      const startPadding = firstDay.getDay();
      
      // Add padding days from previous month
      for (let i = startPadding - 1; i >= 0; i--) {
        const date = new Date(firstDay);
        date.setDate(date.getDate() - (i + 1));
        data.push({
          date: date,
          day: date.getDate(),
          weekday: '',
          completed: false,
          disciplineRating: null,
          isToday: false,
          isFuture: false,
          isPadding: true
        });
      }
      
      // Add days of current month
      for (let day = 1; day <= lastDay.getDate(); day++) {
        const date = new Date(today.getFullYear(), today.getMonth(), day);
        const dateStr = date.toDateString();
        const hasRecording = typeof window !== 'undefined' ? localStorage.getItem(`recording_${dateStr}`) : null;
        const violentAction = typeof window !== 'undefined' ? localStorage.getItem(`violentAction_${dateStr}`) : null;
        const eveningData = typeof window !== 'undefined' ? localStorage.getItem(`eveningSession_${dateStr}`) : null;
        const isFuture = date > today;
        
        data.push({
          date: date,
          day: day,
          weekday: '',
          morningRitual: !isFuture && !!hasRecording,
          violentAction: !isFuture ? violentAction : null,
          eveningFeedback: !isFuture ? (eveningData ? JSON.parse(eveningData) : null) : null,
          disciplineRating: eveningData ? JSON.parse(eveningData).disciplineRating : null,
          isToday: date.toDateString() === today.toDateString(),
          isFuture: isFuture
        });
      }
    }
    
    return data;
  };

  const calendarData = generateCalendarData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Progress Tracking</h1>
            <p className="text-sm text-gray-600 mt-1">Your transformation metrics</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Key Metrics - 4 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {/* Current Streak */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Flame className="w-8 h-8 text-gray-600" />
              <span className="text-3xl font-bold text-gray-900">{streakData.currentStreak}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Current Streak</p>
            <p className="text-xs text-gray-500 mt-1">Days in a row</p>
          </div>

          {/* Average Discipline */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Brain className="w-8 h-8 text-gray-600" />
              <span className="text-3xl font-bold text-gray-900">{avgDiscipline}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Avg Discipline</p>
            <p className="text-xs text-gray-500 mt-1">Last 30 days</p>
          </div>

          {/* Total Days */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Calendar className="w-8 h-8 text-gray-600" />
              <span className="text-3xl font-bold text-gray-900">{streakData.totalDays}</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Total Days</p>
            <p className="text-xs text-gray-500 mt-1">Since joining</p>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <Target className="w-8 h-8 text-gray-600" />
              <span className="text-3xl font-bold text-gray-900">{streakData.completionRate}%</span>
            </div>
            <p className="text-sm font-medium text-gray-700">Completion Rate</p>
            <p className="text-xs text-gray-500 mt-1">Daily protocol</p>
          </div>
        </div>

        {/* Calendar View */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Activity Calendar</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'week' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  viewMode === 'month' 
                    ? 'bg-black text-white' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Month
              </button>
            </div>
          </div>

          {viewMode === 'week' ? (
            /* Weekly View */
            <div className="space-y-3">
              {calendarData.map((day, index) => (
                <div key={index} className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                  {/* Date Section */}
                  <div className="w-16 text-center">
                    <p className="text-xs font-medium text-gray-600">{day.weekday}</p>
                    <p className="text-2xl font-bold text-gray-900">{day.day}</p>
                  </div>
                  
                  {/* Divider */}
                  <div className="w-px h-12 bg-gray-200" />
                  
                  {/* Status Indicators */}
                  {day.isFuture ? (
                    <div className="flex-1 text-sm text-gray-400">Upcoming</div>
                  ) : (
                    <div className="flex-1 flex items-center gap-6">
                      {/* Morning Ritual */}
                      <button
                        onClick={() => setSelectedDetail({ type: 'morning', day, data: day.morningRitual })}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          day.morningRitual ? 'bg-green-100' : 'bg-red-100'
                        }`}>
                          {day.morningRitual ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <X className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">Morning</span>
                      </button>
                      
                      {/* Violent Action */}
                      <button
                        onClick={() => setSelectedDetail({ type: 'action', day, data: day.violentAction })}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          day.violentAction ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {day.violentAction ? (
                            <Target className="w-5 h-5 text-green-600" />
                          ) : (
                            <Target className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="text-sm font-medium text-gray-700">Action</span>
                          {day.violentAction && (
                            <span className="text-xs text-gray-500 max-w-[200px] truncate" title={day.violentAction}>
                              {day.violentAction}
                            </span>
                          )}
                        </div>
                      </button>
                      
                      {/* Evening Review */}
                      <button
                        onClick={() => setSelectedDetail({ type: 'evening', day, data: day.eveningFeedback })}
                        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          day.eveningFeedback 
                            ? (day.eveningFeedback.actionCompleted ? 'bg-green-100' : 'bg-yellow-100')
                            : 'bg-gray-100'
                        }`}>
                          {day.eveningFeedback ? (
                            day.eveningFeedback.actionCompleted ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <X className="w-5 h-5 text-yellow-600" />
                            )
                          ) : (
                            <Moon className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">Evening</span>
                      </button>
                    </div>
                  )}
                  
                  {/* Right Section - Discipline & Today Badge */}
                  <div className="flex items-center gap-4">
                    {day.disciplineRating && (
                      <div className="text-center">
                        <p className="text-xs text-gray-600">Discipline</p>
                        <p className="text-lg font-bold text-gray-900">{day.disciplineRating}/10</p>
                      </div>
                    )}
                    {day.isToday && (
                      <span className="px-3 py-1 bg-black text-white text-xs font-medium rounded-full">
                        TODAY
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Monthly View */
            <div>
              {/* Weekday headers */}
              <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center">
                    <p className="text-xs font-medium text-gray-600">{day}</p>
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarData.map((day, index) => {
                  const allComplete = day.morningRitual && day.violentAction && day.eveningFeedback;
                  const partialComplete = day.morningRitual || day.violentAction || day.eveningFeedback;
                  
                  return (
                    <div
                      key={index}
                      className={`aspect-square p-2 rounded-lg border ${
                        day.isPadding 
                          ? 'bg-gray-50 border-gray-100' 
                          : day.isToday 
                            ? 'bg-black text-white border-black' 
                            : day.isFuture 
                              ? 'bg-gray-50 border-gray-200'
                              : allComplete 
                                ? 'bg-green-50 border-green-200' 
                                : partialComplete
                                  ? 'bg-yellow-50 border-yellow-200'
                                  : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex flex-col h-full">
                        <p className={`text-xs font-medium ${
                          day.isToday ? 'text-white' : 'text-gray-900'
                        }`}>
                          {day.day}
                        </p>
                        {!day.isPadding && !day.isFuture && (
                          <div className="flex-1 flex flex-col justify-center items-center gap-1">
                            <div className="flex gap-0.5">
                              {/* Morning Ritual Indicator */}
                              <div 
                                className={`w-2 h-2 rounded-full ${
                                  day.morningRitual 
                                    ? (day.isToday ? 'bg-white' : 'bg-green-500')
                                    : 'bg-gray-300'
                                }`} 
                                title="Morning Ritual"
                              />
                              {/* Violent Action Indicator */}
                              <div 
                                className={`w-2 h-2 rounded-full ${
                                  day.violentAction 
                                    ? (day.isToday ? 'bg-white' : 'bg-green-500')
                                    : 'bg-gray-300'
                                }`}
                                title="Violent Action"
                              />
                              {/* Evening Feedback Indicator */}
                              <div 
                                className={`w-2 h-2 rounded-full ${
                                  day.eveningFeedback 
                                    ? (day.isToday ? 'bg-white' : 'bg-green-500')
                                    : 'bg-gray-300'
                                }`}
                                title="Evening Review"
                              />
                            </div>
                            {day.disciplineRating && (
                              <p className={`text-xs font-bold ${
                                day.isToday ? 'text-white' : 'text-gray-700'
                              }`}>
                                {day.disciplineRating}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* Legend */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span className="text-gray-600">All Complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                    <span className="text-gray-600">Partial</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex gap-0.5">
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                    </div>
                    <span className="text-gray-600">Missed</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  Each dot represents: Morning Ritual • Violent Action • Evening Review
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedDetail(null)}
        >
          <div 
            className="bg-white rounded-xl p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {selectedDetail.type === 'morning' && (
                  <>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedDetail.data ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {selectedDetail.data ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : (
                        <X className="w-6 h-6 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Morning Ritual</h3>
                      <p className="text-sm text-gray-600">
                        {selectedDetail.day.weekday}, {selectedDetail.day.day}
                      </p>
                    </div>
                  </>
                )}
                {selectedDetail.type === 'action' && (
                  <>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedDetail.data ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <Target className={`w-6 h-6 ${
                        selectedDetail.data ? 'text-green-600' : 'text-gray-400'
                      }`} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Violent Action</h3>
                      <p className="text-sm text-gray-600">
                        {selectedDetail.day.weekday}, {selectedDetail.day.day}
                      </p>
                    </div>
                  </>
                )}
                {selectedDetail.type === 'evening' && (
                  <>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      selectedDetail.data 
                        ? (selectedDetail.data.actionCompleted ? 'bg-green-100' : 'bg-yellow-100')
                        : 'bg-gray-100'
                    }`}>
                      {selectedDetail.data ? (
                        selectedDetail.data.actionCompleted ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <X className="w-6 h-6 text-yellow-600" />
                        )
                      ) : (
                        <Moon className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Evening Review</h3>
                      <p className="text-sm text-gray-600">
                        {selectedDetail.day.weekday}, {selectedDetail.day.day}
                      </p>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="space-y-4">
              {selectedDetail.type === 'morning' && (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedDetail.data ? '✅ Completed' : '❌ Not Completed'}
                    </p>
                  </div>
                  {selectedDetail.data && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Recording</p>
                      <p className="text-sm text-gray-600">
                        10-minute affirmation recording completed
                      </p>
                    </div>
                  )}
                </>
              )}

              {selectedDetail.type === 'action' && (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Today's Violent Action</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedDetail.data || 'No action set'}
                    </p>
                  </div>
                  {selectedDetail.day.violentAction && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                      <p className="text-sm text-gray-600">
                        {selectedDetail.day.eveningFeedback 
                          ? (selectedDetail.day.eveningFeedback.actionCompleted 
                              ? '✅ Action Completed' 
                              : '❌ Action Not Completed')
                          : '⏳ Pending Evening Review'}
                      </p>
                    </div>
                  )}
                </>
              )}

              {selectedDetail.type === 'evening' && selectedDetail.data && (
                <>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Discipline Rating</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-gray-900">
                        {selectedDetail.data.disciplineRating}/10
                      </p>
                      <div className="flex gap-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-6 rounded-sm ${
                              i < selectedDetail.data.disciplineRating 
                                ? 'bg-black' 
                                : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Violent Action Status</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedDetail.data.actionCompleted 
                        ? '✅ Completed' 
                        : '❌ Not Completed'}
                    </p>
                    {selectedDetail.day.violentAction && (
                      <p className="text-sm text-gray-600 mt-2">
                        Action: {selectedDetail.day.violentAction}
                      </p>
                    )}
                  </div>

                  {selectedDetail.data.biggestWin && (
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-700 mb-2">Biggest Win Journal</p>
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {selectedDetail.data.biggestWin}
                      </p>
                    </div>
                  )}

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-1">Completed At</p>
                    <p className="text-sm text-gray-600">
                      {new Date(selectedDetail.data.completedAt).toLocaleString()}
                    </p>
                  </div>
                </>
              )}

              {selectedDetail.type === 'evening' && !selectedDetail.data && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                  <p className="text-lg font-bold text-gray-900">
                    ⏳ Evening Review Pending
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    Complete your evening review to track discipline and document wins
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
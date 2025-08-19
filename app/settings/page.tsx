'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Bell, Clock, Volume2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function SettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    morningAlarm: '05:30',
    eveningReminder: '20:00',
    pushNotifications: true,
    emailReminders: true,
    soundEnabled: true,
    autoPlayRecording: true
  });

  useEffect(() => {
    // Check authentication
    const mockUser = localStorage.getItem('mockUser');
    if (!mockUser) {
      router.push('/signin');
      return;
    }

    // Load saved settings
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, [router]);

  const handleSettingChange = (key: string, value: string | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('userSettings', JSON.stringify(newSettings));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
            <p className="text-sm text-gray-600 mt-1">Customize your transformation protocol</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Time Settings */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Daily Schedule
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Morning Protocol Time</p>
                <p className="text-sm text-gray-600">When you&apos;ll record affirmations</p>
              </div>
              <input
                type="time"
                value={settings.morningAlarm}
                onChange={(e) => handleSettingChange('morningAlarm', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Evening Check-in Time</p>
                <p className="text-sm text-gray-600">Rate discipline and document wins</p>
              </div>
              <input
                type="time"
                value={settings.eveningReminder}
                onChange={(e) => handleSettingChange('eveningReminder', e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-black"
              />
            </div>

          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Push Notifications</p>
                <p className="text-sm text-gray-600">Daily reminders and streak alerts</p>
              </div>
              <button
                onClick={() => handleSettingChange('pushNotifications', !settings.pushNotifications)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.pushNotifications ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Email Reminders</p>
                <p className="text-sm text-gray-600">Weekly progress and tips</p>
              </div>
              <button
                onClick={() => handleSettingChange('emailReminders', !settings.emailReminders)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailReminders ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailReminders ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* App Settings */}
        <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Settings className="w-5 h-5" />
            App Preferences
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Sound Effects</p>
                <p className="text-sm text-gray-600">Play sounds for actions</p>
              </div>
              <button
                onClick={() => handleSettingChange('soundEnabled', !settings.soundEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.soundEnabled ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Auto-play Recording</p>
                <p className="text-sm text-gray-600">Play affirmations at bedtime</p>
              </div>
              <button
                onClick={() => handleSettingChange('autoPlayRecording', !settings.autoPlayRecording)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoPlayRecording ? 'bg-black' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.autoPlayRecording ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

          </div>
        </div>


        {/* Quick Actions */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600 mb-4">Need help?</p>
          <div className="flex justify-center gap-4">
            <Link 
              href="/support"
              className="text-sm font-medium text-black hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/supabase-auth-provider'
import { useRouter } from 'next/navigation'
import { CheckCircle, Users, Calendar, Zap, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function WaitlistPage() {
  const { profile, loading } = useAuth()
  const router = useRouter()
  const [daysUntilLaunch, setDaysUntilLaunch] = useState(0)
  
  useEffect(() => {
    // Calculate days until September 1st
    const launchDate = new Date('2025-09-01')
    const today = new Date()
    const diffTime = Math.abs(launchDate.getTime() - today.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    setDaysUntilLaunch(diffDays)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const memberNumber = profile?.member_number || '000'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <span className="text-sm uppercase tracking-wider text-gray-400">Welcome to</span>
            <h1 className="text-5xl font-serif font-bold mt-2">Chris Disciplined</h1>
          </div>
          
          {/* Member Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-600 to-yellow-500 text-black px-6 py-3 rounded-full font-bold">
            <Users className="w-5 h-5 mr-2" />
            Founding Member #{memberNumber}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-3xl mx-auto">
          {/* Launch Countdown */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 text-center border border-gray-700">
            <Calendar className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Launching September 1st, 2025</h2>
            <p className="text-xl text-gray-300 mb-6">{daysUntilLaunch} days until transformation begins</p>
            
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-500">{Math.floor(daysUntilLaunch / 30)}</div>
                <div className="text-sm text-gray-400">Months</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-500">{Math.floor(daysUntilLaunch / 7)}</div>
                <div className="text-sm text-gray-400">Weeks</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-yellow-500">{daysUntilLaunch}</div>
                <div className="text-sm text-gray-400">Days</div>
              </div>
            </div>
            
            <p className="text-gray-400">
              You&apos;re among the first {memberNumber} people to secure your spot
            </p>
          </div>

          {/* What Happens Next */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">What Happens Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Your spot is reserved</p>
                  <p className="text-gray-400 text-sm">As Founding Member #{memberNumber}, you have lifetime benefits</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">48-hour early access on Sept 1st</p>
                  <p className="text-gray-400 text-sm">You&apos;ll get exclusive access before public launch</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Founding member price: $9.97/month</p>
                  <p className="text-gray-400 text-sm">Locked in forever (future price: $19.97)</p>
                </div>
              </div>
              <div className="flex items-start">
                <CheckCircle className="w-6 h-6 text-green-500 mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold">We&apos;ll email you when doors open</p>
                  <p className="text-gray-400 text-sm">Check {profile?.email} for updates</p>
                </div>
              </div>
            </div>
          </div>

          {/* Exclusive Benefits */}
          <div className="bg-gradient-to-r from-yellow-900/30 to-orange-900/30 rounded-2xl p-8 mb-8 border border-yellow-700/50">
            <div className="flex items-center mb-4">
              <Zap className="w-8 h-8 text-yellow-500 mr-3" />
              <h3 className="text-2xl font-bold">Your Founding Member Benefits</h3>
            </div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">•</span>
                Lifetime access to $9.97 monthly rate (50% off future price)
              </li>
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">•</span>
                Founding Member #{memberNumber} badge in community
              </li>
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">•</span>
                Priority support and feature requests
              </li>
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">•</span>
                Exclusive monthly calls with Chris
              </li>
              <li className="flex items-center">
                <span className="text-yellow-500 mr-2">•</span>
                Access to beta features before anyone else
              </li>
            </ul>
          </div>

          {/* Share Section */}
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">Want to help spread the movement?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  const text = `I just secured my spot as Founding Member #${memberNumber} at Chris Disciplined. Only accepting first 500 members. Join the waitlist:`
                  const url = window.location.origin
                  window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
                }}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Share on Twitter
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.origin)
                  alert('Link copied to clipboard!')
                }}
                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
              >
                Copy Link
              </button>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12 pb-8">
            <p className="text-gray-400 mb-2">While you wait, prepare your mind</p>
            <p className="text-2xl font-bold mb-6">The transformation begins September 1st</p>
            <Link
              href="/dashboard"
              className="inline-flex items-center px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-100 transition-colors"
            >
              Preview Dashboard
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <p className="text-xs text-gray-500 mt-4">Demo mode - Full features unlock Sept 1st</p>
          </div>
        </div>
      </div>
    </div>
  )
}
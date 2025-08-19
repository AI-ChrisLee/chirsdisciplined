'use client'

import { useEffect } from 'react'
import { CheckCircle } from 'lucide-react'

export default function ProtocolDownloadPage() {
  useEffect(() => {
    // In production, this would trigger email sending with the morning protocol
    const email = localStorage.getItem('qualification_email')
    if (email) {
      console.log('Send 7-day morning protocol to:', email)
      // Here you would integrate with your email service
    }
  }, [])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          
          {/* Title */}
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-black mb-6">
            You're On The List!
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-gray-600 mb-12 max-w-lg mx-auto">
            We'll send you The Violent Morning Protocol on September 1st
          </p>

          {/* Instructions Box */}
          <div className="max-w-md mx-auto space-y-6">
            <div className="bg-white rounded-lg p-6 border-2 border-black">
              <p className="font-bold text-lg mb-3 text-black">📅 Mark Your Calendar:</p>
              <p className="text-gray-600 mb-4">
                September 1st - The Violent Morning Protocol arrives in your inbox
              </p>
              <p className="text-sm text-gray-500">
                Make sure to whitelist our email so you don't miss it
              </p>
            </div>
            
            {/* Secret Bonus Box */}
            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
              <p className="font-bold text-lg mb-3 text-black">🎁 Secret Bonus:</p>
              <p className="text-gray-600 leading-relaxed">
                Reply "DISCIPLINED" to our welcome email and get 1 month free when we launch ($997 value)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
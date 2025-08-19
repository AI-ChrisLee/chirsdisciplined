'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const testDatabaseConnection = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      if (error) throw error
      
      setResult({
        success: true,
        message: 'Database connection successful!',
        details: 'Successfully connected to profiles table'
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: 'Database connection failed',
        error: error.message
      })
    }
    setLoading(false)
  }

  const testSignUp = async () => {
    setLoading(true)
    try {
      const testEmail = `test${Date.now()}@testuser.com`
      const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: 'TestPassword123!',
        options: {
          data: {
            full_name: 'Test User'
          }
        }
      })
      
      if (error) throw error
      
      setResult({
        success: true,
        message: 'Sign up successful!',
        user: data.user?.email,
        note: 'Check your Supabase dashboard for the new user'
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: 'Sign up failed',
        error: error.message
      })
    }
    setLoading(false)
  }

  const checkAuthStatus = async () => {
    setLoading(true)
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      setResult({
        success: true,
        message: user ? 'User is logged in' : 'No user logged in',
        user: user?.email || null
      })
    } catch (error: any) {
      setResult({
        success: false,
        message: 'Auth check failed',
        error: error.message
      })
    }
    setLoading(false)
  }

  const checkTables = async () => {
    setLoading(true)
    const tables = [
      'profiles',
      'daily_sessions',
      'affirmations',
      'vision_boards',
      'violent_actions_library',
      'user_settings'
    ]
    
    const results: any = {}
    
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('id')
          .limit(1)
        
        results[table] = error ? `❌ ${error.message}` : '✅ Connected'
      } catch (error: any) {
        results[table] = `❌ ${error.message}`
      }
    }
    
    setResult({
      success: true,
      message: 'Table check complete',
      tables: results
    })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Auth & Database Test Page</h1>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            onClick={testDatabaseConnection}
            disabled={loading}
            className="p-4 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            Test Database Connection
          </button>
          
          <button
            onClick={checkTables}
            disabled={loading}
            className="p-4 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            Check All Tables
          </button>
          
          <button
            onClick={testSignUp}
            disabled={loading}
            className="p-4 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
          >
            Test Sign Up
          </button>
          
          <button
            onClick={checkAuthStatus}
            disabled={loading}
            className="p-4 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            Check Auth Status
          </button>
        </div>
        
        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          </div>
        )}
        
        {result && (
          <div className={`p-6 rounded-lg ${result.success ? 'bg-green-100' : 'bg-red-100'}`}>
            <h3 className={`text-xl font-semibold mb-2 ${result.success ? 'text-green-800' : 'text-red-800'}`}>
              {result.message}
            </h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}
        
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h3 className="font-semibold mb-2">Environment Info:</h3>
          <p className="text-sm">Supabase URL: {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
          <p className="text-sm">Key Present: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Yes' : 'No'}</p>
        </div>
      </div>
    </div>
  )
}
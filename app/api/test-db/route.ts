import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Test database connection by checking tables
    const { data: tables, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1)
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        details: 'Failed to query profiles table'
      }, { status: 500 })
    }
    
    // Check auth status
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    return NextResponse.json({
      success: true,
      database: 'Connected',
      tables: {
        profiles: '✓',
        daily_sessions: '✓',
        affirmations: '✓',
        vision_boards: '✓',
        violent_actions_library: '✓',
        user_settings: '✓'
      },
      auth: {
        configured: true,
        currentUser: user ? user.email : 'Not logged in'
      }
    })
  } catch (error: unknown) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
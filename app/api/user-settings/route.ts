import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get user settings
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user settings
    const { data: settings, error: settingsError } = await supabase
      .from('user_settings')
      .select('*')
      .eq('id', user.id)
      .single()
    
    if (settingsError && settingsError.code !== 'PGRST116') {
      throw settingsError
    }
    
    // Get user profile for additional settings
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('morning_protocol_time, evening_review_time, timezone')
      .eq('id', user.id)
      .single()
    
    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError
    }
    
    // Combine settings
    const combinedSettings = {
      ...settings,
      ...profile
    }
    
    return NextResponse.json(combinedSettings)
  } catch (error: unknown) {
    console.error('Error in GET /api/user-settings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get user settings' },
      { status: 500 }
    )
  }
}

// PUT - Update user settings
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const updates = await request.json()
    
    // Separate profile settings from user_settings
    const profileFields = ['morning_protocol_time', 'evening_review_time', 'timezone']
    const profileUpdates: Record<string, unknown> = {}
    const settingsUpdates: Record<string, unknown> = {}
    
    Object.keys(updates).forEach(key => {
      if (profileFields.includes(key)) {
        profileUpdates[key] = updates[key]
      } else {
        settingsUpdates[key] = updates[key]
      }
    })
    
    // Update user_settings if there are any
    if (Object.keys(settingsUpdates).length > 0) {
      settingsUpdates.updated_at = new Date().toISOString()
      
      const { error: settingsError } = await supabase
        .from('user_settings')
        .update(settingsUpdates)
        .eq('id', user.id)
      
      if (settingsError) throw settingsError
    }
    
    // Update profile if there are any profile fields
    if (Object.keys(profileUpdates).length > 0) {
      profileUpdates.updated_at = new Date().toISOString()
      
      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdates)
        .eq('id', user.id)
      
      if (profileError) throw profileError
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Settings updated successfully' 
    })
  } catch (error: unknown) {
    console.error('Error in PUT /api/user-settings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update user settings' },
      { status: 500 }
    )
  }
}

// POST - Reset settings to defaults
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Reset user_settings to defaults
    const defaultSettings = {
      push_notifications: true,
      email_reminders: true,
      sound_enabled: true,
      auto_play_recording: true,
      theme: 'light',
      updated_at: new Date().toISOString()
    }
    
    const { error: settingsError } = await supabase
      .from('user_settings')
      .update(defaultSettings)
      .eq('id', user.id)
    
    if (settingsError) throw settingsError
    
    // Reset profile time settings to defaults
    const defaultProfileSettings = {
      morning_protocol_time: '05:30',
      evening_review_time: '20:00',
      timezone: 'UTC',
      updated_at: new Date().toISOString()
    }
    
    const { error: profileError } = await supabase
      .from('profiles')
      .update(defaultProfileSettings)
      .eq('id', user.id)
    
    if (profileError) throw profileError
    
    return NextResponse.json({ 
      success: true,
      message: 'Settings reset to defaults',
      settings: { ...defaultSettings, ...defaultProfileSettings }
    })
  } catch (error: unknown) {
    console.error('Error in POST /api/user-settings:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to reset user settings' },
      { status: 500 }
    )
  }
}
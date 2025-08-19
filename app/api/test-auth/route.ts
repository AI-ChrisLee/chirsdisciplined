import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    const supabase = await createClient()
    
    // Try to sign up a test user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: 'Test User'
        }
      }
    })
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 400 })
    }
    
    // Check if profile was created
    let profile = null
    if (data.user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single()
      
      profile = profileData
    }
    
    return NextResponse.json({
      success: true,
      user: data.user ? {
        id: data.user.id,
        email: data.user.email
      } : null,
      profile: profile,
      message: 'User created successfully'
    })
  } catch (error: unknown) {
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 })
  }
}
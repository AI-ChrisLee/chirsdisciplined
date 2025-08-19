import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0]
    
    // Try to get existing session
    const { data: session, error: sessionError } = await supabase
      .from('daily_sessions')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()
    
    if (sessionError && sessionError.code !== 'PGRST116') {
      // PGRST116 means no rows found, which is okay
      throw sessionError
    }
    
    // If no session exists, create one
    if (!session) {
      const { data: newSession, error: createError } = await supabase
        .from('daily_sessions')
        .insert({
          user_id: user.id,
          date: today,
          morning_completed: false,
          evening_completed: false,
          vision_board_viewed: false
        })
        .select()
        .single()
      
      if (createError) throw createError
      
      return NextResponse.json(newSession)
    }
    
    return NextResponse.json(session)
  } catch (error) {
    console.error('Error in GET /api/daily-session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const updates = await request.json()
    const today = new Date().toISOString().split('T')[0]
    
    // Upsert the session
    const { data, error } = await supabase
      .from('daily_sessions')
      .upsert({
        user_id: user.id,
        date: today,
        ...updates,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Update user streaks if morning was completed
    if (updates.morning_completed) {
      await updateUserStreaks(user.id)
    }
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in POST /api/daily-session:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}

async function updateUserStreaks(userId: string) {
  const supabase = await createClient()
  
  // Get last 90 days of sessions
  const ninetyDaysAgo = new Date()
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90)
  
  const { data: sessions, error } = await supabase
    .from('daily_sessions')
    .select('date, morning_completed')
    .eq('user_id', userId)
    .gte('date', ninetyDaysAgo.toISOString().split('T')[0])
    .order('date', { ascending: false })
  
  if (error || !sessions) return
  
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0
  let totalCompleted = 0
  
  // Calculate current streak (counting backwards from today)
  const checkDate = new Date()
  
  for (let i = 0; i < sessions.length; i++) {
    const sessionDate = sessions[i].date
    const expectedDate = checkDate.toISOString().split('T')[0]
    
    if (sessionDate === expectedDate && sessions[i].morning_completed) {
      if (i === 0) currentStreak++
      tempStreak++
      totalCompleted++
    } else if (sessionDate === expectedDate && !sessions[i].morning_completed) {
      // Streak broken
      if (i === 0) currentStreak = 0
      tempStreak = 0
    }
    
    longestStreak = Math.max(longestStreak, tempStreak)
    checkDate.setDate(checkDate.getDate() - 1)
  }
  
  const completionRate = sessions.length > 0 
    ? (totalCompleted / sessions.length) * 100 
    : 0
  
  // Update profile with calculated streaks
  await supabase
    .from('profiles')
    .update({
      current_streak: currentStreak,
      longest_streak: longestStreak,
      total_days_completed: totalCompleted,
      completion_rate: completionRate.toFixed(2)
    })
    .eq('id', userId)
}
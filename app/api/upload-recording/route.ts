import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get form data
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const duration = formData.get('duration') as string
    
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }
    
    // Generate file name
    const date = new Date().toISOString().split('T')[0]
    const fileName = `${user.id}/${date}-recording.webm`
    
    // Convert File to ArrayBuffer then to Uint8Array
    const arrayBuffer = await audioFile.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('recordings')
      .upload(fileName, uint8Array, {
        contentType: audioFile.type || 'audio/webm',
        upsert: true
      })
    
    if (uploadError) {
      console.error('Upload error:', uploadError)
      throw uploadError
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('recordings')
      .getPublicUrl(fileName)
    
    // Update daily session with recording info
    const today = new Date().toISOString().split('T')[0]
    const { data: sessionData, error: sessionError } = await supabase
      .from('daily_sessions')
      .upsert({
        user_id: user.id,
        date: today,
        recording_url: publicUrl,
        recording_duration: parseInt(duration) || 0,
        morning_completed: true,
        morning_completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (sessionError) throw sessionError
    
    // Update user streaks
    await updateUserStreaks(user.id)
    
    return NextResponse.json({ 
      success: true, 
      url: publicUrl,
      session: sessionData 
    })
  } catch (error: unknown) {
    console.error('Error in POST /api/upload-recording:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload recording' },
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
  
  // Calculate streaks
  const checkDate = new Date()
  
  for (let i = 0; i < sessions.length; i++) {
    const sessionDate = sessions[i].date
    const expectedDate = checkDate.toISOString().split('T')[0]
    
    if (sessionDate === expectedDate && sessions[i].morning_completed) {
      if (i === 0) currentStreak++
      tempStreak++
      totalCompleted++
    } else if (sessionDate === expectedDate && !sessions[i].morning_completed) {
      if (i === 0) currentStreak = 0
      tempStreak = 0
    }
    
    longestStreak = Math.max(longestStreak, tempStreak)
    checkDate.setDate(checkDate.getDate() - 1)
  }
  
  const completionRate = sessions.length > 0 
    ? (totalCompleted / sessions.length) * 100 
    : 0
  
  // Update profile
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
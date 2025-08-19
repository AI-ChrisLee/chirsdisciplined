import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get suggested violent actions for the day
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get user's recent sessions to understand context
    const { data: recentSessions } = await supabase
      .from('daily_sessions')
      .select('violent_action, action_completed')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(7)
    
    // Get actions from library
    const { data: actions, error } = await supabase
      .from('violent_actions_library')
      .select('*')
      .order('times_completed', { ascending: true })
      .limit(10)
    
    if (error) throw error
    
    // Generate personalized suggestions (placeholder for AI integration)
    const suggestions = await generateViolentActionSuggestions(user.id, recentSessions || [], actions)
    
    return NextResponse.json(suggestions)
  } catch (error: unknown) {
    console.error('Error in GET /api/violent-actions:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get violent actions' },
      { status: 500 }
    )
  }
}

// POST - Set violent action for the day
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { action, category } = await request.json()
    const today = new Date().toISOString().split('T')[0]
    
    // Update daily session with violent action
    const { data, error } = await supabase
      .from('daily_sessions')
      .upsert({
        user_id: user.id,
        date: today,
        violent_action: action,
        violent_action_set_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    // Add to library if it's a custom action
    if (category) {
      await supabase
        .from('violent_actions_library')
        .insert({
          category,
          action,
          description: `User-generated action`,
          difficulty_level: 5
        })
    }
    
    return NextResponse.json({ 
      success: true,
      session: data 
    })
  } catch (error: unknown) {
    console.error('Error in POST /api/violent-actions:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to set violent action' },
      { status: 500 }
    )
  }
}

// PUT - Mark action as completed
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { completed } = await request.json()
    const today = new Date().toISOString().split('T')[0]
    
    // Update completion status
    const { data, error } = await supabase
      .from('daily_sessions')
      .update({
        action_completed: completed,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', user.id)
      .eq('date', today)
      .select()
      .single()
    
    if (error) throw error
    
    // If completed, increment times_completed in library
    if (completed && data.violent_action) {
      await supabase.rpc('increment', {
        table_name: 'violent_actions_library',
        column_name: 'times_completed',
        row_id: data.violent_action
      }).catch(() => {
        // Ignore error if action not in library
      })
    }
    
    return NextResponse.json({ 
      success: true,
      session: data 
    })
  } catch (error: unknown) {
    console.error('Error in PUT /api/violent-actions:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update violent action' },
      { status: 500 }
    )
  }
}

async function generateViolentActionSuggestions(
  userId: string, 
  recentSessions: Array<{ violent_action?: string; action_completed?: boolean }>, 
  libraryActions: Array<{ category: string; action: string; description: string; difficulty_level: number }>
) {
  // TODO: Replace with AI-powered suggestions when OpenAI key is available
  
  // For now, return a mix of different difficulty levels
  const suggestions = [
    {
      category: 'business',
      action: 'Cold call 10 potential clients today',
      description: 'Push through the fear of rejection and make those calls',
      difficulty_level: 7
    },
    {
      category: 'personal',
      action: 'Wake up at 4:30 AM and complete a 5K run',
      description: 'Test your discipline with an early morning challenge',
      difficulty_level: 6
    },
    {
      category: 'relationship',
      action: 'Have that difficult conversation you\'ve been avoiding',
      description: 'Address the elephant in the room with courage',
      difficulty_level: 8
    },
    {
      category: 'health',
      action: 'Complete 100 burpees in under 10 minutes',
      description: 'Push your physical limits',
      difficulty_level: 7
    },
    {
      category: 'business',
      action: 'Publish that content you\'re scared to share',
      description: 'Be vulnerable and authentic in public',
      difficulty_level: 6
    }
  ]
  
  // Filter out recently completed actions
  const recentActions = recentSessions
    .filter(s => s.violent_action)
    .map(s => s.violent_action)
  
  const filteredSuggestions = suggestions.filter(
    s => !recentActions.includes(s.action)
  )
  
  // Return top 3 suggestions
  return filteredSuggestions.slice(0, 3)
}
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
    
    const { userData } = await request.json()
    
    // Get current version number
    const { data: existingAffirmations } = await supabase
      .from('affirmations')
      .select('version')
      .eq('user_id', user.id)
      .order('version', { ascending: false })
      .limit(1)
    
    const nextVersion = existingAffirmations && existingAffirmations.length > 0 
      ? existingAffirmations[0].version + 1 
      : 1
    
    // Generate affirmations (placeholder for now - replace with OpenAI when API key is available)
    const affirmationsContent = await generateAffirmationsContent(userData)
    
    // Deactivate previous versions
    await supabase
      .from('affirmations')
      .update({ is_active: false })
      .eq('user_id', user.id)
    
    // Save new affirmations
    const { data, error } = await supabase
      .from('affirmations')
      .insert({
        user_id: user.id,
        content: affirmationsContent,
        version: nextVersion,
        is_active: true
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true,
      affirmations: data 
    })
  } catch (error: unknown) {
    console.error('Error in POST /api/generate-affirmations:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate affirmations' },
      { status: 500 }
    )
  }
}

async function generateAffirmationsContent(userData: { goals?: string; values?: string; challenges?: string; name?: string }) {
  // TODO: Replace with OpenAI API call when API key is available
  // For now, return a template with user data incorporated
  
  const { goals, values, challenges, name } = userData
  
  // Create personalized affirmations template
  const template = `
    <h2>Your Personal Affirmations</h2>
    <div class="affirmations-content">
      <p><strong>I am ${name || 'a powerful being'}, capable of extraordinary transformation.</strong></p>
      
      <h3>Core Identity</h3>
      <ul>
        <li>I am disciplined and consistent in my daily actions</li>
        <li>I embrace challenges as opportunities for growth</li>
        <li>I am becoming the person I was meant to be</li>
        <li>My potential is unlimited and I tap into it daily</li>
      </ul>
      
      ${goals ? `
      <h3>Goal Affirmations</h3>
      <ul>
        <li>I am actively working towards ${goals}</li>
        <li>Every day I take steps closer to my vision</li>
        <li>Success is inevitable because of my daily commitment</li>
      </ul>
      ` : ''}
      
      ${values ? `
      <h3>Value Affirmations</h3>
      <ul>
        <li>I live in alignment with my values of ${values}</li>
        <li>My actions reflect my deepest beliefs</li>
        <li>I honor my values in every decision I make</li>
      </ul>
      ` : ''}
      
      ${challenges ? `
      <h3>Overcoming Challenges</h3>
      <ul>
        <li>I am stronger than ${challenges}</li>
        <li>Every obstacle is an opportunity to prove my strength</li>
        <li>I have overcome challenges before and I will overcome them again</li>
      </ul>
      ` : ''}
      
      <h3>Daily Power Statements</h3>
      <ul>
        <li>Today, I choose discipline over comfort</li>
        <li>I am in complete control of my thoughts and actions</li>
        <li>My morning protocol sets the tone for an exceptional day</li>
        <li>I take violent action towards my goals without hesitation</li>
        <li>I am building an empire, one disciplined day at a time</li>
      </ul>
      
      <h3>Evening Reflection</h3>
      <ul>
        <li>I am proud of the person I was today</li>
        <li>Tomorrow I will be even better than today</li>
        <li>My consistency is creating extraordinary results</li>
        <li>I sleep knowing I gave my absolute best</li>
      </ul>
    </div>
  `
  
  return template.trim()
}

// GET endpoint to retrieve current affirmations
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get active affirmations
    const { data, error } = await supabase
      .from('affirmations')
      .select('*')
      .eq('user_id', user.id)
      .eq('is_active', true)
      .single()
    
    if (error && error.code !== 'PGRST116') {
      throw error
    }
    
    return NextResponse.json(data || null)
  } catch (error: unknown) {
    console.error('Error in GET /api/generate-affirmations:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get affirmations' },
      { status: 500 }
    )
  }
}
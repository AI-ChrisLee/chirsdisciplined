import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAnonClient } from '@/lib/supabase/client'

// POST - Create or update a lead
export async function POST(request: Request) {
  try {
    // Use anonymous client for leads (no auth required)
    const supabase = createAnonClient()
    const data = await request.json()
    const { email, full_name, status, qualification_answers, source } = data
    
    // Check if lead exists
    const { data: existingLead } = await supabase
      .from('leads')
      .select('id, status')
      .eq('email', email)
      .single()
    
    if (existingLead) {
      // Update existing lead
      const updates: Record<string, unknown> = {
        updated_at: new Date().toISOString()
      }
      
      if (full_name) updates.full_name = full_name
      if (status) updates.status = status
      if (qualification_answers) {
        updates.qualification_answers = qualification_answers
        updates.qualified = status === 'qualified'
        if (status === 'qualified') {
          updates.qualified_at = new Date().toISOString()
        }
      }
      
      const { data: updatedLead, error } = await supabase
        .from('leads')
        .update(updates)
        .eq('email', email)
        .select()
        .single()
      
      if (error) throw error
      
      return NextResponse.json({ 
        success: true, 
        lead: updatedLead,
        isNew: false 
      })
    } else {
      // Create new lead
      const newLead: Record<string, unknown> = {
        email,
        full_name,
        status: status || 'unqualified',
        source: source || 'website',
        qualified: status === 'qualified'
      }
      
      if (qualification_answers) {
        newLead.qualification_answers = qualification_answers
        if (status === 'qualified') {
          newLead.qualified_at = new Date().toISOString()
        }
      }
      
      const { data: createdLead, error } = await supabase
        .from('leads')
        .insert(newLead)
        .select()
        .single()
      
      if (error) throw error
      
      return NextResponse.json({ 
        success: true, 
        lead: createdLead,
        isNew: true 
      })
    }
  } catch (error) {
    console.error('Error in POST /api/leads:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process lead' },
      { status: 500 }
    )
  }
}

// GET - Get lead by email or get all leads (admin)
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    
    if (email) {
      // Get specific lead
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('email', email)
        .single()
      
      if (error && error.code !== 'PGRST116') {
        throw error
      }
      
      return NextResponse.json(data || null)
    } else {
      // Get all leads (requires admin/service role)
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (error) throw error
      
      return NextResponse.json(data || [])
    }
  } catch (error) {
    console.error('Error in GET /api/leads:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get leads' },
      { status: 500 }
    )
  }
}

// PUT - Join waitlist (for qualified leads)
export async function PUT(request: Request) {
  try {
    // Use anonymous client for leads
    const supabase = createAnonClient()
    const { email, action } = await request.json()
    
    if (action === 'join_waitlist') {
      // Get next waitlist position
      const { data: positionData } = await supabase
        .rpc('get_next_waitlist_position')
      
      const position = positionData || 1
      
      // Update lead to waitlist status
      const { data, error } = await supabase
        .from('leads')
        .update({
          status: 'waitlist',
          waitlist_position: position,
          joined_waitlist_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('email', email)
        .eq('status', 'qualified') // Only qualified leads can join waitlist
        .select()
        .single()
      
      if (error) throw error
      
      if (!data) {
        return NextResponse.json(
          { error: 'Lead not found or not qualified' },
          { status: 400 }
        )
      }
      
      return NextResponse.json({ 
        success: true,
        lead: data,
        waitlist_position: position
      })
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error in PUT /api/leads:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update lead' },
      { status: 500 }
    )
  }
}
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET - Get user's vision board images
export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get vision board images
    const { data, error } = await supabase
      .from('vision_boards')
      .select('*')
      .eq('user_id', user.id)
      .order('position', { ascending: true })
    
    if (error) throw error
    
    return NextResponse.json(data || [])
  } catch (error: unknown) {
    console.error('Error in GET /api/vision-boards:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to get vision boards' },
      { status: 500 }
    )
  }
}

// POST - Upload a new vision board image
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
    const imageFile = formData.get('image') as File
    const position = parseInt(formData.get('position') as string)
    const caption = formData.get('caption') as string
    
    if (!imageFile || isNaN(position) || position < 1 || position > 8) {
      return NextResponse.json(
        { error: 'Invalid image or position' },
        { status: 400 }
      )
    }
    
    // Generate file name
    const timestamp = Date.now()
    const fileExt = imageFile.name.split('.').pop()
    const fileName = `${user.id}/image-${position}-${timestamp}.${fileExt}`
    
    // Convert File to ArrayBuffer then to Uint8Array
    const arrayBuffer = await imageFile.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    
    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('vision-boards')
      .upload(fileName, uint8Array, {
        contentType: imageFile.type,
        upsert: false
      })
    
    if (uploadError) throw uploadError
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('vision-boards')
      .getPublicUrl(fileName)
    
    // Delete existing image at this position if it exists
    const { data: existingImage } = await supabase
      .from('vision_boards')
      .select('image_url')
      .eq('user_id', user.id)
      .eq('position', position)
      .single()
    
    if (existingImage) {
      // Extract file path from URL and delete from storage
      const oldPath = existingImage.image_url.split('/vision-boards/')[1]
      if (oldPath) {
        await supabase.storage
          .from('vision-boards')
          .remove([oldPath])
      }
      
      // Delete database record
      await supabase
        .from('vision_boards')
        .delete()
        .eq('user_id', user.id)
        .eq('position', position)
    }
    
    // Save to database
    const { data, error } = await supabase
      .from('vision_boards')
      .insert({
        user_id: user.id,
        image_url: publicUrl,
        position,
        caption
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true,
      visionBoard: data 
    })
  } catch (error: unknown) {
    console.error('Error in POST /api/vision-boards:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to upload vision board image' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a vision board image
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const { searchParams } = new URL(request.url)
    const position = parseInt(searchParams.get('position') || '0')
    
    if (isNaN(position) || position < 1 || position > 8) {
      return NextResponse.json(
        { error: 'Invalid position' },
        { status: 400 }
      )
    }
    
    // Get image to delete
    const { data: image, error: fetchError } = await supabase
      .from('vision_boards')
      .select('image_url')
      .eq('user_id', user.id)
      .eq('position', position)
      .single()
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError
    }
    
    if (image) {
      // Extract file path from URL and delete from storage
      const filePath = image.image_url.split('/vision-boards/')[1]
      if (filePath) {
        await supabase.storage
          .from('vision-boards')
          .remove([filePath])
      }
      
      // Delete from database
      const { error: deleteError } = await supabase
        .from('vision_boards')
        .delete()
        .eq('user_id', user.id)
        .eq('position', position)
      
      if (deleteError) throw deleteError
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Vision board image deleted' 
    })
  } catch (error: unknown) {
    console.error('Error in DELETE /api/vision-boards:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete vision board image' },
      { status: 500 }
    )
  }
}

// PUT - Mark vision board as viewed for today
export async function PUT(request: Request) {
  try {
    const supabase = await createClient()
    
    // Get authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const today = new Date().toISOString().split('T')[0]
    
    // Update daily session
    const { data, error } = await supabase
      .from('daily_sessions')
      .upsert({
        user_id: user.id,
        date: today,
        vision_board_viewed: true,
        updated_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ 
      success: true,
      session: data 
    })
  } catch (error: unknown) {
    console.error('Error in PUT /api/vision-boards:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update vision board status' },
      { status: 500 }
    )
  }
}
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Parse the request body
    const { youtube_id } = await req.json()

    if (!youtube_id) {
      console.error('No youtube_id provided')
      return new Response(
        JSON.stringify({ error: 'youtube_id is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Get competitor_id from the youtube_id
    const { data: competitor, error: competitorError } = await supabaseClient
      .from('competitors')
      .select('id')
      .eq('youtube_id', youtube_id)
      .single()

    if (competitorError || !competitor) {
      console.error('Error getting competitor:', competitorError)
      return new Response(
        JSON.stringify({ error: 'Competitor not found' }),
        { 
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    // Insert metrics into the database
    const { error: metricsError } = await supabaseClient
      .from('competitor_metrics')
      .insert({
        competitor_id: competitor.id,
        subscribers: 0, // Será atualizado pelo webhook
        views: 0,      // Será atualizado pelo webhook
        videos: 0      // Será atualizado pelo webhook
      })

    if (metricsError) {
      console.error('Error inserting metrics:', metricsError)
      return new Response(
        JSON.stringify({ error: 'Failed to insert metrics' }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ message: 'Metrics initialized successfully' }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Error processing request:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

export default async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    const body = await req.json();
    const { youtube_id } = body;

    if (!youtube_id) {
      console.error('No youtube_id provided');
      return new Response(
        JSON.stringify({ error: 'youtube_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing metrics for youtube_id: ${youtube_id}`);

    // Get competitor_id
    const { data: competitor, error: competitorError } = await supabaseClient
      .from('competitors')
      .select('id')
      .eq('youtube_id', youtube_id)
      .maybeSingle();

    if (competitorError) {
      console.error('Error fetching competitor:', competitorError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch competitor', details: competitorError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!competitor) {
      console.error('Competitor not found');
      return new Response(
        JSON.stringify({ error: 'Competitor not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found competitor with id: ${competitor.id}`);

    try {
      const externalResponse = await fetch('https://n8n-production-ff75.up.railway.app/webhook/concorrente-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube_id }),
        signal: AbortSignal.timeout(10000),
      });

      if (!externalResponse.ok) {
        throw new Error(`External API responded with status: ${externalResponse.status}`);
      }

      const externalData = await externalResponse.json();
      console.log('External API response:', externalData);

      const { visualizações: views, inscritos: subscribers, videos } = externalData;

      // Insert metrics
      const { error: metricsError } = await supabaseClient
        .from('competitor_metrics')
        .insert({
          competitor_id: competitor.id,
          subscribers,
          views,
          videos,
          updated_at: new Date().toISOString()
        });

      if (metricsError) {
        console.error('Error inserting metrics:', metricsError);
        return new Response(
          JSON.stringify({ error: 'Failed to save metrics', details: metricsError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Metrics saved successfully');

      return new Response(
        JSON.stringify({
          message: 'Metrics updated successfully',
          data: { views, subscribers, videos }
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );

    } catch (externalError) {
      console.error('Error with external API:', externalError);
      return new Response(
        JSON.stringify({ 
          error: 'External API error', 
          details: externalError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
};
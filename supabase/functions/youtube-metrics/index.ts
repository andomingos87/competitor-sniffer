import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

// Definição dos cabeçalhos CORS
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Restrinja conforme necessário
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Exporta a função padrão para a Edge Function
export default async (req) => {
  // Trata requisições de preflight CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verifica se as variáveis de ambiente estão definidas
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing required environment variables');
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Inicializa o cliente Supabase
    const supabaseClient = createClient(supabaseUrl, supabaseKey);

    // Valida o corpo da requisição
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'Invalid JSON body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { youtube_id } = body;
    if (!youtube_id) {
      console.error('No youtube_id provided');
      return new Response(
        JSON.stringify({ error: 'youtube_id is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Obtém competitor_id a partir do youtube_id
    const { data: competitor, error: competitorError } = await supabaseClient
      .from('competitors')
      .select('id')
      .eq('youtube_id', youtube_id)
      .single();

    if (competitorError || !competitor) {
      console.error('Error getting competitor:', competitorError?.message || competitorError);
      return new Response(
        JSON.stringify({ error: 'Competitor not found', details: competitorError }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Chama o endpoint externo para obter métricas do canal
    try {
      console.log(`Calling external API with youtube_id: ${youtube_id}`);
      const externalResponse = await fetch('https://n8n-production-ff75.up.railway.app/webhook/concorrente-youtube', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ youtube_id }),
        signal: AbortSignal.timeout(10000), // Timeout de 10 segundos
      });

      if (!externalResponse.ok) {
        console.error('External API call failed:', externalResponse.statusText);
        return new Response(
          JSON.stringify({ error: 'Failed to call external API', details: externalResponse.statusText }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const externalData = await externalResponse.json();
      console.log('External API response:', externalData);

      // Extrai os dados retornados pela API externa
      const { titulo_canal, visualizações, inscritos, videos } = externalData;

      // Insere ou atualiza métricas no banco de dados
      const { error: metricsError } = await supabaseClient
        .from('competitor_metrics')
        .insert({
          competitor_id: competitor.id,
          subscribers: inscritos,
          views: visualizações,
          videos: videos,
        })
        .onConflict('competitor_id') // Atualiza caso já exista um registro para este competitor_id
        .merge();

      if (metricsError) {
        console.error('Error inserting/updating metrics:', metricsError?.message || metricsError);
        return new Response(
          JSON.stringify({ error: 'Failed to insert/update metrics', details: metricsError }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Retorna uma resposta de sucesso com os dados obtidos
      return new Response(
        JSON.stringify({
          message: 'Metrics updated successfully',
          data: {
            titulo_canal,
            visualizações,
            inscritos,
            videos,
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (externalError) {
      console.error('Error calling external API:', externalError?.message || externalError);
      return new Response(
        JSON.stringify({ error: 'Failed to call external API', details: externalError?.message || externalError }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error processing request:', error?.message || error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error?.message || error }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};
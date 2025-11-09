import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { strategyData } = await req.json();
    const STRATEGY_WEBHOOK_URL = Deno.env.get('STRATEGY_WEBHOOK_URL');

    console.log('Strategy webhook URL check:', STRATEGY_WEBHOOK_URL ? 'configured' : 'missing');
    console.log('Received strategy data:', strategyData);

    if (!STRATEGY_WEBHOOK_URL) {
      throw new Error('STRATEGY_WEBHOOK_URL not configured');
    }

    // Send to n8n webhook with full strategy data
    const response = await fetch(STRATEGY_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        strategyData,
        timestamp: new Date().toISOString(),
        source: 'strategy-agent'
      }),
    });

    console.log('Webhook response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error:', errorText);
      throw new Error(`Strategy webhook returned ${response.status}: ${errorText}`);
    }

    console.log('Successfully sent to strategy webhook');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Strategy sent to your workflow'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

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
    const requestData = await req.json();
    const AUTOMATION_WEBHOOK_URL = Deno.env.get('AUTOMATION_WEBHOOK_URL');

    console.log('Automation webhook URL check:', AUTOMATION_WEBHOOK_URL ? 'configured' : 'missing');

    if (!AUTOMATION_WEBHOOK_URL) {
      throw new Error('AUTOMATION_WEBHOOK_URL not configured');
    }

    console.log('Sending data to automation webhook:', requestData);

    const response = await fetch(AUTOMATION_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        ...requestData,
        timestamp: new Date().toISOString(),
        source: 'automation-tab'
      }),
    });

    console.log('Webhook response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Webhook error:', errorText);
      throw new Error(`Automation webhook returned ${response.status}: ${errorText}`);
    }

    console.log('Successfully sent to automation webhook');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Data sent to your automation workflow'
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

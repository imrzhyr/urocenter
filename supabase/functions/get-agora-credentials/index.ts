import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const appId = Deno.env.get('AGORA_APP_ID')
    
    if (!appId) {
      console.error('Agora App ID not configured')
      throw new Error('Agora App ID not configured')
    }

    // Log successful retrieval but don't expose the actual appId in logs
    console.log('Successfully retrieved Agora App ID')
    
    return new Response(
      JSON.stringify({ 
        appId,
        success: true 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error retrieving Agora credentials:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
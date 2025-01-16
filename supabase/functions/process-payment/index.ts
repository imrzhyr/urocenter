import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, payment_method } = await req.json()
    console.log('Processing payment:', { amount, payment_method })

    // For development/testing, return a mock payment URL
    const mockPaymentResponse = {
      payment_url: `${req.headers.get('origin')}/payment/complete?method=${payment_method}&amount=${amount}`,
      tran_ref: `mock_${Date.now()}`,
      cart_id: `order_${Date.now()}`
    }
    
    console.log('Generated mock payment response:', mockPaymentResponse)

    return new Response(
      JSON.stringify(mockPaymentResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Payment processing error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    )
  }
})
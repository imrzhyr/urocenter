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
    const serverKey = Deno.env.get('PAYTABS_SERVER_KEY')

    if (!serverKey) {
      throw new Error('PayTabs server key not configured')
    }

    // Initialize payment with PayTabs
    const response = await fetch('https://secure.paytabs.sa/payment/request', {
      method: 'POST',
      headers: {
        'Authorization': serverKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        profile_id: "12345", // Replace with your PayTabs profile ID
        tran_type: "sale",
        tran_class: "ecom",
        cart_id: `order_${Date.now()}`,
        cart_currency: "IQD",
        cart_amount: amount,
        cart_description: "Medical Consultation Payment",
        paypage_lang: "en",
        callback: `${req.headers.get('origin')}/payment/callback`,
        return: `${req.headers.get('origin')}/payment/complete`,
        payment_methods: [payment_method]
      })
    })

    const paymentData = await response.json()
    
    console.log('PayTabs payment initiated:', paymentData)

    return new Response(
      JSON.stringify(paymentData),
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
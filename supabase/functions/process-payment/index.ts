import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, payment_method } = await req.json()
    console.log('Processing payment:', { amount, payment_method })

    if (payment_method === 'credit-card') {
      const PAYTABS_SERVER_KEY = Deno.env.get('PAYTABS_SERVER_KEY')
      if (!PAYTABS_SERVER_KEY) {
        throw new Error('PayTabs server key not configured')
      }

      // Create PayTabs payment page
      const response = await fetch('https://secure.paytabs.sa/payment/request', {
        method: 'POST',
        headers: {
          'Authorization': PAYTABS_SERVER_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          profile_id: '12345', // Replace with your PayTabs profile ID
          tran_type: 'sale',
          tran_class: 'ecom',
          cart_id: `order_${Date.now()}`,
          cart_currency: 'IQD',
          cart_amount: amount,
          cart_description: 'Medical Consultation Fee',
          paypage_lang: 'en',
          callback: `${req.headers.get('origin')}/payment/complete`,
          return: `${req.headers.get('origin')}/payment/complete`,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to create PayTabs payment page')
      }

      const paymentData = await response.json()
      console.log('PayTabs payment page created:', paymentData)

      return new Response(
        JSON.stringify({
          payment_url: paymentData.redirect_url,
          tran_ref: paymentData.tran_ref,
          cart_id: paymentData.cart_id
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200 
        }
      )
    }

    // For other payment methods, keep the existing mock implementation
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

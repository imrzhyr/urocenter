import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const generateToken = async (channelName: string, appId: string, appCertificate: string) => {
  // Token valid for 24 hours
  const expirationTimeInSeconds = 24 * 60 * 60
  
  // Get the current timestamp in seconds
  const currentTimestamp = Math.floor(Date.now() / 1000)
  
  // Calculate when the token will expire
  const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
  
  // Create a message containing the channel name and expiration
  const message = `${appId}${channelName}${currentTimestamp}${privilegeExpiredTs}`
  
  // Convert the app certificate to a Uint8Array for use with Deno's crypto
  const keyData = new TextEncoder().encode(appCertificate)
  const messageData = new TextEncoder().encode(message)
  
  // Generate HMAC using SHA256
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    messageData
  )
  
  // Convert the signature to base64
  const signatureBase64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
  
  // Construct the token
  const token = `${appId}:${currentTimestamp}:${privilegeExpiredTs}:${signatureBase64}`
  
  return token
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { channelName } = await req.json()
    
    if (!channelName) {
      throw new Error('Channel name is required')
    }

    const appId = Deno.env.get('AGORA_APP_ID')
    const appCertificate = Deno.env.get('AGORA_APP_CERTIFICATE')
    
    if (!appId || !appCertificate) {
      throw new Error('Agora credentials not configured')
    }

    const token = await generateToken(channelName, appId, appCertificate)
    console.log('Generated token for channel:', channelName)

    return new Response(
      JSON.stringify({ token }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error generating token:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
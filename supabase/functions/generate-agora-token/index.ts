import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

class RtcTokenBuilder {
  static async buildTokenWithUid(
    appId: string,
    appCertificate: string,
    channelName: string,
    uid: number,
    role: number,
    privilegeExpiredTs: number
  ): Promise<string> {
    const encoder = new TextEncoder()
    
    // Create message buffer
    const message = encoder.encode(
      appId + channelName + uid.toString() + privilegeExpiredTs.toString()
    )

    // Import key for HMAC
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(appCertificate),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )

    // Generate HMAC
    const signature = await crypto.subtle.sign(
      { name: 'HMAC', hash: 'SHA-256' },
      key,
      message
    )

    // Convert signature to base64
    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)))

    // Construct token
    return [
      '006',
      appId,
      Math.floor(Date.now() / 1000).toString(),
      base64Signature
    ].join('')
  }
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
      console.error('Agora credentials not configured')
      throw new Error('Agora credentials not configured')
    }

    const uid = 0 // Set to 0 for dynamic assignment
    const role = 1 // Publisher role
    const expirationTimeInSeconds = 3600 // 1 hour
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds

    console.log('Generating token with params:', {
      appId,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    })

    const token = await RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channelName,
      uid,
      role,
      privilegeExpiredTs
    )

    console.log('Successfully generated token for channel:', channelName)

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
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Agora token builder implementation using Deno's native crypto
class RtcTokenBuilder {
  private static readonly VERSION_LENGTH = 3
  private static readonly APP_ID_LENGTH = 32

  static buildTokenWithUid(
    appId: string,
    appCertificate: string,
    channelName: string,
    uid: number,
    role: number,
    privilegeExpiredTs: number
  ): string {
    const encoder = new TextEncoder()
    const decoder = new TextDecoder()

    // Prepare the message
    const message = encoder.encode(
      appId + channelName + uid.toString() + privilegeExpiredTs.toString()
    )

    // Create HMAC using Deno's native crypto
    const key = encoder.encode(appCertificate)
    const hmac = new Uint8Array(32)
    const signedMsg = crypto.subtle.sign(
      { name: 'HMAC', hash: 'SHA-256' },
      crypto.subtle.importKey(
        'raw',
        key,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      ),
      message
    )

    // Convert to base64
    const signature = btoa(decoder.decode(hmac))
    
    // Construct token string
    const token = [
      '006',
      appId,
      Math.floor(Date.now() / 1000).toString(),
      signature,
    ].join('')

    return token
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
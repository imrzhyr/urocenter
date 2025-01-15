import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch all profiles that don't have a matching auth user
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*')

    if (profilesError) {
      throw profilesError
    }

    const results = []
    
    for (const profile of profiles) {
      try {
        // Check if user already exists in auth.users
        const { data: existingUsers } = await supabaseClient.auth.admin.listUsers()
        const existingUser = existingUsers.users.find(u => u.phone === profile.phone)
        
        if (!existingUser) {
          // Create new auth user
          const { data: authData, error: authError } = await supabaseClient.auth.admin.createUser({
            phone: profile.phone,
            password: profile.password,
            email_confirm: true,
            phone_confirm: true,
            user_metadata: {
              phone: profile.phone,
            }
          })

          if (authError) {
            results.push({
              phone: profile.phone,
              status: 'error',
              error: authError.message
            })
            continue
          }

          // Update profile with new auth user id
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({ id: authData.user.id })
            .eq('phone', profile.phone)

          if (updateError) {
            results.push({
              phone: profile.phone,
              status: 'error',
              error: updateError.message
            })
            continue
          }

          results.push({
            phone: profile.phone,
            status: 'success',
            userId: authData.user.id
          })
        } else {
          results.push({
            phone: profile.phone,
            status: 'skipped',
            message: 'Auth user already exists'
          })
        }
      } catch (error) {
        results.push({
          phone: profile.phone,
          status: 'error',
          error: error.message
        })
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        results
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
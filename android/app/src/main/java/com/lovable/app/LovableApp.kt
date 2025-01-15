package com.lovable.app

import android.app.Application
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.gotrue.GoTrue
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.realtime.Realtime
import io.github.jan.supabase.storage.Storage

class LovableApp : Application() {
    companion object {
        lateinit var supabase: SupabaseClient
        private const val SUPABASE_URL = "https://byjyyshxviieqkymavnh.supabase.co"
        private const val SUPABASE_ANON_KEY = "your-anon-key"
    }

    override fun onCreate() {
        super.onCreate()
        
        supabase = createSupabaseClient(
            supabaseUrl = SUPABASE_URL,
            supabaseKey = SUPABASE_ANON_KEY
        ) {
            install(GoTrue)
            install(Postgrest)
            install(Realtime)
            install(Storage)
        }
    }
}
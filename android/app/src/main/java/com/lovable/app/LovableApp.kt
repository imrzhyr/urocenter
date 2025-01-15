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
        private const val SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ5anl5c2h4dmlpZXFreW1hdm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYwMjQ1ODMsImV4cCI6MjA1MTYwMDU4M30.iP1Tlz7tnwO9GDY4oW12fN8IwImcjkoLpBhdsCq1VwM"
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
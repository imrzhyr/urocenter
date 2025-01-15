package com.lovable.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import io.github.jan.supabase.gotrue.SessionStatus
import io.github.jan.supabase.gotrue.gotrue
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.flow.collectLatest

class MainActivity : AppCompatActivity() {
    private lateinit var navController: NavController
    private val mainScope = CoroutineScope(Dispatchers.Main)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController

        setupNavigation()
        checkAuthState()
    }

    private fun setupNavigation() {
        findViewById<BottomNavigationView>(R.id.bottom_navigation)?.setupWithNavController(navController)
        
        navController.addOnDestinationChangedListener { _, destination, _ ->
            // Handle navigation animations
            overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
        }
    }

    private fun checkAuthState() {
        mainScope.launch {
            LovableApp.supabase.gotrue.sessionStatus.collectLatest { status ->
                when (status) {
                    is SessionStatus.Authenticated -> {
                        // User is authenticated, navigate to dashboard
                        navController.navigate(R.id.dashboardFragment)
                    }
                    else -> {
                        // User is not authenticated, stay on welcome screen
                        navController.navigate(R.id.welcomeFragment)
                    }
                }
            }
        }
    }
}
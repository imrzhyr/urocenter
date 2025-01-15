package com.lovable.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import io.github.jan.supabase.gotrue.SessionStatus
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class MainActivity : AppCompatActivity() {
    private lateinit var navController: NavController
    private lateinit var bottomNav: BottomNavigationView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController
        
        bottomNav = findViewById(R.id.bottom_navigation)
        bottomNav.setupWithNavController(navController)

        setupNavigation()
        observeAuthState()
    }

    private fun setupNavigation() {
        navController.addOnDestinationChangedListener { _, destination, _ ->
            when (destination.id) {
                R.id.welcomeFragment, R.id.signInFragment -> bottomNav.visibility = android.view.View.GONE
                else -> bottomNav.visibility = android.view.View.VISIBLE
            }
        }
    }

    private fun observeAuthState() {
        CoroutineScope(Dispatchers.Main).launch {
            LovableApp.supabase.gotrue.sessionStatus.collect { status ->
                when (status) {
                    is SessionStatus.Authenticated -> {
                        if (navController.currentDestination?.id == R.id.welcomeFragment) {
                            navController.navigate(R.id.action_welcome_to_signIn)
                        }
                    }
                    else -> {
                        // Only navigate to welcome if we're not already there
                        if (navController.currentDestination?.id != R.id.welcomeFragment) {
                            navController.navigate(R.id.welcomeFragment) {
                                popUpTo(R.id.nav_graph) {
                                    inclusive = true
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
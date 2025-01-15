package com.lovable.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView
import androidx.navigation.NavOptions
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import io.github.jan.supabase.gotrue.SessionStatus

class MainActivity : AppCompatActivity() {
    private lateinit var navController: NavController
    private val mainScope = CoroutineScope(Dispatchers.Main)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController

        findViewById<BottomNavigationView>(R.id.bottom_navigation)
            .setupWithNavController(navController)

        observeAuthState()
    }

    private fun observeAuthState() {
        mainScope.launch {
            LovableApp.supabase.gotrue.sessionStatus.collect { status ->
                when (status) {
                    is SessionStatus.Authenticated -> {
                        if (navController.currentDestination?.id == R.id.welcomeFragment) {
                            val navOptions = NavOptions.Builder()
                                .setPopUpTo(R.id.welcomeFragment, true)
                                .build()
                            navController.navigate(R.id.action_welcome_to_dashboard, null, navOptions)
                        }
                    }
                    else -> {
                        if (navController.currentDestination?.id != R.id.welcomeFragment) {
                            val navOptions = NavOptions.Builder()
                                .setPopUpTo(R.id.nav_graph, true)
                                .build()
                            navController.navigate(R.id.welcomeFragment, null, navOptions)
                        }
                    }
                }
            }
        }
    }
}
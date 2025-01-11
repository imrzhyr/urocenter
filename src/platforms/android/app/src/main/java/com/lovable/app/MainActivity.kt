package com.lovable.app

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.NavController
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {
    private lateinit var navController: NavController

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment) as NavHostFragment
        navController = navHostFragment.navController

        setupNavigation()
    }

    private fun setupNavigation() {
        findViewById<BottomNavigationView>(R.id.bottom_navigation)?.setupWithNavController(navController)
        
        navController.addOnDestinationChangedListener { _, destination, _ ->
            // Handle navigation animations
            overridePendingTransition(R.anim.slide_in_right, R.anim.slide_out_left)
        }
    }
}
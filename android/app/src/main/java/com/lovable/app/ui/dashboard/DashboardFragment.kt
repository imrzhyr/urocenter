package com.lovable.app.ui.dashboard

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.lovable.app.R
import com.lovable.app.databinding.FragmentDashboardBinding
import com.lovable.app.models.Profile
import com.lovable.app.ui.base.BaseFragment
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.launch

class DashboardFragment : BaseFragment() {
    private var _binding: FragmentDashboardBinding? = null
    private val binding get() = _binding!!

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentDashboardBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupClickListeners()
        fetchUserData()
    }

    private fun setupClickListeners() {
        binding.messagesCard.setOnClickListener {
            findNavController().navigate(R.id.action_dashboard_to_chat)
        }
    }

    private fun fetchUserData() {
        lifecycleScope.launch {
            try {
                val profile = LovableApp.supabase
                    .postgrest["profiles"]
                    .select()
                    .eq("id", getCurrentUserId())
                    .decodeSingle<Profile>()
                
                updateUI(profile)
            } catch (e: Exception) {
                showError("Failed to load profile")
            }
        }
    }

    private fun updateUI(profile: Profile) {
        binding.apply {
            welcomeText.text = getString(R.string.welcome, profile.fullName)
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
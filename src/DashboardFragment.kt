package com.lovable.app

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.card.MaterialCardView
import io.github.jan.supabase.postgrest.postgrest

class DashboardFragment : Fragment() {
    private lateinit var messagesCard: MaterialCardView
    private lateinit var reportsCard: MaterialCardView
    private lateinit var appointmentCard: MaterialCardView
    private lateinit var healthTipsCard: MaterialCardView

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_dashboard, container, false)
        setupViews(view)
        fetchUserData()
        return view
    }

    private fun setupViews(view: View) {
        messagesCard = view.findViewById(R.id.messages_card)
        reportsCard = view.findViewById(R.id.reports_card)
        appointmentCard = view.findViewById(R.id.appointment_card)
        healthTipsCard = view.findViewById(R.id.health_tips_card)

        messagesCard.setOnClickListener {
            navigateToChat()
        }

        reportsCard.setOnClickListener {
            showReportsDialog()
        }
    }

    private fun fetchUserData() {
        val supabase = LovableApp.supabase
        
        lifecycleScope.launch {
            try {
                val profile = supabase.postgrest["profiles"]
                    .select { eq("id", getCurrentUserId()) }
                    .decodeSingle<Profile>()
                
                updateUI(profile)
            } catch (e: Exception) {
                showError("Failed to load profile")
            }
        }
    }

    private fun navigateToChat() {
        findNavController().navigate(R.id.action_dashboard_to_chat)
    }

    private fun showReportsDialog() {
        MedicalReportsDialog().show(childFragmentManager, "reports")
    }
}
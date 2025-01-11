package com.lovable.app.ui.signin

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.Fragment
import androidx.lifecycle.lifecycleScope
import androidx.navigation.fragment.findNavController
import com.lovable.app.LovableApp
import com.lovable.app.R
import kotlinx.coroutines.launch
import io.github.jan.supabase.postgrest.postgrest

class SignInFragment : Fragment() {
    private lateinit var phoneInput: EditText
    private lateinit var passwordInput: EditText
    private lateinit var signInButton: Button

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        return inflater.inflate(R.layout.fragment_sign_in, container, false)
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        
        phoneInput = view.findViewById(R.id.phoneInput)
        passwordInput = view.findViewById(R.id.passwordInput)
        signInButton = view.findViewById(R.id.signInButton)

        signInButton.setOnClickListener {
            handleSignIn()
        }
    }

    private fun handleSignIn() {
        val phone = phoneInput.text.toString()
        val password = passwordInput.text.toString()

        if (phone.isEmpty() || password.isEmpty()) {
            Toast.makeText(context, "Please fill in all fields", Toast.LENGTH_SHORT).show()
            return
        }

        lifecycleScope.launch {
            try {
                val profile = LovableApp.supabase.postgrest
                    .from("profiles")
                    .select()
                    .eq("phone", phone)
                    .eq("password", password)
                    .single<Profile>()

                context?.getSharedPreferences("app_prefs", 0)
                    ?.edit()
                    ?.putString("userPhone", phone)
                    ?.apply()

                findNavController().navigate(R.id.action_signIn_to_dashboard)
            } catch (e: Exception) {
                activity?.runOnUiThread {
                    Toast.makeText(context, "Invalid credentials", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}

data class Profile(
    val id: String,
    val phone: String,
    val role: String
)
package com.lovable.app.ui.chat

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.google.android.material.textfield.TextInputEditText
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.flow.collectLatest

class ChatFragment : Fragment() {
    private lateinit var messagesList: RecyclerView
    private lateinit var messageInput: TextInputEditText
    private lateinit var messagesAdapter: MessagesAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_chat, container, false)
        setupViews(view)
        subscribeToMessages()
        return view
    }

    private fun setupViews(view: View) {
        messagesList = view.findViewById(R.id.messages_list)
        messageInput = view.findViewById(R.id.message_input)
        
        messagesList.layoutManager = LinearLayoutManager(context)
        messagesAdapter = MessagesAdapter()
        messagesList.adapter = messagesAdapter

        view.findViewById<View>(R.id.send_button).setOnClickListener {
            sendMessage()
        }
    }

    private fun subscribeToMessages() {
        val supabase = LovableApp.supabase
        
        lifecycleScope.launch {
            try {
                supabase.postgrest["messages"]
                    .select()
                    .flow<Message>()
                    .collectLatest { messages ->
                        messagesAdapter.submitList(messages)
                        messagesList.scrollToPosition(messages.size - 1)
                    }
            } catch (e: Exception) {
                showError("Failed to load messages")
            }
        }
    }

    private fun sendMessage() {
        val content = messageInput.text.toString().trim()
        if (content.isEmpty()) return

        val supabase = LovableApp.supabase
        
        lifecycleScope.launch {
            try {
                supabase.postgrest["messages"]
                    .insert(Message(
                        content = content,
                        userId = getCurrentUserId(),
                        isFromDoctor = false
                    ))
                messageInput.text?.clear()
            } catch (e: Exception) {
                showError("Failed to send message")
            }
        }
    }
}

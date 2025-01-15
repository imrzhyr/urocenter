package com.lovable.app.ui.chat

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.lifecycle.lifecycleScope
import androidx.recyclerview.widget.LinearLayoutManager
import com.lovable.app.R
import com.lovable.app.adapters.MessagesAdapter
import com.lovable.app.databinding.FragmentChatBinding
import com.lovable.app.models.Message
import com.lovable.app.ui.base.BaseFragment
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.flow.collectLatest
import kotlinx.coroutines.launch
import kotlinx.serialization.json.buildJsonObject
import kotlinx.serialization.json.put

class ChatFragment : BaseFragment() {
    private var _binding: FragmentChatBinding? = null
    private val binding get() = _binding!!
    private lateinit var messagesAdapter: MessagesAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        _binding = FragmentChatBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)
        setupRecyclerView()
        setupMessageInput()
        subscribeToMessages()
    }

    private fun setupRecyclerView() {
        messagesAdapter = MessagesAdapter()
        binding.messagesList.apply {
            adapter = messagesAdapter
            layoutManager = LinearLayoutManager(context).apply {
                stackFromEnd = true
            }
        }
    }

    private fun setupMessageInput() {
        binding.sendButton.setOnClickListener {
            val content = binding.messageInput.text.toString().trim()
            if (content.isNotEmpty()) {
                sendMessage(content)
                binding.messageInput.text?.clear()
            }
        }
    }

    private fun subscribeToMessages() {
        lifecycleScope.launch {
            try {
                val channel = LovableApp.supabase
                    .channel("public:messages")
                    .on(
                        "postgres_changes",
                        buildJsonObject {
                            put("event", "*")
                            put("schema", "public")
                            put("table", "messages")
                        }
                    ) { response ->
                        // Handle real-time updates
                        fetchMessages()
                    }
                    .subscribe()

                fetchMessages()
            } catch (e: Exception) {
                showError("Failed to subscribe to messages")
            }
        }
    }

    private fun fetchMessages() {
        lifecycleScope.launch {
            try {
                val messages = LovableApp.supabase
                    .postgrest["messages"]
                    .select()
                    .decodeList<Message>()
                
                messagesAdapter.submitList(messages)
                binding.messagesList.scrollToPosition(messages.size - 1)
            } catch (e: Exception) {
                showError("Failed to load messages")
            }
        }
    }

    private fun sendMessage(content: String) {
        lifecycleScope.launch {
            try {
                LovableApp.supabase
                    .postgrest["messages"]
                    .insert(Message(
                        id = "",
                        content = content,
                        userId = getCurrentUserId(),
                        isFromDoctor = false,
                        isRead = false,
                        createdAt = "",
                        status = "not_seen"
                    ))
            } catch (e: Exception) {
                showError("Failed to send message")
            }
        }
    }

    override fun onDestroyView() {
        super.onDestroyView()
        _binding = null
    }
}
package com.lovable.app.adapters

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.DiffUtil
import androidx.recyclerview.widget.ListAdapter
import androidx.recyclerview.widget.RecyclerView
import com.lovable.app.R
import com.lovable.app.models.Message
import java.text.SimpleDateFormat
import java.util.Locale

class MessagesAdapter : ListAdapter<Message, MessagesAdapter.MessageViewHolder>(MessageDiffCallback()) {

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): MessageViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_message, parent, false)
        return MessageViewHolder(view)
    }

    override fun onBindViewHolder(holder: MessageViewHolder, position: Int) {
        holder.bind(getItem(position))
    }

    class MessageViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        private val contentText: TextView = view.findViewById(R.id.message_content)
        private val timeText: TextView = view.findViewById(R.id.message_time)
        private val dateFormat = SimpleDateFormat("HH:mm", Locale.getDefault())

        fun bind(message: Message) {
            contentText.text = message.content
            timeText.text = dateFormat.format(message.createdAt)
        }
    }

    private class MessageDiffCallback : DiffUtil.ItemCallback<Message>() {
        override fun areItemsTheSame(oldItem: Message, newItem: Message): Boolean {
            return oldItem.id == newItem.id
        }

        override fun areContentsTheSame(oldItem: Message, newItem: Message): Boolean {
            return oldItem == newItem
        }
    }
}
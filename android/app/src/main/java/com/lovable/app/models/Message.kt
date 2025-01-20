package com.lovable.app.models

import kotlinx.serialization.Serializable

@Serializable
data class Message(
    val id: String,
    val content: String,
    val userId: String,
    val isFromDoctor: Boolean,
    val isRead: Boolean,
    val createdAt: String,
    val status: String = "not_seen",
    val deliveredAt: String? = null,
    val seenAt: String? = null,
    val isResolved: Boolean? = null,
    val senderName: String? = null,
    val replyTo: ReplyMessage? = null
)

@Serializable
data class ReplyMessage(
    val content: String,
    val senderName: String? = null
)
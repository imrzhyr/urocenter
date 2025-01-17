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
    val fileUrl: String? = null,
    val fileName: String? = null,
    val fileType: String? = null,
    val duration: Int? = null,
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
    val fileType: String? = null,
    val fileUrl: String? = null,
    val senderName: String? = null
)
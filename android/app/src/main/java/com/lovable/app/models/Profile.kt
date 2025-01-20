package com.lovable.app.models

import kotlinx.serialization.Serializable

@Serializable
data class Profile(
    val id: String,
    val fullName: String? = null,
    val phone: String? = null,
    val gender: String? = null,
    val age: String? = null,
    val complaint: String? = null,
    val role: String = "patient",
    val password: String? = null,
    val createdAt: String? = null,
    val updatedAt: String? = null,
    val paymentStatus: String? = null,
    val paymentMethod: String? = null,
    val paymentDate: String? = null
)
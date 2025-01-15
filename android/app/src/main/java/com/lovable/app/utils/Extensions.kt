package com.lovable.app.utils

import android.content.Context
import android.view.View
import android.widget.Toast
import androidx.fragment.app.Fragment
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.catch
import kotlinx.coroutines.flow.onStart

fun View.show() {
    visibility = View.VISIBLE
}

fun View.hide() {
    visibility = View.GONE
}

fun Context.showToast(message: String) {
    Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
}

fun Fragment.showToast(message: String) {
    context?.showToast(message)
}

fun <T> Flow<T>.handleErrors(
    onError: (Throwable) -> Unit,
    onStart: () -> Unit = {},
    onComplete: () -> Unit = {}
): Flow<T> = this
    .onStart { onStart() }
    .catch { onError(it) }
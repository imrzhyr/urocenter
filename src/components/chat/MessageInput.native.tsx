import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Send, Plus, Mic } from 'lucide-react-native';

interface MessageInputProps {
  onSendMessage: (message: string, fileInfo?: { url: string; name: string; type: string; duration?: number }) => void;
  isLoading: boolean;
}

export const MessageInput = ({ onSendMessage, isLoading }: MessageInputProps) => {
  const [newMessage, setNewMessage] = useState('');

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button}>
        <Plus size={20} color="#7c3aed" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.button}>
        <Mic size={20} color="#7c3aed" />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type a message..."
          multiline
          style={styles.input}
          onSubmitEditing={handleSend}
        />
      </View>
      <TouchableOpacity 
        style={[styles.sendButton, (!newMessage.trim() || isLoading) && styles.disabled]}
        onPress={handleSend}
        disabled={!newMessage.trim() || isLoading}
      >
        <Send size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    gap: 8
  },
  button: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6'
  },
  inputContainer: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  input: {
    maxHeight: 100
  },
  sendButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#7c3aed'
  },
  disabled: {
    opacity: 0.5
  }
});
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Message } from '@/types/profile';
import { format, isToday, isYesterday } from 'date-fns';
import { useProfile } from '@/hooks/useProfile';
import { MessageStatus } from './MessageStatus.native';
import { MediaGallery } from './media/MediaGallery.native';

interface MessageListProps {
  messages: Message[];
}

export const MessageList = ({ messages }: MessageListProps) => {
  const { profile } = useProfile();
  const isAdmin = profile?.role === 'admin';

  const formatDateSeparator = (date: Date) => {
    if (isToday(date)) {
      return 'Today';
    }
    if (isYesterday(date)) {
      return 'Yesterday';
    }
    return format(date, 'MMMM d, yyyy');
  };

  const renderDateSeparator = (date: Date) => (
    <View style={styles.dateSeparator}>
      <Text style={styles.dateSeparatorText}>
        {formatDateSeparator(date)}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {messages.map((message, index) => {
        const currentDate = new Date(message.created_at);
        const previousMessage = index > 0 ? messages[index - 1] : null;
        const previousDate = previousMessage ? new Date(previousMessage.created_at) : null;
        const showDateSeparator = !previousDate || !isToday(currentDate);

        const isFromCurrentUser = isAdmin ? message.is_from_doctor : !message.is_from_doctor;

        return (
          <View key={message.id}>
            {showDateSeparator && renderDateSeparator(currentDate)}
            <View style={[
              styles.messageContainer,
              isFromCurrentUser ? styles.sentMessage : styles.receivedMessage
            ]}>
              <View style={[
                styles.messageBubble,
                isFromCurrentUser ? styles.sentBubble : styles.receivedBubble
              ]}>
                {message.file_type?.startsWith("image/") ||
                  message.file_type?.startsWith("video/") ? (
                  <MediaGallery
                    url={message.file_url || ""}
                    type={message.file_type}
                    name={message.file_name || ""}
                  />
                ) : (
                  <Text style={[
                    styles.messageText,
                    isFromCurrentUser ? styles.sentText : styles.receivedText
                  ]}>
                    {message.content}
                  </Text>
                )}
                <View style={styles.messageFooter}>
                  <Text style={styles.timestamp}>
                    {format(new Date(message.created_at), 'hh:mm a')}
                  </Text>
                  {isFromCurrentUser && <MessageStatus message={message} />}
                </View>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  dateSeparator: {
    alignItems: 'center',
    marginVertical: 16
  },
  dateSeparatorText: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    color: '#6b7280'
  },
  messageContainer: {
    marginBottom: 8,
    flexDirection: 'row'
  },
  sentMessage: {
    justifyContent: 'flex-end'
  },
  receivedMessage: {
    justifyContent: 'flex-start'
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 12,
    borderRadius: 16
  },
  sentBubble: {
    backgroundColor: '#7c3aed'
  },
  receivedBubble: {
    backgroundColor: '#f3f4f6'
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20
  },
  sentText: {
    color: '#fff'
  },
  receivedText: {
    color: '#000'
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4
  },
  timestamp: {
    fontSize: 10,
    color: '#9ca3af',
    marginRight: 4
  }
});

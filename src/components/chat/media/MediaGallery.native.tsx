import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

interface MediaGalleryProps {
  url: string;
  type: string;
  name: string;
}

export const MediaGallery = ({ url, type }: MediaGalleryProps) => {
  if (type.startsWith('image/')) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: url }} style={styles.image} resizeMode="cover" />
      </View>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: Dimensions.get('window').width * 0.7,
    borderRadius: 8,
    overflow: 'hidden'
  },
  image: {
    width: '100%',
    height: 200
  }
});
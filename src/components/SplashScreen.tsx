import React, { useEffect } from 'react';
import { View, Image, Animated, Dimensions } from 'react-native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledImage = styled(Image);

const SplashScreen = ({ onAnimationComplete }: { onAnimationComplete: () => void }) => {
  const scaleValue = new Animated.Value(0);
  const opacityValue = new Animated.Value(0);

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(500),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onAnimationComplete();
    });
  }, []);

  return (
    <StyledView className="flex-1 bg-white items-center justify-center">
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }],
          opacity: opacityValue,
        }}
      >
        <StyledImage
          source={require('../../assets/splash.png')}
          className="w-64 h-64"
          resizeMode="contain"
        />
      </Animated.View>
    </StyledView>
  );
};

export default SplashScreen;
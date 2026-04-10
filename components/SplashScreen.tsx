import { COLOR_PALETTE } from '@/constants/theme';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Animation values
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.9)).current;
  const overlayFade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.sequence([
      // 1. Entrance: Fade in and gently scale up the logo/text
      Animated.parallel([
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(contentScale, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
      // 2. Pause: Let them admire the logo
      Animated.delay(800),
      // 3. Exit: Fade out the entire overlay revealing the app
      Animated.timing(overlayFade, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsVisible(false);
      if (onFinish) onFinish();
    });
  }, []);

  if (!isVisible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: overlayFade }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: contentFade,
            transform: [{ scale: contentScale }],
          },
        ]}
      >
        <Image 
          source={require('../assets/images/logo.jpg')} 
          style={styles.logo} 
          resizeMode="contain" 
        />
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A0A12',
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5, // nice large display
    maxWidth: 250,
    maxHeight: 250,
  },
  title: {
    color: '#FAFAFA',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 20,
    letterSpacing: 2,
  },
});

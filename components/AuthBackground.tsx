import React from 'react';
import { Dimensions, Platform, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface AuthBackgroundProps {
  children: React.ReactNode;
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Decorations layer – absolutely positioned, pointer-events none so
          it never captures touches/clicks on any platform. */}
      <View style={styles.decorations} pointerEvents="none">
        {/* Base deep purple background */}
        <View style={styles.baseBg} />

        {/* Top right rotated pill */}
        <View style={[styles.shape, styles.pillTopRight]} />

        {/* Top left vertical lines */}
        <View style={[styles.line, { left: 40, top: -20, height: 160 }]} />
        <View style={[styles.line, { left: 60, top: -40, height: 180 }]} />

        {/* Center abstract ring */}
        <View style={[styles.ring, styles.ringCenter]} />

        {/* Bottom ghost diamond */}
        <View style={[styles.diamond, styles.diamondBottomLeft]} />
      </View>

      {/* Content layer – normal flow, receives all interactions */}
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#300B42',
  },
  decorations: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
  },
  content: {
    flex: 1,
    zIndex: 1,
    // Explicit position so zIndex works on web
    ...(Platform.OS === 'web' ? { position: 'relative' as const } : {}),
  },
  baseBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#300B42',
  },
  shape: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  pillTopRight: {
    width: 300,
    height: 80,
    borderRadius: 40,
    right: -60,
    top: 50,
    transform: [{ rotate: '-45deg' }],
    backgroundColor: 'rgba(100, 150, 255, 0.1)',
  },
  line: {
    position: 'absolute',
    width: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  ring: {
    position: 'absolute',
    borderWidth: 8,
    borderColor: 'rgba(200, 50, 200, 0.2)',
    borderRadius: 999,
  },
  ringCenter: {
    width: 140,
    height: 140,
    top: height * 0.3,
    right: width * 0.4,
  },
  diamond: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  diamondBottomLeft: {
    width: 400,
    height: 400,
    bottom: -150,
    left: -100,
    transform: [{ rotate: '45deg' }],
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
});

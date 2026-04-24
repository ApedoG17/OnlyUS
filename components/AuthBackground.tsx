import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

interface AuthBackgroundProps {
  children: React.ReactNode;
}

export default function AuthBackground({ children }: AuthBackgroundProps) {
  return (
    <View style={styles.container}>
      {/* Base deep purple background */}
      <View style={styles.baseBg} />

      {/* Floating geometric shapes */}
      
      {/* Top right rotated pill */}
      <View style={[styles.shape, styles.pillTopRight]} pointerEvents="none" />
      
      {/* Top left vertical lines */}
      <View style={[styles.line, { left: 40, top: -20, height: 160 }]} pointerEvents="none" />
      <View style={[styles.line, { left: 60, top: -40, height: 180 }]} pointerEvents="none" />

      {/* Center abstract circle/snake shape (simplified as rings for RN) */}
      <View style={[styles.ring, styles.ringCenter]} pointerEvents="none" />
      
      {/* Bottom giant ghost triangle/square */}
      <View style={[styles.diamond, styles.diamondBottomLeft]} pointerEvents="none" />

      {/* Main Content overlay */}
      <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  baseBg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#300B42', // Deep velvet purple base
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
    backgroundColor: 'rgba(100, 150, 255, 0.1)', // Slight blue tint matching the glass reflection in mockup
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

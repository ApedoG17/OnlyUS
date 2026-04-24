import { useScrollContext } from '@/context/ScrollContext';
import { useEnterAnim, useInView } from '@/hooks/useInView';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';
import { Link } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function CTABanner() {
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  const scrollOffset = useScrollContext();
  const { onLayout, triggered } = useInView(scrollOffset);

  const containerStyle = useEnterAnim(triggered, 0,   { fromY: 40, fromScale: 0.95 });
  const taglineStyle   = useEnterAnim(triggered, 150, { fromY: 24 });
  const headingStyle   = useEnterAnim(triggered, 260, { fromY: 28 });
  const subStyle       = useEnterAnim(triggered, 370, { fromY: 24 });
  const buttonsStyle   = useEnterAnim(triggered, 480, { fromY: 20 });

  // Ambient glow pulse on the two background orbs
  const glowPulse = useSharedValue(0.12);
  useEffect(() => {
    glowPulse.value = withRepeat(
      withSequence(
        withTiming(0.22, { duration: 2200 }),
        withTiming(0.10, { duration: 2200 }),
      ),
      -1
    );
  }, []);

  const glowLeftStyle  = useAnimatedStyle(() => ({ opacity: glowPulse.value }));
  const glowRightStyle = useAnimatedStyle(() => ({ opacity: 0.32 - glowPulse.value }));

  return (
    <Animated.View style={[styles.container, containerStyle]} onLayout={onLayout}>
      <Animated.View style={[styles.glowLeft,  glowLeftStyle]}  pointerEvents="none" />
      <Animated.View style={[styles.glowRight, glowRightStyle]} pointerEvents="none" />

      <Animated.Text style={[styles.tagline, taglineStyle]}>YOUR STORY STARTS NOW</Animated.Text>
      <Animated.Text style={[styles.heading,  headingStyle]}>
        A place built{'\n'}only for two.
      </Animated.Text>
      <Animated.Text style={[styles.sub, subStyle]}>
        No noise. No crowds. Just you and the one person that matters.
      </Animated.Text>

      <Animated.View style={[styles.buttons, buttonsStyle]}>
        <Link href="/register" asChild>
          <TouchableOpacity style={styles.primaryBtn}>
            <Text style={styles.primaryBtnText}>Begin Your Journey</Text>
          </TouchableOpacity>
        </Link>
        <Link href={isSignedIn ? '/enter-code' : '/register'} asChild>
          <TouchableOpacity style={styles.secondaryBtn}>
            <Text style={styles.secondaryBtnText}>Enter Invite Code →</Text>
          </TouchableOpacity>
        </Link>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: SPACING.md,
    marginVertical: SPACING.xl,
    borderRadius: RADIUS.xxl,
    padding: SPACING.xxl,
    backgroundColor: '#14142B',
    borderWidth: 1,
    borderColor: COLOR_PALETTE.primary + '40',
    overflow: 'hidden',
    alignItems: 'center',
  },
  glowLeft: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLOR_PALETTE.primary,
    left: -60,
    top: -60,
  },
  glowRight: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLOR_PALETTE.secondary,
    right: -60,
    bottom: -60,
  },
  tagline: {
    color: COLOR_PALETTE.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: SPACING.md,
    textAlign: 'center',
  },
  heading: {
    color: COLOR_PALETTE.text,
    fontFamily: SERIF,
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 46,
    marginBottom: SPACING.md,
  },
  sub: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: SPACING.xl,
    maxWidth: 300,
  },
  buttons: {
    gap: SPACING.md,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: COLOR_PALETTE.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.full,
  },
  primaryBtnText: {
    color: '#000000',
    fontWeight: '800',
    fontSize: 17,
  },
  secondaryBtn: {
    paddingVertical: SPACING.sm,
  },
  secondaryBtnText: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 15,
    fontWeight: '600',
  },
});

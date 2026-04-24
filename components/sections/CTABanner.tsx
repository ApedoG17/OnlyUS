import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Link, useRouter } from 'expo-router';
import { useAuthStore } from '@/store/useAuthStore';
import React from 'react';
import { Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function CTABanner() {
  const router = useRouter();
  const isSignedIn = useAuthStore((state) => state.isSignedIn);

  const handleEnterCode = () => {
    if (isSignedIn) {
      router.push('/enter-code' as any);
    } else {
      router.push('/register' as any);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.glowLeft} pointerEvents="none" />
      <View style={styles.glowRight} pointerEvents="none" />
      <Text style={styles.tagline}>YOUR STORY STARTS NOW</Text>
      <Text style={styles.heading}>
        A place built{'\n'}only for two.
      </Text>
      <Text style={styles.sub}>
        No noise. No crowds. Just you and the one person that matters.
      </Text>
      <View style={styles.buttons}>
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
      </View>
    </View>
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
    opacity: 0.12,
    left: -60,
    top: -60,
  },
  glowRight: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: COLOR_PALETTE.secondary,
    opacity: 0.12,
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

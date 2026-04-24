import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Eye, Lock, Shield, ShieldBan, ShieldCheck, ZapOff } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, Text, View } from 'react-native';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const BADGES = [
  { icon: <ShieldCheck color={COLOR_PALETTE.primary} size={22} />, label: 'End-to-End\nEncrypted' },
  { icon: <Eye color={COLOR_PALETTE.secondary} size={22} />, label: 'No Screenshot\nMode' },
  { icon: <ZapOff color="#7C3AED" size={22} />, label: 'Zero\nThird Parties' },
  { icon: <Lock color={COLOR_PALETTE.goldAccent} size={22} />, label: '100%\nPrivate' },
  { icon: <ShieldBan color={COLOR_PALETTE.primary} size={22} />, label: 'No Ads\nEver' },
  { icon: <Shield color={COLOR_PALETTE.secondary} size={22} />, label: 'Safe\nBy Design' },
];

const BADGE_WIDTH = 90 + SPACING.md; // badge width + gap
const SET_WIDTH = BADGES.length * BADGE_WIDTH; // width of one full set
const SCROLL_DURATION = 18000; // ms for one full loop (slower = smoother)

function BadgeItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <View style={styles.badge}>
      <View style={styles.iconBox}>{icon}</View>
      <Text style={styles.badgeLabel}>{label}</Text>
    </View>
  );
}

export default function PrivacyBadges() {
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      scrollX.setValue(0);
      Animated.timing(scrollX, {
        toValue: -SET_WIDTH,
        duration: SCROLL_DURATION,
        useNativeDriver: true,
        isInteraction: false,
      }).start(({ finished }) => {
        if (finished) animate(); // loop forever
      });
    };
    animate();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>TRUSTED & CERTIFIED</Text>
      <View style={styles.marqueeClip}>
        <Animated.View
          style={[
            styles.marqueeTrack,
            { transform: [{ translateX: scrollX }] },
          ]}
        >
          {/* Render badges twice so the second set seamlessly follows the first */}
          {BADGES.map((badge, i) => (
            <BadgeItem key={`a-${i}`} icon={badge.icon} label={badge.label} />
          ))}
          {BADGES.map((badge, i) => (
            <BadgeItem key={`b-${i}`} icon={badge.icon} label={badge.label} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xl,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLOR_PALETTE.border,
    backgroundColor: '#0D0D18',
  },
  label: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 2,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  marqueeClip: {
    overflow: 'hidden',
    width: '100%',
  },
  marqueeTrack: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  badge: {
    alignItems: 'center',
    gap: SPACING.sm,
    width: 90,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.full,
    backgroundColor: COLOR_PALETTE.surface,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeLabel: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});

import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Eye, Lock, Shield, ShieldBan, ShieldCheck, ZapOff } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const BADGES = [
  { icon: <ShieldCheck color={COLOR_PALETTE.primary} size={22} />, label: 'End-to-End\nEncrypted' },
  { icon: <Eye color={COLOR_PALETTE.secondary} size={22} />, label: 'No Screenshot\nMode' },
  { icon: <ZapOff color="#7C3AED" size={22} />, label: 'Zero\nThird Parties' },
  { icon: <Lock color={COLOR_PALETTE.goldAccent} size={22} />, label: '100%\nPrivate' },
  { icon: <ShieldBan color={COLOR_PALETTE.primary} size={22} />, label: 'No Ads\nEver' },
  { icon: <Shield color={COLOR_PALETTE.secondary} size={22} />, label: 'Safe\nBy Design' },
];

export default function PrivacyBadges() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>TRUSTED & CERTIFIED</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollRow}
      >
        {BADGES.map((badge, i) => (
          <View key={i} style={styles.badge}>
            <View style={styles.iconBox}>{badge.icon}</View>
            <Text style={styles.badgeLabel}>{badge.label}</Text>
          </View>
        ))}
      </ScrollView>
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
  scrollRow: {
    paddingHorizontal: SPACING.xl,
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

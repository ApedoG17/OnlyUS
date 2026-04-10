import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Bell, EyeOff, Mic, ShieldAlert, TextQuote } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function Communication() {
  const isLargeScreen = width > 768;

  const features = [
    {
      title: 'Real-Time Text',
      desc: 'Instant messaging with exact timestamps and basic delivery statuses.',
      icon: <TextQuote color={COLOR_PALETTE.primary} size={24} />,
    },
    {
      title: 'Voice Notes',
      desc: 'Send and receive secure, high-fidelity audio messages for when words aren\'t enough.',
      icon: <Mic color={COLOR_PALETTE.primary} size={24} />,
    },
    {
      title: 'Opt-in Read Receipts',
      desc: 'Toggle read receipts ON or OFF at any time. You are in control of the pressure.',
      icon: <EyeOff color={COLOR_PALETTE.primary} size={24} />,
    },
    {
      title: 'Smart Notifications',
      desc: 'Reliable new message alerts. Optional streak reminders to keep the connection alive.',
      icon: <Bell color={COLOR_PALETTE.primary} size={24} />,
    },
    {
      title: 'Abuse Prevention',
      desc: 'No "last seen" tracking by default. Use "Do Not Disturb" to actively signal unavailability without drama.',
      icon: <ShieldAlert color={COLOR_PALETTE.primary} size={24} />,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerSubtitle}>FOCUSED INTERACTION</Text>
      <Text style={styles.headerTitle}>Safe & Private Chat</Text>

      <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
        {features.map((item, index) => (
          <View key={index} style={[styles.card, isLargeScreen && styles.cardLarge]}>
            <View style={styles.iconWrapper}>{item.icon}</View>
            <View style={styles.textStack}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  headerSubtitle: {
    color: COLOR_PALETTE.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  headerTitle: {
    color: '#FAFAFA',
    fontFamily: SERIF_FONT,
    fontSize: 32,
    marginBottom: SPACING.xl,
  },
  grid: {
    flexDirection: 'column',
    gap: SPACING.lg,
  },
  gridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.md,
  },
  cardLarge: {
    width: '45%',
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.md,
    backgroundColor: COLOR_PALETTE.surfaceHover,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLOR_PALETTE.border,
  },
  textStack: {
    flex: 1,
  },
  title: {
    color: '#FAFAFA',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: SERIF_FONT,
    marginBottom: 4,
  },
  desc: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});

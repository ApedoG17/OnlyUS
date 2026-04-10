import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function HowItWorks() {
  const steps = [
    {
      num: '01',
      title: 'Create Your Account',
      desc: 'Sign up in seconds. Your profile is strictly private — no public presence, no discoverability.',
      color: COLOR_PALETTE.primary,
    },
    {
      num: '02',
      title: 'Invite Your Partner',
      desc: 'Generate a unique, single-use encrypted invite link. Only one person can ever accept it.',
      color: COLOR_PALETTE.secondary,
    },
    {
      num: '03',
      title: 'Lock In & Connect',
      desc: 'Once accepted, you\'re locked in together. Your private universe starts immediately — streaks, vault, chats, everything.',
      color: '#7C3AED',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>THE PROCESS</Text>
      <Text style={styles.title}>Simple. Intentional. Secure.</Text>

      {steps.map((step, i) => (
        <View key={i} style={styles.step}>
          {/* Left: number + connector line */}
          <View style={styles.leftCol}>
            <View style={[styles.numCircle, { borderColor: step.color }]}>
              <Text style={[styles.numText, { color: step.color }]}>{step.num}</Text>
            </View>
            {i < steps.length - 1 && <View style={[styles.connector, { backgroundColor: step.color + '40' }]} />}
          </View>

          {/* Right: content */}
          <View style={styles.rightCol}>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  subtitle: {
    color: COLOR_PALETTE.primary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLOR_PALETTE.text,
    fontFamily: SERIF,
    fontSize: 32,
    marginBottom: SPACING.xl,
  },
  step: {
    flexDirection: 'row',
    gap: SPACING.lg,
    marginBottom: SPACING.md,
  },
  leftCol: {
    alignItems: 'center',
    width: 56,
  },
  numCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.full,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_PALETTE.surface,
  },
  numText: {
    fontSize: 16,
    fontWeight: '800',
  },
  connector: {
    width: 2,
    flex: 1,
    marginVertical: SPACING.xs,
    minHeight: 40,
  },
  rightCol: {
    flex: 1,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xl,
  },
  stepTitle: {
    color: COLOR_PALETTE.text,
    fontFamily: SERIF,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },
  stepDesc: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
});

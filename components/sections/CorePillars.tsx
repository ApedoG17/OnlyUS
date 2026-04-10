import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Heart, Lock, MessageCircle, Moon } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function CorePillars() {
  const isLargeScreen = width > 768;

  const pillars = [
    {
      id: '1',
      icon: <Lock color={COLOR_PALETTE.primary} size={32} strokeWidth={1.5} />,
      title: 'Exclusive 1-to-1',
      description: 'Zero third-party interaction. No randoms, no group chats.',
    },
    {
      id: '2',
      icon: <MessageCircle color={COLOR_PALETTE.primary} size={32} strokeWidth={1.5} />,
      title: 'Private Focus',
      description: 'Targeted communication designed exclusively for you two.',
    },
    {
      id: '3',
      icon: <Heart color={COLOR_PALETTE.primary} size={32} strokeWidth={1.5} />,
      title: 'Beyond Chatting',
      description: 'Deep relationship-building tools and structured prompts.',
    },
    {
      id: '4',
      icon: <Moon color={COLOR_PALETTE.primary} size={32} strokeWidth={1.5} />,
      title: 'Calm Environment',
      description: 'A completely secure and entirely distraction-free digital space.',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerSubtitle}>OUR PHILOSOPHY</Text>
      <Text style={styles.headerTitle}>The Sacred Space</Text>

      <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
        {pillars.map((pillar) => (
          <View key={pillar.id} style={[styles.card, isLargeScreen && styles.cardLarge]}>
            <View style={styles.iconWrapper}>{pillar.icon}</View>
            <Text style={styles.cardTitle}>{pillar.title}</Text>
            <Text style={styles.cardDesc}>{pillar.description}</Text>
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
    textAlign: 'center',
  },
  headerTitle: {
    color: '#FAFAFA',
    fontFamily: SERIF_FONT,
    fontSize: 32,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'column',
    gap: SPACING.md,
  },
  gridLarge: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: COLOR_PALETTE.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.border,
  },
  cardLarge: {
    width: '48%',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(212, 175, 55, 0.1)', // Subtle gold tint
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  cardTitle: {
    color: '#FAFAFA',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: SERIF_FONT,
    marginBottom: SPACING.sm,
  },
  cardDesc: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
});

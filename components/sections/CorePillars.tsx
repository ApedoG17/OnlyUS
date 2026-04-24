import { useScrollContext } from '@/context/ScrollContext';
import { useEnterAnim, useInView } from '@/hooks/useInView';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Heart, Lock, MessageCircle, Moon } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

interface PillarCardProps {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  triggered: boolean;
  delay: number;
  isLargeScreen: boolean;
}

function PillarCard({ icon, title, description, triggered, delay, isLargeScreen }: PillarCardProps) {
  const animStyle = useEnterAnim(triggered, delay, { fromY: 50, fromScale: 0.95 });
  return (
    <Animated.View style={[styles.card, isLargeScreen && styles.cardLarge, animStyle]}>
      <View style={styles.iconWrapper}>{icon}</View>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDesc}>{description}</Text>
    </Animated.View>
  );
}

export default function CorePillars() {
  const scrollOffset = useScrollContext();
  const { onLayout, triggered } = useInView(scrollOffset);
  const isLargeScreen = width > 768;

  const labelStyle = useEnterAnim(triggered, 0, { fromX: -24, fromY: 0 });
  const titleStyle = useEnterAnim(triggered, 100, { fromY: 30 });

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
    <View style={styles.container} onLayout={onLayout}>
      <Animated.Text style={[styles.headerSubtitle, labelStyle]}>OUR PHILOSOPHY</Animated.Text>
      <Animated.Text style={[styles.headerTitle, titleStyle]}>The Sacred Space</Animated.Text>

      <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
        {pillars.map((pillar, i) => (
          <PillarCard
            key={pillar.id}
            {...pillar}
            triggered={triggered}
            delay={200 + i * 130}
            isLargeScreen={isLargeScreen}
          />
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
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
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

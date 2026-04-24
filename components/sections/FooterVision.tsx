import { useScrollContext } from '@/context/ScrollContext';
import { useEnterAnim, useInView } from '@/hooks/useInView';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Network, Rocket, UserPlus } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function FooterVision() {
  const scrollOffset = useScrollContext();
  const { onLayout, triggered } = useInView(scrollOffset);
  const isLargeScreen = width > 768;

  const blockStyle  = useEnterAnim(triggered, 0,   { fromY: 40, fromScale: 0.97 });
  const vhStyle     = useEnterAnim(triggered, 180, { fromY: 30 });
  const vsStyle     = useEnterAnim(triggered, 260, { fromY: 20 });
  const card0Style  = useEnterAnim(triggered, 360, { fromY: 40, fromScale: 0.96 });
  const card1Style  = useEnterAnim(triggered, 480, { fromY: 40, fromScale: 0.96 });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.View style={[styles.block, { borderColor: COLOR_PALETTE.primary, backgroundColor: 'rgba(212, 175, 55, 0.05)' }, blockStyle]}>
        <View style={styles.iconHeader}>
          <UserPlus color={COLOR_PALETTE.primary} size={28} />
          <Text style={styles.blockTitle}>Single Users & Invitations</Text>
        </View>
        <Text style={styles.blockText}>
          Flying solo for now? Users without a partner can still access the platform to send their unique secure invite link. Functionality remains strictly limited to secure configuration until your partner officially connects, ensuring complete privacy from day one.
        </Text>
      </Animated.View>

      <View style={styles.visionContainer}>
        <Animated.Text style={[styles.visionHeader,  vhStyle]}>The Future Roadmap</Animated.Text>
        <Animated.Text style={[styles.visionSubtext, vsStyle]}>We never stop building. Coming soon to the ecosystem:</Animated.Text>

        <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
          <Animated.View style={[styles.visionCard, isLargeScreen && styles.cardLarge, card0Style]}>
            <Network color="#FAFAFA" size={24} />
            <Text style={styles.visionCardTitle}>AI Relationship Assistant</Text>
            <Text style={styles.visionCardText}>Smart, empathetic suggestions to help resolve conflicts or spark new ideas.</Text>
          </Animated.View>

          <Animated.View style={[styles.visionCard, isLargeScreen && styles.cardLarge, card1Style]}>
            <Rocket color="#FAFAFA" size={24} />
            <Text style={styles.visionCardTitle}>Long-Distance Toolkit</Text>
            <Text style={styles.visionCardText}>Timezone syncing, countdown timers, virtual dates, and couple's gaming modules.</Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    backgroundColor: '#0D0D0D',
  },
  block: {
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    marginBottom: SPACING.xxl,
  },
  iconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.md,
  },
  blockTitle: {
    color: '#FAFAFA',
    fontFamily: SERIF_FONT,
    fontSize: 24,
    fontWeight: '700',
  },
  blockText: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  visionContainer: {
    marginTop: SPACING.md,
  },
  visionHeader: {
    color: '#FAFAFA',
    fontFamily: SERIF_FONT,
    fontSize: 28,
    marginBottom: SPACING.xs,
  },
  visionSubtext: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 15,
    marginBottom: SPACING.lg,
  },
  grid: {
    flexDirection: 'column',
    gap: SPACING.md,
  },
  gridLarge: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  visionCard: {
    backgroundColor: COLOR_PALETTE.surface,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
  },
  cardLarge: {
    width: '48%',
  },
  visionCardTitle: {
    color: '#FAFAFA',
    fontSize: 18,
    fontWeight: '700',
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  visionCardText: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});

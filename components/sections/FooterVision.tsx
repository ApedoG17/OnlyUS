import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Network, Rocket, UserPlus } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function FooterVision() {
  const isLargeScreen = width > 768;

  return (
    <View style={styles.container}>
      
      {/* Single Users Box */}
      <View style={[styles.block, { borderColor: COLOR_PALETTE.primary, backgroundColor: 'rgba(212, 175, 55, 0.05)' }]}>
        <View style={styles.iconHeader}>
          <UserPlus color={COLOR_PALETTE.primary} size={28} />
          <Text style={styles.blockTitle}>Single Users & Invitations</Text>
        </View>
        <Text style={styles.blockText}>
          Flying solo for now? Users without a partner can still access the platform to send their unique secure invite link. Functionality remains strictly limited to secure configuration until your partner officially connects, ensuring complete privacy from day one.
        </Text>
      </View>

      {/* Future Vision Grid */}
      <View style={styles.visionContainer}>
        <Text style={styles.visionHeader}>The Future Roadmap</Text>
        <Text style={styles.visionSubtext}>We never stop building. Coming soon to the ecosystem:</Text>
        
        <View style={[styles.grid, isLargeScreen && styles.gridLarge]}>
          <View style={[styles.visionCard, isLargeScreen && styles.cardLarge]}>
            <Network color="#FAFAFA" size={24} />
            <Text style={styles.visionCardTitle}>AI Relationship Assistant</Text>
            <Text style={styles.visionCardText}>Smart, empathetic suggestions to help resolve conflicts or spark new ideas.</Text>
          </View>
          
          <View style={[styles.visionCard, isLargeScreen && styles.cardLarge]}>
            <Rocket color="#FAFAFA" size={24} />
            <Text style={styles.visionCardTitle}>Long-Distance Toolkit</Text>
            <Text style={styles.visionCardText}>Timezone syncing, countdown timers, virtual dates, and couple's gaming modules.</Text>
          </View>
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

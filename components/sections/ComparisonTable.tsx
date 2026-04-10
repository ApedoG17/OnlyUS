import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Check, X } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const YES = <Check color={COLOR_PALETTE.primary} size={18} strokeWidth={3} />;
const NO = <X color={COLOR_PALETTE.secondary} size={18} strokeWidth={3} />;

const rows = [
  { feature: 'Strictly 1-to-1 only',   onlyus: YES, whatsapp: NO,  snap: NO  },
  { feature: 'No ads or third parties', onlyus: YES, whatsapp: NO,  snap: NO  },
  { feature: 'Screenshot protection',   onlyus: YES, whatsapp: NO,  snap: YES },
  { feature: 'Relationship streaks',    onlyus: YES, whatsapp: NO,  snap: NO  },
  { feature: 'Memory vault',            onlyus: YES, whatsapp: NO,  snap: NO  },
  { feature: 'Daily mood check-ins',    onlyus: YES, whatsapp: NO,  snap: NO  },
  { feature: 'Couple milestones',       onlyus: YES, whatsapp: NO,  snap: NO  },
  { feature: 'Breakup protocol',        onlyus: YES, whatsapp: NO,  snap: NO  },
  { feature: '"Do Not Disturb" mode',   onlyus: YES, whatsapp: YES, snap: NO  },
  { feature: 'No public profile',       onlyus: YES, whatsapp: NO,  snap: NO  },
];

export default function ComparisonTable() {
  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>VS THE REST</Text>
      <Text style={styles.title}>Why OnlyUs Wins</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Header row */}
          <View style={styles.headerRow}>
            <Text style={[styles.featureCell, styles.headerText]}>Feature</Text>
            <View style={[styles.appCell, styles.highlightCol]}>
              <Text style={[styles.headerText, { color: COLOR_PALETTE.primary }]}>OnlyUs</Text>
            </View>
            <View style={styles.appCell}>
              <Text style={[styles.headerText, { color: COLOR_PALETTE.textMuted }]}>WhatsApp</Text>
            </View>
            <View style={styles.appCell}>
              <Text style={[styles.headerText, { color: COLOR_PALETTE.textMuted }]}>Snapchat</Text>
            </View>
          </View>

          {/* Data rows */}
          {rows.map((row, i) => (
            <View key={i} style={[styles.dataRow, i % 2 === 0 && styles.altRow]}>
              <Text style={styles.featureCell}>{row.feature}</Text>
              <View style={[styles.appCell, styles.highlightCol]}>{row.onlyus}</View>
              <View style={styles.appCell}>{row.whatsapp}</View>
              <View style={styles.appCell}>{row.snap}</View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xxl,
    backgroundColor: '#0E0E1A',
  },
  subtitle: {
    color: COLOR_PALETTE.secondary,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: SPACING.xs,
    paddingHorizontal: SPACING.xl,
  },
  title: {
    color: COLOR_PALETTE.text,
    fontFamily: SERIF,
    fontSize: 32,
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.xl,
  },
  headerRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PALETTE.border,
  },
  dataRow: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  altRow: {
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  headerText: {
    color: COLOR_PALETTE.text,
    fontWeight: '700',
    fontSize: 14,
  },
  featureCell: {
    width: 200,
    color: COLOR_PALETTE.textMuted,
    fontSize: 14,
    alignSelf: 'center',
  },
  appCell: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightCol: {
    backgroundColor: 'rgba(78, 205, 196, 0.06)',
    borderRadius: RADIUS.sm,
  },
});

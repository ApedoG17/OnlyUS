import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { AlertTriangle, Clock, DownloadCloud, Link, Link2Off, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

export default function RelationshipSystem() {
  const [expandedId, setExpandedId] = useState<string | null>('link');

  const toggleExpand = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const rules = [
    {
      id: 'link',
      title: 'The Connection Process',
      icon: <Link color={COLOR_PALETTE.primary} size={24} />,
      content: 'Generate a unique secure invite link. The timeline only begins once your partner connects. Statuses update seamlessly from Pending to Connected.',
    },
    {
      id: 'breakup',
      title: 'Unlinking & Breakups',
      icon: <Link2Off color={COLOR_PALETTE.primary} size={24} />,
      content: 'Either user can request an unlink. This requires confirmation from both parties, or activates an automated timeout if one partner vanishes.',
    },
    {
      id: 'consequences',
      title: 'The 1-Week Rule',
      icon: <Clock color={COLOR_PALETTE.primary} size={24} />,
      content: 'Make sure it’s the right decision. If you choose to break the connection, the platform enforces a strict 7-day cooldown before you can link back to that specific person.',
    },
    {
      id: 'data',
      title: 'Data & Memories',
      icon: <DownloadCloud color={COLOR_PALETTE.primary} size={24} />,
      content: 'Upon unlinking, you hold three choices: Export to a secure archive (premium fee), perfectly vanish all traces of the connection immediately, or put memories on subscription hold.',
    },
    {
      id: 'inactive',
      title: 'Inactive Partner Protocol',
      icon: <AlertTriangle color={COLOR_PALETTE.primary} size={24} />,
      content: 'If one user disappears and becomes fully inactive for too long, the active partner gains the option to unilaterally exit the connection safely.',
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.headerSubtitle}>RELATIONSHIP MECHANICS</Text>
      <Text style={styles.headerTitle}>The Rules of Engagement</Text>

      <View style={styles.accordionContainer}>
        {rules.map((rule) => {
          const isExpanded = expandedId === rule.id;
          return (
            <TouchableOpacity 
              key={rule.id} 
              style={[styles.ruleCard, isExpanded && styles.ruleCardActive]}
              onPress={() => toggleExpand(rule.id)}
              activeOpacity={0.8}
            >
              <View style={styles.ruleHeader}>
                <View style={styles.iconWrapper}>{rule.icon}</View>
                <Text style={styles.ruleTitle}>{rule.title}</Text>
              </View>
              {isExpanded && (
                <Text style={styles.ruleContent}>{rule.content}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    backgroundColor: '#111215', // slightly offset background
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
  accordionContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: SPACING.md,
  },
  ruleCard: {
    backgroundColor: COLOR_PALETTE.surface,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLOR_PALETTE.border,
  },
  ruleCardActive: {
    borderColor: COLOR_PALETTE.primaryMuted,
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
  },
  ruleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  iconWrapper: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ruleTitle: {
    color: '#FAFAFA',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: SERIF_FONT,
    flex: 1,
  },
  ruleContent: {
    marginTop: SPACING.md,
    color: COLOR_PALETTE.textMuted,
    fontSize: 15,
    lineHeight: 22,
    paddingLeft: 44 + SPACING.md, // align with text
  },
});

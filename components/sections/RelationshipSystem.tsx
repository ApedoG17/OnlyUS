import { useScrollContext } from '@/context/ScrollContext';
import { useEnterAnim, useInView } from '@/hooks/useInView';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { AlertTriangle, Clock, DownloadCloud, Link, Link2Off } from 'lucide-react-native';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import Animated from 'react-native-reanimated';

const SERIF_FONT = Platform.OS === 'ios' ? 'Georgia' : 'serif';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface RuleCardProps {
  id: string;
  title: string;
  icon: React.ReactNode;
  content: string;
  isExpanded: boolean;
  onPress: () => void;
  triggered: boolean;
  delay: number;
}

function RuleCard({ title, icon, content, isExpanded, onPress, triggered, delay }: RuleCardProps) {
  const animStyle = useEnterAnim(triggered, delay, { fromX: 40, fromY: 0, fromScale: 0.97 });
  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[styles.ruleCard, isExpanded && styles.ruleCardActive]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.ruleHeader}>
          <View style={styles.iconWrapper}>{icon}</View>
          <Text style={styles.ruleTitle}>{title}</Text>
        </View>
        {isExpanded && <Text style={styles.ruleContent}>{content}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function RelationshipSystem() {
  const scrollOffset = useScrollContext();
  const { onLayout, triggered } = useInView(scrollOffset);
  const [expandedId, setExpandedId] = useState<string | null>('link');

  const labelStyle = useEnterAnim(triggered, 0,   { fromX: -24, fromY: 0 });
  const titleStyle = useEnterAnim(triggered, 100, { fromY: 30 });

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
      content: "Make sure it's the right decision. If you choose to break the connection, the platform enforces a strict 7-day cooldown before you can link back to that specific person.",
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
    <View style={styles.container} onLayout={onLayout}>
      <Animated.Text style={[styles.headerSubtitle, labelStyle]}>RELATIONSHIP MECHANICS</Animated.Text>
      <Animated.Text style={[styles.headerTitle,    titleStyle]}>The Rules of Engagement</Animated.Text>

      <View style={styles.accordionContainer}>
        {rules.map((rule, i) => (
          <RuleCard
            key={rule.id}
            {...rule}
            isExpanded={expandedId === rule.id}
            onPress={() => toggleExpand(rule.id)}
            triggered={triggered}
            delay={200 + i * 110}
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
    backgroundColor: '#111215',
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
    paddingLeft: 44 + SPACING.md,
  },
});

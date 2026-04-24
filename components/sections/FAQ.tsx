import { useScrollContext } from '@/context/ScrollContext';
import { useEnterAnim, useInView } from '@/hooks/useInView';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';
import Animated from 'react-native-reanimated';

const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

const FAQS = [
  {
    q: 'Can someone add me without my permission?',
    a: 'Absolutely not. Connection only happens when you choose to accept a unique invite link. Your profile is completely undiscoverable.',
  },
  {
    q: 'What happens to my data after a breakup?',
    a: 'You have full control. You can export all conversations (premium fee), archive memories on a subscription hold, or permanently erase every trace instantly.',
  },
  {
    q: 'Can I link with a new person immediately after unlinking?',
    a: 'If you re-link with the same person, you must wait 7 days first. This encourages intentional decisions. Linking with a completely new person is unrestricted.',
  },
  {
    q: 'What if my partner becomes inactive for a long time?',
    a: "After a set inactivity period, you will gain the option to exit the relationship unilaterally — you'll never be permanently trapped in a ghost connection.",
  },
  {
    q: 'Is the streak system mandatory?',
    a: 'Not at all. The streak system can be disabled at any time by either user to prevent pressure or anxiety around daily interaction.',
  },
  {
    q: 'Are screenshots truly blocked?',
    a: 'Yes. The app enforces a strict no-screenshot and no-screen-recording policy on all supported platforms to protect your privacy completely.',
  },
];

interface FAQItemProps {
  faq: { q: string; a: string };
  isOpen: boolean;
  onPress: () => void;
  triggered: boolean;
  delay: number;
}

function FAQItem({ faq, isOpen, onPress, triggered, delay }: FAQItemProps) {
  const animStyle = useEnterAnim(triggered, delay, { fromY: 30, fromScale: 0.98 });
  return (
    <Animated.View style={animStyle}>
      <TouchableOpacity
        style={[styles.item, isOpen && styles.itemOpen]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        <View style={styles.row}>
          <Text style={[styles.question, isOpen && { color: COLOR_PALETTE.primary }]}>
            {faq.q}
          </Text>
          {isOpen
            ? <ChevronUp color={COLOR_PALETTE.primary} size={20} />
            : <ChevronDown color={COLOR_PALETTE.textMuted} size={20} />}
        </View>
        {isOpen && <Text style={styles.answer}>{faq.a}</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

export default function FAQ() {
  const scrollOffset = useScrollContext();
  const { onLayout, triggered } = useInView(scrollOffset);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const labelStyle = useEnterAnim(triggered, 0,   { fromX: -24, fromY: 0 });
  const titleStyle = useEnterAnim(triggered, 100, { fromY: 30 });

  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.Text style={[styles.subtitle, labelStyle]}>QUESTIONS WE KNOW YOU HAVE</Animated.Text>
      <Animated.Text style={[styles.title,    titleStyle]}>Frequently Asked</Animated.Text>

      {FAQS.map((faq, i) => (
        <FAQItem
          key={i}
          faq={faq}
          isOpen={openIndex === i}
          onPress={() => toggle(i)}
          triggered={triggered}
          delay={200 + i * 90}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
    backgroundColor: COLOR_PALETTE.background,
  },
  subtitle: {
    color: COLOR_PALETTE.secondary,
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
  item: {
    borderWidth: 1,
    borderColor: COLOR_PALETTE.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    backgroundColor: COLOR_PALETTE.surface,
  },
  itemOpen: {
    borderColor: COLOR_PALETTE.primary + '60',
    backgroundColor: 'rgba(78, 205, 196, 0.05)',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  question: {
    color: COLOR_PALETTE.text,
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    lineHeight: 22,
  },
  answer: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 15,
    lineHeight: 22,
    marginTop: SPACING.md,
  },
});

import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

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
    a: 'After a set inactivity period, you will gain the option to exit the relationship unilaterally — you\'ll never be permanently trapped in a ghost connection.',
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

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>QUESTIONS WE KNOW YOU HAVE</Text>
      <Text style={styles.title}>Frequently Asked</Text>

      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <TouchableOpacity
            key={i}
            style={[styles.item, isOpen && styles.itemOpen]}
            onPress={() => toggle(i)}
            activeOpacity={0.8}
          >
            <View style={styles.row}>
              <Text style={[styles.question, isOpen && { color: COLOR_PALETTE.primary }]}>
                {faq.q}
              </Text>
              {isOpen
                ? <ChevronUp color={COLOR_PALETTE.primary} size={20} />
                : <ChevronDown color={COLOR_PALETTE.textMuted} size={20} />
              }
            </View>
            {isOpen && <Text style={styles.answer}>{faq.a}</Text>}
          </TouchableOpacity>
        );
      })}
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

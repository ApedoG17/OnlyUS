import { useScrollContext } from '@/context/ScrollContext';
import { useEnterAnim, useInView } from '@/hooks/useInView';
import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import React from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

const TESTIMONIALS = [
  {
    quote: "We've maintained a 243-day streak. OnlyUs made us feel like our relationship finally has its own home.",
    name: 'Amara & Kofi',
    since: 'Together 2 years',
    color: COLOR_PALETTE.primary,
  },
  {
    quote: "The daily prompts started conversations I didn't even know we needed. This app literally deepened our bond.",
    name: 'Leila & Marcus',
    since: 'Together 8 months',
    color: COLOR_PALETTE.secondary,
  },
  {
    quote: "Knowing no one else can reach him on this app gives me a level of focus and safety I've never felt before.",
    name: 'Sofia & James',
    since: 'Together 1.5 years',
    color: '#7C3AED',
  },
  {
    quote: "The Memory Vault is everything. We have our private world in here. It's sacred.",
    name: 'Keiko & André',
    since: 'Together 3 years',
    color: COLOR_PALETTE.goldAccent,
  },
];

export default function Testimonials() {
  const scrollOffset = useScrollContext();
  const { onLayout, triggered } = useInView(scrollOffset);

  const labelStyle = useEnterAnim(triggered, 0,   { fromX: -24, fromY: 0 });
  const titleStyle = useEnterAnim(triggered, 100, { fromY: 30 });
  const cardsStyle = useEnterAnim(triggered, 240, { fromY: 40, fromScale: 0.97 });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <Animated.Text style={[styles.subtitle, labelStyle]}>REAL COUPLES</Animated.Text>
      <Animated.Text style={[styles.title,    titleStyle]}>Stories That Matter</Animated.Text>

      <Animated.View style={cardsStyle}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          snapToInterval={width * 0.82 + SPACING.lg}
          decelerationRate="fast"
        >
          {TESTIMONIALS.map((t, i) => (
            <View key={i} style={[styles.card, { borderTopColor: t.color }]}>
              <Text style={[styles.quoteMark, { color: t.color }]}>"</Text>
              <Text style={styles.quoteText}>{t.quote}</Text>
              <View style={styles.author}>
                <View style={[styles.avatar, { backgroundColor: t.color + '30', borderColor: t.color }]}>
                  <Text style={[styles.avatarText, { color: t.color }]}>{t.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text style={styles.name}>{t.name}</Text>
                  <Text style={styles.since}>{t.since}</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xxl,
    backgroundColor: COLOR_PALETTE.surface,
  },
  subtitle: {
    color: COLOR_PALETTE.primary,
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
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
    paddingBottom: SPACING.sm,
  },
  card: {
    width: width * 0.82,
    maxWidth: 380,
    backgroundColor: COLOR_PALETTE.surfaceHover,
    padding: SPACING.xl,
    borderRadius: RADIUS.xl,
    borderTopWidth: 3,
  },
  quoteMark: {
    fontSize: 64,
    lineHeight: 60,
    fontFamily: SERIF,
    marginBottom: SPACING.xs,
  },
  quoteText: {
    color: COLOR_PALETTE.text,
    fontSize: 16,
    lineHeight: 26,
    marginBottom: SPACING.lg,
    fontStyle: 'italic',
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.full,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },
  name: {
    color: COLOR_PALETTE.text,
    fontWeight: '700',
    fontSize: 16,
  },
  since: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 13,
  },
});

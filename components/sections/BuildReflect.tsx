import { COLOR_PALETTE, RADIUS, SPACING } from '@/constants/theme';
import { Calendar, Flame, MessageCircle, Palette, Smile } from 'lucide-react-native';
import React from 'react';
import { Dimensions, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');
const SERIF = Platform.OS === 'ios' ? 'Georgia' : 'serif';

export default function BuildReflect() {
  const cards = [
    {
      title: 'Daily Prompts',
      desc: 'Guided questions at the end of every day to encourage deeper, meaningful conversations.',
      icon: <MessageCircle color="#FAFAFA" size={32} strokeWidth={1.5} />,
      color: COLOR_PALETTE.primary,
    },
    {
      title: 'Mood Check-ins',
      desc: 'Users share how they feel daily to naturally track the emotional pulse of the relationship.',
      icon: <Smile color="#FAFAFA" size={32} strokeWidth={1.5} />,
      color: '#1A9E6B',
    },
    {
      title: 'Streak System',
      desc: 'Tracks daily interaction. Resets after 24 hrs of inactivity. Toggleable — no pressure.',
      icon: <Flame color="#FAFAFA" size={32} strokeWidth={1.5} />,
      color: COLOR_PALETTE.secondary,
    },
    {
      title: 'Timeline & Calendar',
      desc: 'Tracks milestones, days together, anniversaries, birthdays and your shared personal calendar.',
      icon: <Calendar color="#FAFAFA" size={32} strokeWidth={1.5} />,
      color: '#7C3AED',
    },
    {
      title: 'Custom Themes',
      desc: 'Personalize the entire chat interface to match the mood and aesthetic of your relationship.',
      icon: <Palette color="#FAFAFA" size={32} strokeWidth={1.5} />,
      color: COLOR_PALETTE.goldAccent,
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerStack}>
        <Text style={styles.headerSubtitle}>ADVANCED ECOSYSTEM</Text>
        <Text style={styles.headerTitle}>Build & Reflect</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        snapToInterval={width * 0.75 + SPACING.lg}
        decelerationRate="fast"
      >
        {cards.map((card, index) => (
          <View key={index} style={[styles.card, { borderTopColor: card.color }]}>
            <View style={[styles.iconBox, { backgroundColor: card.color }]}>
              {card.icon}
            </View>
            <Text style={styles.cardTitle}>{card.title}</Text>
            <Text style={styles.cardDesc}>{card.desc}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: SPACING.xxl,
    backgroundColor: '#161719',
  },
  headerStack: {
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
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
    fontFamily: SERIF,
    fontSize: 32,
  },
  scrollContent: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.lg,
  },
  card: {
    width: width * 0.75,
    maxWidth: 350,
    backgroundColor: COLOR_PALETTE.surface,
    padding: SPACING.xl,
    borderRadius: RADIUS.lg,
    borderTopWidth: 4,
  },
  iconBox: {
    width: 64,
    height: 64,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  cardTitle: {
    color: '#FAFAFA',
    fontSize: 22,
    fontWeight: '700',
    fontFamily: SERIF,
    marginBottom: SPACING.sm,
  },
  cardDesc: {
    color: COLOR_PALETTE.textMuted,
    fontSize: 15,
    lineHeight: 22,
  },
});
